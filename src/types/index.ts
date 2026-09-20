export interface ManualItem {
  title: string;
  url: string;
  file_size?: string;
}

export interface SizeOption {
  name: string;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  part_number: string;
  oem_number?: string;
  brand_id?: string;
  category_id?: string;
  subcategory_id?: string;
  price: number;
  msrp?: number;
  discount_percent?: number;
  stock_quantity: number;
  is_in_stock: boolean;
  rating: number;
  review_count: number;
  thumbnail_url?: string;
  images: string[];
  description: string;
  details_bullets?: string[];
  specifications: Record<string, string>;
  compatibility: string[];
  manuals?: ManualItem[];
  enable_details_bullets?: boolean;
  enable_specs_compat?: boolean;
  enable_manuals?: boolean;
  enable_variants_reviews?: boolean;
  has_colors?: boolean;
  color_options?: string[];
  has_sizes?: boolean;
  size_options?: (string | SizeOption)[];
  show_reviews?: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new_arrival: boolean;
  is_top_rated: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Joins
  brand?: Brand;
  category?: Category;
  subcategory?: Subcategory;
}

export interface Subcategory {
  id: string;
  category_id: string;
  parent_id?: string | null;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  children?: Subcategory[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  subcategories?: Subcategory[];
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface OrderItem {
  product_id?: string;
  name: string;
  part_number: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  subtotal: number;
  variant_label?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  province?: string;
  postal_code?: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'dispatched' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  total_amount: number;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  coupon_code?: string;
  status: OrderStatus;
  items: OrderItem[];
  payment_method: 'whatsapp' | 'cod' | 'bank_transfer' | 'easypaisa' | 'jazzcash';
  payment_status?: 'unpaid' | 'paid' | 'verified';
  delivery_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_spend: number;
  is_active: boolean;
  expires_at?: string;
}

export interface GeneralSettings {
  storeName: string;
  companyName: string;
  domain: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapUrl: string;
  description: string;
  announcement: string;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  flatShippingFee: number;
  deliveryPolicy: string;
}

export interface PaymentMethodConfig {
  enabled: boolean;
  title?: string;
  bankName?: string;
  accountTitle?: string;
  accountNumber?: string;
  iban?: string;
}

export interface PaymentSettings {
  cod: PaymentMethodConfig;
  bankTransfer: PaymentMethodConfig;
  easyPaisa: PaymentMethodConfig;
  jazzCash: PaymentMethodConfig;
}

export interface PopupSettings {
  enabled: boolean;
  headline: string;
  subheadline: string;
  whatsappNumber: string;
}

export interface SiteSettings {
  general: GeneralSettings;
  shipping: ShippingSettings;
  payments: PaymentSettings;
  popup: PopupSettings;
}

export interface Inquiry {
  id: string;
  product_id?: string;
  model_number: string;
  equipment_brand?: string;
  customer_name?: string;
  contact_phone: string;
  contact_email?: string;
  notes?: string;
  status: 'new' | 'contacted' | 'resolved';
  created_at?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  badge_text?: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
}
