import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { compressImageToWebP } from './imageCompressor';

const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kbdhvnejdmytqscqkjas.supabase.co'
).trim().replace(/^["']|["']$/g, '');

const SUPABASE_ANON_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZGh2bmVqZG15dHFzY3FramFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MDAyODEsImV4cCI6MjEwNTM3NjI4MX0.Px8qVjwc_CSN5G4Op7KQG6wDbSx1Vy0-UySDkhLh-rk'
).trim().replace(/^["']|["']$/g, '');

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabase();

/**
 * Uploads an image directly to Supabase Storage ('product-images' bucket)
 * Automatically compresses to WebP format in KB size first.
 * Returns the short public CDN URL (~60 bytes).
 */
export async function uploadImageToSupabase(
  file: File,
  folder: string = 'catalog'
): Promise<{ url: string; sizeKB: number; originalName: string }> {
  const { blob, fileName, sizeKB } = await compressImageToWebP(file);
  const client = getSupabase();

  const filePath = `${folder}/${fileName}`;
  const { data, error } = await client.storage
    .from('product-images')
    .upload(filePath, blob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = client.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return {
    url: publicUrlData.publicUrl,
    sizeKB,
    originalName: file.name,
  };
}
