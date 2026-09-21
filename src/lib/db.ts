import { getSupabase } from './supabase';
import {
  Product,
  Category,
  Subcategory,
  Brand,
  Order,
  SiteSettings,
  Coupon,
  HeroSlide,
  OrderStatus,
} from '@/types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_HERO,
} from './mockData';
import { slugify } from './utils';

const isBrowser = typeof window !== 'undefined';

function getLocal<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

function dispatchEvent(eventName: string): void {
  if (isBrowser) {
    window.dispatchEvent(new Event(eventName));
  }
}

export function isUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ==========================================
// 1. PRODUCTS
// ==========================================
export async function getProducts(options?: {
  categoryId?: string;
  brandId?: string;
  search?: string;
  limit?: number;
}): Promise<Product[]> {
  const supabase = getSupabase();
  try {
    let query = supabase
      .from('products')
      .select('id, name, slug, part_number, oem_number, brand_id, category_id, subcategory_id, price, msrp, discount_percent, stock_quantity, is_in_stock, rating, review_count, thumbnail_url, images, description, details_bullets, specifications, compatibility, manuals, enable_details_bullets, enable_specs_compat, enable_manuals, enable_variants_reviews, has_colors, color_options, has_sizes, size_options, show_reviews, is_featured, is_bestseller, is_new_arrival, is_top_rated, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (options?.categoryId) query = query.eq('category_id', options.categoryId);
    if (options?.brandId) query = query.eq('brand_id', options.brandId);
    if (options?.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      // Fallback to local storage or initial seed
      let local = getLocal<Product[]>('epo_products', INITIAL_PRODUCTS);
      if (options?.categoryId) local = local.filter(p => p.category_id === options.categoryId);
      if (options?.brandId) local = local.filter(p => p.brand_id === options.brandId);
      if (options?.search) {
        const s = options.search.toLowerCase();
        local = local.filter(p => p.name.toLowerCase().includes(s) || p.part_number.toLowerCase().includes(s));
      }
      return local;
    }
    // Update local cache seamlessly
    setLocal('epo_products', data);
    return data as Product[];
  } catch (err) {
    return getLocal<Product[]>('epo_products', INITIAL_PRODUCTS);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, part_number, oem_number, brand_id, category_id, subcategory_id, price, msrp, discount_percent, stock_quantity, is_in_stock, rating, review_count, thumbnail_url, images, description, details_bullets, specifications, compatibility, manuals, enable_details_bullets, enable_specs_compat, enable_manuals, enable_variants_reviews, has_colors, color_options, has_sizes, size_options, show_reviews, is_featured, is_bestseller, is_new_arrival, is_top_rated, is_active')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const local = getLocal<Product[]>('epo_products', INITIAL_PRODUCTS);
      return local.find(p => p.slug === slug) || null;
    }
    return data as Product;
  } catch (err) {
    const local = getLocal<Product[]>('epo_products', INITIAL_PRODUCTS);
    return local.find(p => p.slug === slug) || null;
  }
}

export async function saveProduct(product: Partial<Product>): Promise<Product> {
  const supabase = getSupabase();
  const id = (product.id && isUUID(product.id)) ? product.id : generateUUID();
  const fullProduct: Product = {
    id,
    name: product.name || 'New Part',
    slug: product.slug || `part-${Date.now()}`,
    part_number: product.part_number || 'PN-000',
    oem_number: product.oem_number || '',
    brand_id: product.brand_id || undefined,
    category_id: product.category_id || undefined,
    subcategory_id: product.subcategory_id || undefined,
    price: Number(product.price) || 0,
    msrp: product.msrp ? Number(product.msrp) : undefined,
    discount_percent: product.discount_percent || 0,
    stock_quantity: Number(product.stock_quantity) || 0,
    is_in_stock: (Number(product.stock_quantity) || 0) > 0,
    rating: product.rating || 4.8,
    review_count: product.review_count || 12,
    thumbnail_url: product.thumbnail_url || product.images?.[0] || '',
    images: product.images || [],
    description: product.description || '',
    details_bullets: product.details_bullets || [],
    specifications: product.specifications || {},
    compatibility: product.compatibility || [],
    manuals: product.manuals || [],
    enable_details_bullets: product.enable_details_bullets !== undefined ? product.enable_details_bullets : true,
    enable_specs_compat: product.enable_specs_compat !== undefined ? product.enable_specs_compat : true,
    enable_manuals: product.enable_manuals !== undefined ? product.enable_manuals : true,
    enable_variants_reviews: product.enable_variants_reviews !== undefined ? product.enable_variants_reviews : true,
    has_colors: !!product.has_colors,
    color_options: product.color_options || [],
    has_sizes: !!product.has_sizes,
    size_options: product.size_options || [],
    show_reviews: !!product.show_reviews,
    is_featured: !!product.is_featured,
    is_bestseller: !!product.is_bestseller,
    is_new_arrival: !!product.is_new_arrival,
    is_top_rated: !!product.is_top_rated,
    is_active: product.is_active !== undefined ? product.is_active : true,
  };

  try {
    await supabase.from('products').upsert(fullProduct);
  } catch (e) {
    console.warn('Supabase product upsert fallback to local:', e);
  }

  // Update local cache
  const local = getLocal<Product[]>('epo_products', INITIAL_PRODUCTS);
  const index = local.findIndex(p => p.id === fullProduct.id || p.slug === fullProduct.slug);
  if (index >= 0) {
    local[index] = fullProduct;
  } else {
    local.unshift(fullProduct);
  }
  setLocal('epo_products', local);
  dispatchEvent('epo_products_updated');

  return fullProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete product error:', e);
  }

  const local = getLocal<Product[]>('epo_products', INITIAL_PRODUCTS);
  const updated = local.filter(p => p.id !== id);
  setLocal('epo_products', updated);
  dispatchEvent('epo_products_updated');
}

// ==========================================
// 2. CATEGORIES & SUBCATEGORIES
// ==========================================
export function buildSubTree(parentId: string | null, items: Subcategory[]): Subcategory[] {
  return items
    .filter(item => (parentId === null ? !item.parent_id : item.parent_id === parentId))
    .map(item => {
      const children = buildSubTree(item.id, items);
      return {
        ...item,
        children: children.length > 0 ? children : undefined,
      };
    });
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabase();
  try {
    const { data: cats, error: catErr } = await supabase
      .from('categories')
      .select('id, name, slug, image_url, description, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    const { data: subs } = await supabase
      .from('subcategories')
      .select('id, category_id, parent_id, name, slug, image_url, description, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (catErr || !cats || cats.length === 0) {
      return getLocal<Category[]>('epo_categories', INITIAL_CATEGORIES);
    }

    const allSubs = (subs || []) as Subcategory[];
    setLocal('epo_all_subcategories', allSubs);

    const merged = cats.map(c => {
      const catSubs = allSubs.filter(s => s.category_id === c.id);
      return {
        ...c,
        subcategories: buildSubTree(null, catSubs),
      };
    });

    setLocal('epo_categories', merged);
    return merged as Category[];
  } catch (err) {
    return getLocal<Category[]>('epo_categories', INITIAL_CATEGORIES);
  }
}

export async function saveCategory(cat: Partial<Category>): Promise<Category> {
  const supabase = getSupabase();
  const id = (cat.id && isUUID(cat.id)) ? cat.id : generateUUID();
  const fullCategory: Category = {
    id,
    name: cat.name || 'New Category',
    slug: cat.slug || `category-${Date.now()}`,
    image_url: cat.image_url || '',
    description: cat.description || '',
    sort_order: cat.sort_order || 1,
    is_active: cat.is_active !== undefined ? cat.is_active : true,
    subcategories: cat.subcategories || [],
  };

  try {
    await supabase.from('categories').upsert({
      id: fullCategory.id,
      name: fullCategory.name,
      slug: fullCategory.slug,
      image_url: fullCategory.image_url,
      description: fullCategory.description,
      sort_order: fullCategory.sort_order,
      is_active: fullCategory.is_active,
    });
  } catch (e) {
    console.warn('Supabase category upsert fallback to local:', e);
  }

  const local = getLocal<Category[]>('epo_categories', INITIAL_CATEGORIES);
  const index = local.findIndex(c => c.id === fullCategory.id || c.slug === fullCategory.slug);
  if (index >= 0) {
    local[index] = { ...local[index], ...fullCategory };
  } else {
    local.push(fullCategory);
  }
  setLocal('epo_categories', local);
  dispatchEvent('epo_categories_updated');

  return fullCategory;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('categories').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete category error:', e);
  }

  const local = getLocal<Category[]>('epo_categories', INITIAL_CATEGORIES);
  const updated = local.filter(c => c.id !== id);
  setLocal('epo_categories', updated);
  dispatchEvent('epo_categories_updated');
}

export async function saveSubcategory(sub: Partial<Subcategory>): Promise<Subcategory> {
  const supabase = getSupabase();
  const id = (sub.id && isUUID(sub.id)) ? sub.id : generateUUID();
  const fullSub: Subcategory = {
    id,
    category_id: sub.category_id!,
    parent_id: sub.parent_id || null,
    name: sub.name || 'New Subcategory',
    slug: sub.slug || `sub-${Date.now()}`,
    image_url: sub.image_url || '',
    description: sub.description || '',
    sort_order: sub.sort_order || 1,
    is_active: sub.is_active !== undefined ? sub.is_active : true,
  };

  try {
    await supabase.from('subcategories').upsert({
      id: fullSub.id,
      category_id: fullSub.category_id,
      parent_id: fullSub.parent_id,
      name: fullSub.name,
      slug: fullSub.slug,
      image_url: fullSub.image_url,
      description: fullSub.description,
      sort_order: fullSub.sort_order,
      is_active: fullSub.is_active,
    });
  } catch (e) {
    console.warn('Subcategory upsert fallback to local:', e);
  }

  // Update flat local subcategories cache
  const allFlatSubs = getLocal<Subcategory[]>('epo_all_subcategories', []);
  const subIdx = allFlatSubs.findIndex(s => s.id === fullSub.id);
  if (subIdx >= 0) {
    allFlatSubs[subIdx] = fullSub;
  } else {
    allFlatSubs.push(fullSub);
  }
  setLocal('epo_all_subcategories', allFlatSubs);

  // Re-build category tree in local cache
  const localCats = getLocal<Category[]>('epo_categories', INITIAL_CATEGORIES);
  const updatedCats = localCats.map(c => {
    if (c.id === fullSub.category_id) {
      const catSubs = allFlatSubs.filter(s => s.category_id === c.id);
      return {
        ...c,
        subcategories: buildSubTree(null, catSubs)
      };
    }
    return c;
  });
  setLocal('epo_categories', updatedCats);
  dispatchEvent('epo_categories_updated');

  return fullSub;
}

export async function deleteSubcategory(id: string, categoryId: string): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('subcategories').delete().eq('id', id);
  } catch (e) {
    console.warn('Subcategory delete error:', e);
  }

  // Remove from flat cache and all descendant children
  const allFlatSubs = getLocal<Subcategory[]>('epo_all_subcategories', []);
  const toDelete = new Set<string>([id]);
  let added = true;
  while (added) {
    added = false;
    for (const s of allFlatSubs) {
      if (s.parent_id && toDelete.has(s.parent_id) && !toDelete.has(s.id)) {
        toDelete.add(s.id);
        added = true;
      }
    }
  }

  const remainingSubs = allFlatSubs.filter(s => !toDelete.has(s.id));
  setLocal('epo_all_subcategories', remainingSubs);

  const localCats = getLocal<Category[]>('epo_categories', INITIAL_CATEGORIES);
  const updatedCats = localCats.map(c => {
    if (c.id === categoryId) {
      const catSubs = remainingSubs.filter(s => s.category_id === c.id);
      return {
        ...c,
        subcategories: buildSubTree(null, catSubs)
      };
    }
    return c;
  });
  setLocal('epo_categories', updatedCats);
  dispatchEvent('epo_categories_updated');
}

// ==========================================
// 3. BRANDS
// ==========================================
export async function getBrands(): Promise<Brand[]> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, slug, logo_url, is_featured, is_active')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocal<Brand[]>('epo_brands', INITIAL_BRANDS);
    }
    setLocal('epo_brands', data);
    return data as Brand[];
  } catch (e) {
    return getLocal<Brand[]>('epo_brands', INITIAL_BRANDS);
  }
}

export async function saveBrand(brand: Partial<Brand>): Promise<Brand> {
  const supabase = getSupabase();
  const id = (brand.id && isUUID(brand.id)) ? brand.id : generateUUID();
  const fullBrand: Brand = {
    id,
    name: brand.name || 'New Brand',
    slug: brand.slug || slugify(brand.name || 'brand'),
    logo_url: brand.logo_url || '',
    is_featured: brand.is_featured !== undefined ? brand.is_featured : false,
    is_active: brand.is_active !== undefined ? brand.is_active : true,
  };

  try {
    await supabase.from('brands').upsert({
      id: fullBrand.id,
      name: fullBrand.name,
      slug: fullBrand.slug,
      logo_url: fullBrand.logo_url,
      is_featured: fullBrand.is_featured,
      is_active: fullBrand.is_active,
    });
  } catch (e) {
    console.warn('Supabase save brand error:', e);
  }

  const local = getLocal<Brand[]>('epo_brands', INITIAL_BRANDS);
  const idx = local.findIndex(b => b.id === fullBrand.id);
  if (idx >= 0) {
    local[idx] = fullBrand;
  } else {
    local.push(fullBrand);
  }
  setLocal('epo_brands', local);
  dispatchEvent('epo_brands_updated');

  return fullBrand;
}

export async function deleteBrand(id: string): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('brands').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete brand error:', e);
  }

  const local = getLocal<Brand[]>('epo_brands', INITIAL_BRANDS);
  const updated = local.filter(b => b.id !== id);
  setLocal('epo_brands', updated);
  dispatchEvent('epo_brands_updated');
}

// ==========================================
// 4. ORDERS
// ==========================================
export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return getLocal<Order[]>('epo_orders', INITIAL_ORDERS);
    }

    // Merge with any locally placed orders not yet in remote response
    const local = getLocal<Order[]>('epo_orders', []);
    const dataIds = new Set(data.map((o: any) => o.id));
    const pendingLocal = local.filter((o) => !dataIds.has(o.id));
    const merged = [...pendingLocal, ...(data as Order[])];

    setLocal('epo_orders', merged);
    return merged;
  } catch (e) {
    return getLocal<Order[]>('epo_orders', INITIAL_ORDERS);
  }
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const supabase = getSupabase();
  const id = (order.id && isUUID(order.id)) ? order.id : generateUUID();
  const orderNumber = order.order_number || `#${Math.floor(10000 + Math.random() * 90000)}`;
  const fullOrder: Order = {
    id,
    order_number: orderNumber,
    customer_name: order.customer_name || 'Customer',
    customer_email: order.customer_email || '',
    customer_phone: order.customer_phone || '',
    shipping_address: order.shipping_address || { address: '', city: 'Pakistan' },
    total_amount: Number(order.total_amount) || 0,
    subtotal: Number(order.subtotal) || 0,
    shipping_fee: Number(order.shipping_fee) || 0,
    discount_amount: Number(order.discount_amount) || 0,
    coupon_code: order.coupon_code || '',
    status: order.status || 'pending',
    items: order.items || [],
    payment_method: order.payment_method || 'whatsapp',
    payment_status: order.payment_status || 'unpaid',
    delivery_notes: order.delivery_notes || '',
    created_at: order.created_at || new Date().toISOString(),
  };

  try {
    await supabase.from('orders').insert({
      id: fullOrder.id,
      order_number: fullOrder.order_number,
      customer_name: fullOrder.customer_name,
      customer_email: fullOrder.customer_email,
      customer_phone: fullOrder.customer_phone,
      shipping_address: fullOrder.shipping_address,
      total_amount: fullOrder.total_amount,
      subtotal: fullOrder.subtotal,
      shipping_fee: fullOrder.shipping_fee,
      discount_amount: fullOrder.discount_amount,
      coupon_code: fullOrder.coupon_code,
      status: fullOrder.status,
      items: fullOrder.items,
      payment_method: fullOrder.payment_method,
      payment_status: fullOrder.payment_status,
      delivery_notes: fullOrder.delivery_notes,
      created_at: fullOrder.created_at,
    });
  } catch (e) {
    console.warn('Supabase create order error:', e);
  }

  const local = getLocal<Order[]>('epo_orders', INITIAL_ORDERS);
  local.unshift(fullOrder);
  setLocal('epo_orders', local);
  dispatchEvent('epo_orders_updated');

  return fullOrder;
}

export async function saveOrder(order: Partial<Order>): Promise<Order> {
  const supabase = getSupabase();
  const id = (order.id && isUUID(order.id)) ? order.id : generateUUID();
  const orderNumber = order.order_number || `#${Math.floor(10000 + Math.random() * 90000)}`;
  const fullOrder: Order = {
    id,
    order_number: orderNumber,
    customer_name: order.customer_name || 'Customer',
    customer_email: order.customer_email || '',
    customer_phone: order.customer_phone || '',
    shipping_address: order.shipping_address || { address: '', city: 'Pakistan' },
    total_amount: Number(order.total_amount) || 0,
    subtotal: Number(order.subtotal) || 0,
    shipping_fee: Number(order.shipping_fee) || 0,
    discount_amount: Number(order.discount_amount) || 0,
    coupon_code: order.coupon_code || '',
    status: order.status || 'pending',
    items: order.items || [],
    payment_method: order.payment_method || 'whatsapp',
    payment_status: order.payment_status || 'unpaid',
    delivery_notes: order.delivery_notes || '',
    created_at: order.created_at || new Date().toISOString(),
  };

  try {
    await supabase.from('orders').upsert({
      id: fullOrder.id,
      order_number: fullOrder.order_number,
      customer_name: fullOrder.customer_name,
      customer_email: fullOrder.customer_email,
      customer_phone: fullOrder.customer_phone,
      shipping_address: fullOrder.shipping_address,
      total_amount: fullOrder.total_amount,
      subtotal: fullOrder.subtotal,
      shipping_fee: fullOrder.shipping_fee,
      discount_amount: fullOrder.discount_amount,
      coupon_code: fullOrder.coupon_code,
      status: fullOrder.status,
      items: fullOrder.items,
      payment_method: fullOrder.payment_method,
      payment_status: fullOrder.payment_status,
      delivery_notes: fullOrder.delivery_notes,
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Supabase save order error:', e);
  }

  const local = getLocal<Order[]>('epo_orders', INITIAL_ORDERS);
  const idx = local.findIndex(o => o.id === fullOrder.id);
  if (idx >= 0) {
    local[idx] = fullOrder;
  } else {
    local.unshift(fullOrder);
  }
  setLocal('epo_orders', local);
  dispatchEvent('epo_orders_updated');

  return fullOrder;
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('orders').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete order error:', e);
  }

  const local = getLocal<Order[]>('epo_orders', INITIAL_ORDERS);
  const updated = local.filter(o => o.id !== id);
  setLocal('epo_orders', updated);
  dispatchEvent('epo_orders_updated');
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('orders').update({ status }).eq('id', id);
  } catch (e) {
    console.warn('Supabase update order status error:', e);
  }

  const local = getLocal<Order[]>('epo_orders', INITIAL_ORDERS);
  const found = local.find(o => o.id === id);
  if (found) {
    found.status = status;
    setLocal('epo_orders', local);
    dispatchEvent('epo_orders_updated');
  }
}

// ==========================================
// 5. SITE SETTINGS
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error || !data || data.length === 0) {
      return getLocal<SiteSettings>('epo_settings', INITIAL_SETTINGS);
    }

    const settings: SiteSettings = { ...INITIAL_SETTINGS };
    data.forEach(row => {
      if (row.key === 'general') settings.general = row.value;
      if (row.key === 'shipping') settings.shipping = row.value;
      if (row.key === 'payments') settings.payments = row.value;
      if (row.key === 'popup') settings.popup = row.value;
    });

    setLocal('epo_settings', settings);
    return settings;
  } catch (e) {
    return getLocal<SiteSettings>('epo_settings', INITIAL_SETTINGS);
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const supabase = getSupabase();
  try {
    for (const [key, val] of Object.entries(settings)) {
      await supabase.from('site_settings').upsert({ key, value: val, updated_at: new Date().toISOString() });
    }
  } catch (e) {
    console.warn('Supabase site_settings error:', e);
  }

  setLocal('epo_settings', settings);
  dispatchEvent('epo_settings_updated');
}

// ==========================================
// 6. COUPONS
// ==========================================
export async function getCoupons(): Promise<Coupon[]> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase.from('coupons').select('*').eq('is_active', true);
    if (error || !data || data.length === 0) {
      return getLocal<Coupon[]>('epo_coupons', INITIAL_COUPONS).filter(c => c.is_active);
    }
    setLocal('epo_coupons', data);
    return data as Coupon[];
  } catch (e) {
    return getLocal<Coupon[]>('epo_coupons', INITIAL_COUPONS).filter(c => c.is_active);
  }
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase.from('coupons').select('*').order('code', { ascending: true });
    if (error || !data || data.length === 0) {
      return getLocal<Coupon[]>('epo_coupons', INITIAL_COUPONS);
    }
    setLocal('epo_coupons', data);
    return data as Coupon[];
  } catch (e) {
    return getLocal<Coupon[]>('epo_coupons', INITIAL_COUPONS);
  }
}

export async function saveCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
  const supabase = getSupabase();
  const id = (coupon.id && isUUID(coupon.id)) ? coupon.id : generateUUID();
  const fullCoupon: Coupon = {
    id,
    code: (coupon.code || 'SALE10').toUpperCase().trim(),
    discount_type: coupon.discount_type || 'percentage',
    discount_value: Number(coupon.discount_value) || 10,
    min_spend: Number(coupon.min_spend) || 0,
    is_active: coupon.is_active !== undefined ? coupon.is_active : true,
    expires_at: coupon.expires_at,
  };

  try {
    await supabase.from('coupons').upsert(fullCoupon);
  } catch (e) {
    console.warn('Supabase save coupon error:', e);
  }

  const local = getLocal<Coupon[]>('epo_coupons', INITIAL_COUPONS);
  const idx = local.findIndex(c => c.id === fullCoupon.id || c.code === fullCoupon.code);
  if (idx >= 0) {
    local[idx] = fullCoupon;
  } else {
    local.push(fullCoupon);
  }
  setLocal('epo_coupons', local);
  dispatchEvent('epo_coupons_updated');

  return fullCoupon;
}

export async function deleteCoupon(id: string): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('coupons').delete().eq('id', id);
  } catch (e) {
    console.warn('Supabase delete coupon error:', e);
  }

  const local = getLocal<Coupon[]>('epo_coupons', INITIAL_COUPONS);
  const updated = local.filter(c => c.id !== id);
  setLocal('epo_coupons', updated);
  dispatchEvent('epo_coupons_updated');
}

// ==========================================
// 7. HERO SLIDES
// ==========================================
export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      const local = getLocal<HeroSlide[]>('epo_hero', INITIAL_HERO);
      return local.filter(s => s.is_active !== false);
    }
    setLocal('epo_hero', data);
    return data as HeroSlide[];
  } catch (e) {
    const local = getLocal<HeroSlide[]>('epo_hero', INITIAL_HERO);
    return local.filter(s => s.is_active !== false);
  }
}

export async function getAllHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return getLocal<HeroSlide[]>('epo_hero', INITIAL_HERO);
    }
    setLocal('epo_hero', data);
    return data as HeroSlide[];
  } catch (e) {
    return getLocal<HeroSlide[]>('epo_hero', INITIAL_HERO);
  }
}

export async function saveHeroSlide(slide: Partial<HeroSlide>): Promise<HeroSlide> {
  const supabase = getSupabase();
  const id = (slide.id && isUUID(slide.id)) ? slide.id : generateUUID();
  const fullSlide: HeroSlide = {
    id,
    title: slide.title || '',
    subtitle: slide.subtitle || '',
    badge_text: slide.badge_text || '',
    image_url: slide.image_url || '',
    cta_text: slide.cta_text || 'Shop Now',
    cta_link: slide.cta_link || '/products/',
    sort_order: typeof slide.sort_order === 'number' ? slide.sort_order : 1,
    is_active: slide.is_active !== undefined ? slide.is_active : true,
  };

  try {
    await supabase.from('hero_slides').upsert(fullSlide);
  } catch (e) {
    console.warn('Hero slide sync error:', e);
  }

  const local = getLocal<HeroSlide[]>('epo_hero', INITIAL_HERO);
  const idx = local.findIndex(s => s.id === fullSlide.id);
  if (idx >= 0) {
    local[idx] = fullSlide;
  } else {
    local.push(fullSlide);
  }
  setLocal('epo_hero', local);
  dispatchEvent('epo_hero_updated');

  return fullSlide;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const supabase = getSupabase();
  try {
    await supabase.from('hero_slides').delete().eq('id', id);
  } catch (e) {
    console.warn('Hero slide delete error:', e);
  }

  const local = getLocal<HeroSlide[]>('epo_hero', INITIAL_HERO);
  const filtered = local.filter(s => s.id !== id);
  setLocal('epo_hero', filtered);
  dispatchEvent('epo_hero_updated');
}

