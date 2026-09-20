const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://kbdhvnejdmytqscqkjas.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZGh2bmVqZG15dHFzY3FramFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgwMDI4MSwiZXhwIjoyMTA1Mzc2MjgxfQ.LXmRAQeitO5mCKjW11VXg8pJFFx67n50uf4EQ7oBk0o'
);

async function test() {
  const imgUrl = 'https://m.media-amazon.com/images/I/514iLGkZIQL.jpg';
  console.log('Fetching test image:', imgUrl);
  const res = await fetch(imgUrl);
  const arrayBuffer = await res.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  console.log('Original size:', Math.round(inputBuffer.length / 1024), 'KB');

  const webpBuffer = await sharp(inputBuffer)
    .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  console.log('Compressed WebP size:', Math.round(webpBuffer.length / 1024), 'KB');

  const fileName = `catalog/test_pipeline_${Date.now()}.webp`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, webpBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true
    });

  if (error) {
    console.error('Upload error:', error);
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  console.log('Public CDN URL:', publicUrlData.publicUrl);
}

test().catch(console.error);
