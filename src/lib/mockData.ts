import { Product, Category, Brand, Order, SiteSettings, Coupon, HeroSlide } from '@/types';

export const INITIAL_SETTINGS: SiteSettings = {
  general: {
    storeName: 'Usman Traders / ElectricPartsOnline.com',
    companyName: 'Usman Traders',
    domain: 'electricpartsonline.com',
    phone: '0321-8888872',
    whatsapp: '0321-8888872',
    email: 'usmanmalik9866@gmail.com',
    address: 'Usman Traders, Commercial Equipment Parts Market',
    mapUrl: 'https://maps.app.goo.gl/QA89GdbJBnTMPgou7',
    description: 'Electrical, Plumbing, Hardware & Kitchen Parts — your one-stop shop for quality commercial fittings, fixtures, and supplies.',
    announcement: 'FAST COMMERCIAL DISPATCH • GENUINE OEM REPLACEMENT PARTS • 100% QUALITY GUARANTEED',
    instagramUrl: 'https://www.instagram.com/usmantraders.electric?stkn=MWNlaGlpaGwwYWFvMA==',
    tiktokUrl: 'https://www.tiktok.com/@usmantraders_electric?_r=1&_t=ZS-99t6QIpYkjI',
    facebookUrl: 'https://www.facebook.com/share/18dJmrRRcu/',
  },
  shipping: {
    freeShippingThreshold: 5000,
    flatShippingFee: 250,
    deliveryPolicy: 'Standard delivery takes 1-3 business days. Urgent commercial orders can be dispatched via WhatsApp directly.'
  },
  payments: {
    cod: { enabled: true, title: 'Cash on Delivery / Warehouse Pickup' },
    bankTransfer: {
      enabled: true,
      bankName: 'Meezan Bank Limited',
      accountTitle: 'Usman Traders',
      accountNumber: '01010102938475',
      iban: 'PK52MEZN0001010102938475'
    },
    easyPaisa: {
      enabled: true,
      accountTitle: 'Usman Malik',
      accountNumber: '0321-8888872'
    },
    jazzCash: {
      enabled: true,
      accountTitle: 'Usman Malik',
      accountNumber: '0321-8888872'
    }
  },
  popup: {
    enabled: true,
    headline: 'Need Help Finding The Right Part?',
    subheadline: 'Chat directly with our parts specialist on WhatsApp with your equipment model number!',
    whatsappNumber: '0321-8888872'
  }
};

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b-hatco', name: 'Hatco', slug: 'hatco', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: true, is_active: true },
  { id: 'b-taylor', name: 'Taylor', slug: 'taylor', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: true, is_active: true },
  { id: 'b-flojet', name: 'FLOJET', slug: 'flojet', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: true, is_active: true },
  { id: 'b-vevor', name: 'VEVOR', slug: 'vevor', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: true, is_active: true },
  { id: 'b-true', name: 'TRUE', slug: 'true', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: true, is_active: true },
  { id: 'b-silver-king', name: 'Silver King', slug: 'silver-king', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: true, is_active: true },
  { id: 'b-manitowoc', name: 'MANITOWOC', slug: 'manitowoc', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: true, is_active: true },
  { id: 'b-robertshaw', name: 'Robertshaw', slug: 'robertshaw', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: false, is_active: true },
  { id: 'b-honeywell', name: 'Honeywell', slug: 'honeywell', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: false, is_active: true },
  { id: 'b-siemens', name: 'Siemens', slug: 'siemens', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80', is_featured: false, is_active: true }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'c-fryer',
    name: 'Fryer Parts',
    slug: 'fryer-parts',
    image_url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80',
    description: 'Heating elements, thermostats, fryer baskets, valves, and safety switches for commercial deep fryers.',
    sort_order: 1,
    is_active: true,
    subcategories: [
      { id: 'sub-1', category_id: 'c-fryer', name: 'Heating Elements', slug: 'heating-elements', sort_order: 1, is_active: true },
      { id: 'sub-2', category_id: 'c-fryer', name: 'Thermostats', slug: 'thermostats', sort_order: 2, is_active: true },
      { id: 'sub-3', category_id: 'c-fryer', name: 'Fryer Baskets', slug: 'fryer-baskets', sort_order: 3, is_active: true },
      { id: 'sub-4', category_id: 'c-fryer', name: 'Drain Valves', slug: 'drain-valves', sort_order: 4, is_active: true },
      { id: 'sub-5', category_id: 'c-fryer', name: 'Element Gaskets', slug: 'element-gaskets', sort_order: 5, is_active: true }
    ]
  },
  {
    id: 'c-bev',
    name: 'Beverage Parts',
    slug: 'beverage-parts',
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&q=80',
    description: 'Water pumps, dispensing valves, beverage tubing, syrup pumps, and motors.',
    sort_order: 2,
    is_active: true,
    subcategories: [
      { id: 'sub-6', category_id: 'c-bev', name: 'Water Pumps', slug: 'water-pumps', sort_order: 1, is_active: true },
      { id: 'sub-7', category_id: 'c-bev', name: 'Solenoid Valves', slug: 'solenoid-valves', sort_order: 2, is_active: true },
      { id: 'sub-8', category_id: 'c-bev', name: 'Dispenser Valves', slug: 'dispenser-valves', sort_order: 3, is_active: true }
    ]
  },
  {
    id: 'c-ice',
    name: 'Ice Machine Parts',
    slug: 'ice-machine-parts',
    image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&q=80',
    description: 'Control boards, water pumps, condensers, ice thickness sensors, and dump valves.',
    sort_order: 3,
    is_active: true,
    subcategories: [
      { id: 'sub-9', category_id: 'c-ice', name: 'Control Boards', slug: 'control-boards', sort_order: 1, is_active: true },
      { id: 'sub-10', category_id: 'c-ice', name: 'Circulation Pumps', slug: 'circulation-pumps', sort_order: 2, is_active: true }
    ]
  },
  {
    id: 'c-toast',
    name: 'Bun Toaster Parts',
    slug: 'bun-toaster-parts',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80',
    description: 'Conveyor belts, heating platens, drive gears, motors, and temperature controls.',
    sort_order: 4,
    is_active: true,
    subcategories: [
      { id: 'sub-11', category_id: 'c-toast', name: 'Conveyor Belts', slug: 'conveyor-belts', sort_order: 1, is_active: true }
    ]
  },
  {
    id: 'c-plumb',
    name: 'Plumbing Parts',
    slug: 'plumbing-parts',
    image_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80',
    description: 'Commercial pre-rinse faucets, heavy duty brass valves, check valves, and drain components.',
    sort_order: 5,
    is_active: true,
    subcategories: [
      { id: 'sub-12', category_id: 'c-plumb', name: 'Pre-Rinse Faucets', slug: 'pre-rinse-faucets', sort_order: 1, is_active: true },
      { id: 'sub-13', category_id: 'c-plumb', name: 'Brass Valves', slug: 'brass-valves', sort_order: 2, is_active: true }
    ]
  },
  {
    id: 'c-elec',
    name: 'Electrical Parts',
    slug: 'electrical-parts',
    image_url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=500&q=80',
    description: 'Heavy duty contactors, relays, terminal blocks, high-limit switches, and circuit breakers.',
    sort_order: 6,
    is_active: true,
    subcategories: [
      { id: 'sub-14', category_id: 'c-elec', name: 'Contactors', slug: 'contactors', sort_order: 1, is_active: true },
      { id: 'sub-15', category_id: 'c-elec', name: 'Relays', slug: 'relays', sort_order: 2, is_active: true }
    ]
  },
  {
    id: 'c-gas',
    name: 'Gas Components',
    slug: 'gas-components',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&q=80',
    description: 'Commercial gas valves, pilot assemblies, thermocouples, gas burners, and pressure regulators.',
    sort_order: 7,
    is_active: true,
    subcategories: [
      { id: 'sub-16', category_id: 'c-gas', name: 'Gas Valves', slug: 'gas-valves', sort_order: 1, is_active: true },
      { id: 'sub-17', category_id: 'c-gas', name: 'Gas Burners', slug: 'gas-burners', sort_order: 2, is_active: true }
    ]
  },
  {
    id: 'c-hard',
    name: 'Hardware Parts',
    slug: 'hardware-parts',
    image_url: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=500&q=80',
    description: 'Stainless steel equipment legs, door hinges, latches, gaskets, and shelving hardware.',
    sort_order: 8,
    is_active: true,
    subcategories: [
      { id: 'sub-18', category_id: 'c-hard', name: 'Equipment Legs', slug: 'equipment-legs', sort_order: 1, is_active: true }
    ]
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: '208V 4500W Fryer Heating Element',
    slug: '208v-4500w-fryer-heating-element',
    part_number: 'HTR-4500-208',
    oem_number: 'OEM-HAT-4500',
    brand_id: 'b-hatco',
    category_id: 'c-fryer',
    price: 9000,
    msrp: 10600,
    discount_percent: 15,
    stock_quantity: 25,
    is_in_stock: true,
    rating: 4.8,
    review_count: 12,
    thumbnail_url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80'
    ],
    description: 'This 208V 4500W fryer heating element is engineered specifically for heavy-duty commercial deep fryers. Manufactured with commercial-grade high-nickel alloy stainless steel, it provides reliable and efficient heating performance, ensuring consistent cooking results and long service life.',
    details_bullets: [
      'Power: 4500 Watts heavy-duty commercial rating',
      'Voltage: 208V single or three-phase compatible',
      'Material: Commercial high-nickel alloy stainless steel',
      'Terminal Type: Standard commercial 3-Pole flange fitting',
      'Length: 15.5 inches (approx.) drop-in replacement fit',
      'Application: Commercial Deep Fryer continuous cooking'
    ],
    specifications: {
      'Part Number': 'HTR-4500-208',
      'Power': '4500 Watts',
      'Voltage': '208V',
      'Material': 'Stainless Steel',
      'Type': 'Heating Element',
      'Length': '15.5 inches (approx.)',
      'Terminal': '3 Pole'
    },
    compatibility: [
      'Hatco Fryers',
      'Pitco Fryers',
      'Vulcan Fryers',
      'Frymaster Fryers',
      'Other Brands (Check Model)'
    ],
    manuals: [
      { title: 'OEM Technical Specification Sheet', url: 'https://example.com/spec-sheet.pdf', file_size: '2.4 MB' },
      { title: 'Commercial Equipment Wiring Diagram', url: 'https://example.com/wiring-diagram.pdf', file_size: '1.2 MB' },
      { title: 'Step-by-Step Installation & Safety Guide', url: 'https://example.com/installation-guide.pdf', file_size: '850 KB' }
    ],
    has_colors: false,
    color_options: ['Stainless Steel', 'Industrial Black'],
    has_sizes: true,
    size_options: ['Standard (15.5-Inch)', 'Extended (18-Inch)'],
    show_reviews: false,
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true
  },
  {
    id: 'p-2',
    name: 'Thermostat (High Limit)',
    slug: 'thermostat-high-limit',
    part_number: '7H-112',
    oem_number: 'OEM-ROB-7H112',
    brand_id: 'b-robertshaw',
    category_id: 'c-fryer',
    price: 4600,
    msrp: 5200,
    discount_percent: 12,
    stock_quantity: 40,
    is_in_stock: true,
    rating: 4.8,
    review_count: 8,
    thumbnail_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'],
    description: 'Commercial fryer high-limit manual reset thermostat designed to cut power if grease temperature exceeds 450°F, preventing fire hazards and thermal runaway.',
    specifications: {
      'Part Number': '7H-112',
      'Cut-off Temp': '450°F (232°C)',
      'Capillary Length': '30 inches',
      'Reset Type': 'Manual Push Button'
    },
    compatibility: ['Pitco Fryers', 'Frymaster', 'Vulcan'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: false,
    is_active: true
  },
  {
    id: 'p-3',
    name: 'Water Pump',
    slug: 'water-pump',
    part_number: '340101',
    oem_number: 'OEM-FLO-3401',
    brand_id: 'b-flojet',
    category_id: 'c-bev',
    price: 13000,
    msrp: 15000,
    discount_percent: 13,
    stock_quantity: 18,
    is_in_stock: true,
    rating: 4.9,
    review_count: 15,
    thumbnail_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80'],
    description: 'Heavy duty diaphragm water pump engineered for beverage dispensing stations, espresso bars, and commercial ice makers.',
    specifications: {
      'Part Number': '340101',
      'Flow Rate': '1.5 GPM',
      'Pressure': '60 PSI',
      'Voltage': '115V / 60Hz'
    },
    compatibility: ['Bunn Beverage Stations', 'Manitowoc', 'Taylor Soft Serve'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true
  },
  {
    id: 'p-4',
    name: 'Solenoid Valve',
    slug: 'solenoid-valve',
    part_number: 'SV-102',
    oem_number: 'OEM-HON-SV102',
    brand_id: 'b-honeywell',
    category_id: 'c-bev',
    price: 7700,
    msrp: 8900,
    discount_percent: 14,
    stock_quantity: 32,
    is_in_stock: true,
    rating: 4.7,
    review_count: 10,
    thumbnail_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80'],
    description: 'Normally closed brass solenoid valve for water and gas lines in commercial food service equipment.',
    specifications: {
      'Part Number': 'SV-102',
      'Voltage': '120V AC',
      'Body': 'Forged Brass'
    },
    compatibility: ['Commercial Dishwashers', 'Steamers', 'Ice Machines'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: true,
    is_top_rated: false,
    is_active: true
  },
  {
    id: 'p-5',
    name: 'Ice Machine Control Board',
    slug: 'ice-machine-control-board',
    part_number: '200DS961',
    oem_number: 'OEM-MAN-200DS',
    brand_id: 'b-manitowoc',
    category_id: 'c-ice',
    price: 16000,
    msrp: 18500,
    discount_percent: 14,
    stock_quantity: 12,
    is_in_stock: true,
    rating: 4.8,
    review_count: 6,
    thumbnail_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80'],
    description: 'Microprocessor main logic board for Manitowoc commercial modular ice cubers with diagnostic LED display.',
    specifications: {
      'Part Number': '200DS961',
      'Voltage': '115V / 230V Compatible'
    },
    compatibility: ['Manitowoc Q-Series', 'S-Series', 'Indigo Series'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: true,
    is_bestseller: false,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true
  },
  {
    id: 'p-6',
    name: 'Gas Burner',
    slug: 'gas-burner',
    part_number: '10142',
    oem_number: 'OEM-VUL-10142',
    brand_id: 'b-vevor',
    category_id: 'c-gas',
    price: 6900,
    msrp: 79.99,
    discount_percent: 14,
    stock_quantity: 28,
    is_in_stock: true,
    rating: 4.8,
    review_count: 9,
    thumbnail_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'],
    description: 'Cast iron tube burner replacement for commercial gas cooking griddles, charbroilers, and ranges.',
    specifications: {
      'Part Number': '10142',
      'Length': '20.5 inches',
      'Material': 'Commercial Cast Stainless / Alloy'
    },
    compatibility: ['Vulcan Ranges', 'Garland Griddles', 'Southbend Broilers'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: false,
    is_active: true
  },
  {
    id: 'p-7',
    name: 'Contactor 40A 2 Pole',
    slug: 'contactor-40a-2-pole',
    part_number: 'C-40A',
    oem_number: 'OEM-SIE-C40A',
    brand_id: 'b-siemens',
    category_id: 'c-elec',
    price: 7300,
    msrp: 8500,
    discount_percent: 14,
    stock_quantity: 35,
    is_in_stock: true,
    rating: 4.7,
    review_count: 6,
    thumbnail_url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80'],
    description: 'Definite purpose commercial 2-pole electrical contactor rated at 40 Amps with 120V AC coil.',
    specifications: {
      'Part Number': 'C-40A',
      'Amperage': '40 FLA',
      'Coil Voltage': '120V AC'
    },
    compatibility: ['Electric Fryers', 'Pizza Ovens', 'Walk-in Compressors'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    is_top_rated: false,
    is_active: true
  },
  {
    id: 'p-8',
    name: 'Temperature Probe',
    slug: 'temperature-probe',
    part_number: 'TP-100',
    oem_number: 'OEM-HAT-TP100',
    brand_id: 'b-hatco',
    category_id: 'c-fryer',
    price: 2900,
    msrp: 35.00,
    discount_percent: 18,
    stock_quantity: 50,
    is_in_stock: true,
    rating: 4.8,
    review_count: 10,
    thumbnail_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80'],
    description: 'High accuracy RTD temperature probe with coiled stainless lead wire for digital solid state fryer thermostats.',
    specifications: {
      'Part Number': 'TP-100',
      'Lead Wire': '36" Armored Cable'
    },
    compatibility: ['Hatco', 'Frymaster Computer Controls'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    is_top_rated: false,
    is_active: true
  },
  {
    id: 'p-9',
    name: 'Fryer Basket',
    slug: 'fryer-basket',
    part_number: 'FB-18',
    oem_number: 'OEM-FRY-FB18',
    brand_id: 'b-vevor',
    category_id: 'c-fryer',
    price: 6500,
    msrp: 7500,
    discount_percent: 13,
    stock_quantity: 45,
    is_in_stock: true,
    rating: 4.9,
    review_count: 7,
    thumbnail_url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80'],
    description: 'Heavy gauge steel wire fryer basket with reinforced mesh bottom and rubberized cool-touch handle.',
    specifications: {
      'Part Number': 'FB-18',
      'Dimensions': '13-1/4" L x 5-5/8" W x 5-5/8" H'
    },
    compatibility: ['Pitco 35C+', 'Frymaster GF14', 'Dean Super Runner'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: false,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true
  },
  {
    id: 'p-10',
    name: 'Drain Valve',
    slug: 'drain-valve',
    part_number: 'DV-3/4',
    oem_number: 'OEM-TRU-DV34',
    brand_id: 'b-true',
    category_id: 'c-fryer',
    price: 3900,
    msrp: 46.00,
    discount_percent: 16,
    stock_quantity: 30,
    is_in_stock: true,
    rating: 4.8,
    review_count: 5,
    thumbnail_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80'],
    description: 'High temperature Teflon seal full-port brass drain ball valve with insulated latch lock handle.',
    specifications: {
      'Part Number': 'DV-3/4',
      'Size': '3/4" Female NPT'
    },
    compatibility: ['All Commercial Fryers and Hot Oil Filter Systems'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: false,
    is_top_rated: false,
    is_active: true
  },
  {
    id: 'p-11',
    name: 'Element Gasket',
    slug: 'element-gasket',
    part_number: 'GKT-4500',
    oem_number: 'OEM-HAT-GKT',
    brand_id: 'b-hatco',
    category_id: 'c-fryer',
    price: 1300,
    msrp: 1600,
    discount_percent: 19,
    stock_quantity: 100,
    is_in_stock: true,
    rating: 4.9,
    review_count: 4,
    thumbnail_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80'],
    description: 'High-temperature silicone elastomer flange gasket for sealing element headers against frypots without leaks.',
    specifications: {
      'Part Number': 'GKT-4500',
      'Material': 'Food Grade High-Temp Silicone'
    },
    compatibility: ['Hatco HTR-4500', 'Pitco 4500W Series'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    is_top_rated: false,
    is_active: true
  },
  {
    id: 'p-12',
    name: 'Gas Valve for Commercial Fryer (Honeywell / Robertshaw Style)',
    slug: 'gas-valve-for-commercial-fryer',
    part_number: 'GV-004',
    oem_number: 'OEM-HON-GV004',
    brand_id: 'b-honeywell',
    category_id: 'c-gas',
    price: 16500,
    msrp: 195.00,
    discount_percent: 16,
    stock_quantity: 14,
    is_in_stock: true,
    rating: 4.9,
    review_count: 14,
    thumbnail_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'],
    description: 'Standard 750mV millivolt combination commercial gas valve with manual ON/OFF safety valve and natural gas / LP regulator.',
    specifications: {
      'Part Number': 'GV-004',
      'Gas Type': 'Natural Gas / LP Gas Convertible',
      'Electrical': '750mV Powerpile / Thermopile'
    },
    compatibility: ['Commercial Fryers', 'Baking Ovens', 'Griddles'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: true,
    is_bestseller: true,
    is_new_arrival: false,
    is_top_rated: true,
    is_active: true
  },
  {
    id: 'p-13',
    name: 'Bun Toaster Conveyor Belt',
    slug: 'bun-toaster-conveyor-belt',
    part_number: 'BT-003',
    oem_number: 'OEM-HAT-BT003',
    brand_id: 'b-hatco',
    category_id: 'c-toast',
    price: 7500,
    msrp: 88.00,
    discount_percent: 15,
    stock_quantity: 19,
    is_in_stock: true,
    rating: 4.8,
    review_count: 8,
    thumbnail_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80'],
    description: 'Stainless steel continuous wire link conveyor belt for high-volume commercial hamburger bun toasters.',
    specifications: {
      'Part Number': 'BT-003',
      'Width': '10.5 inches'
    },
    compatibility: ['Hatco Toast-Qwik Series'],
    enable_details_bullets: true,
    enable_specs_compat: true,
    enable_manuals: true,
    enable_variants_reviews: true,
    is_featured: false,
    is_bestseller: false,
    is_new_arrival: true,
    is_top_rated: false,
    is_active: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    order_number: '#10048',
    customer_name: 'Ahmed Khan',
    customer_phone: '0300-1234567',
    customer_email: 'ahmed.khan@example.com',
    shipping_address: { city: 'Lahore', address: 'Shop 14, Commercial Food Street', province: 'Punjab' },
    total_amount: 320.00,
    subtotal: 305.00,
    shipping_fee: 15.00,
    discount_amount: 0,
    status: 'pending',
    items: [
      { name: '208V 4500W Fryer Heating Element', part_number: 'HTR-4500-208', price: 9000, quantity: 2, subtotal: 18000 },
      { name: 'Thermostat (High Limit)', part_number: '7H-112', price: 4600, quantity: 1, subtotal: 4600 },
      { name: 'Water Pump', part_number: '340101', price: 13000, quantity: 1, subtotal: 13000 }
    ],
    payment_method: 'whatsapp',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'ord-2',
    order_number: '#10047',
    customer_name: 'Fatima Noor',
    customer_phone: '0321-9876543',
    customer_email: 'fatima@bakerykitchen.pk',
    shipping_address: { city: 'Karachi', address: 'Plot 42-C, Phase 5, DHA', province: 'Sindh' },
    total_amount: 185.50,
    subtotal: 170.50,
    shipping_fee: 15.00,
    discount_amount: 0,
    status: 'processing',
    items: [
      { name: 'Solenoid Valve', part_number: 'SV-102', price: 7700, quantity: 2, subtotal: 15400 },
      { name: 'Element Gasket', part_number: 'GKT-4500', price: 1300, quantity: 1, subtotal: 1300 }
    ],
    payment_method: 'bank_transfer',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    id: 'ord-3',
    order_number: '#10046',
    customer_name: 'Usman Ali',
    customer_phone: '0333-5554433',
    customer_email: 'usman.rest@fastfood.pk',
    shipping_address: { city: 'Islamabad', address: 'Sector F-7/2, Commercial Plaza', province: 'ICT' },
    total_amount: 540.00,
    subtotal: 540.00,
    shipping_fee: 0.00,
    discount_amount: 0,
    status: 'shipped',
    items: [
      { name: 'Ice Machine Control Board', part_number: '200DS961', price: 16000, quantity: 2, subtotal: 32000 },
      { name: 'Gas Valve for Commercial Fryer', part_number: 'GV-004', price: 16500, quantity: 1, subtotal: 16500 },
      { name: 'Contactor 40A 2 Pole', part_number: 'C-40A', price: 7300, quantity: 1, subtotal: 7300 }
    ],
    payment_method: 'easypaisa',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 'ord-4',
    order_number: '#10045',
    customer_name: 'Sara Ahmed',
    customer_phone: '0345-6677889',
    customer_email: 'sara.ahmed@cafedelux.pk',
    shipping_address: { city: 'Rawalpindi', address: 'Saddar Road, Commercial Area', province: 'Punjab' },
    total_amount: 270.75,
    subtotal: 255.75,
    shipping_fee: 15.00,
    discount_amount: 0,
    status: 'delivered',
    items: [
      { name: 'Water Pump', part_number: '340101', price: 13000, quantity: 1, subtotal: 13000 },
      { name: 'Bun Toaster Conveyor Belt', part_number: 'BT-003', price: 7500, quantity: 1, subtotal: 7500 },
      { name: 'Fryer Basket', part_number: 'FB-18', price: 6500, quantity: 1, subtotal: 6500 }
    ],
    payment_method: 'cod',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: 'ord-5',
    order_number: '#10044',
    customer_name: 'Mohsin Raza',
    customer_phone: '0312-3344556',
    customer_email: 'mohsin@grillhouse.pk',
    shipping_address: { city: 'Faisalabad', address: 'D-Ground, Main Market', province: 'Punjab' },
    total_amount: 410.25,
    subtotal: 410.25,
    shipping_fee: 0.00,
    discount_amount: 0,
    status: 'pending',
    items: [
      { name: 'Gas Valve for Commercial Fryer', part_number: 'GV-004', price: 16500, quantity: 2, subtotal: 33000 },
      { name: 'Gas Burner', part_number: '10142', price: 6900, quantity: 1, subtotal: 6900 }
    ],
    payment_method: 'whatsapp',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { id: 'c-1', code: 'PARTS10', discount_type: 'percentage', discount_value: 10, min_spend: 100, is_active: true },
  { id: 'c-2', code: 'FREESHIP', discount_type: 'fixed', discount_value: 15, min_spend: 200, is_active: true }
];

export const INITIAL_HERO: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'Usman Traders Commercial Kitchen Parts',
    subtitle: 'Electrical | Gas | Hardware Equipment Parts',
    badge_text: 'OEM PARTS',
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1920&q=85',
    cta_text: 'Shop Parts',
    cta_link: '/products/',
    sort_order: 1,
    is_active: true
  },
  {
    id: 'hero-2',
    title: 'Commercial Fryers & Bun Toaster Spares',
    subtitle: 'Timers, Heating Elements & Motors',
    badge_text: 'FAST DISPATCH',
    image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&q=85',
    cta_text: 'Explore Spares',
    cta_link: '/products/',
    sort_order: 2,
    is_active: true
  },
  {
    id: 'hero-3',
    title: 'Heavy Duty Ovens & Restaurant Equipment Parts',
    subtitle: 'Wholesale & Retail Across Pakistan',
    badge_text: 'BEST RATES',
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1920&q=85',
    cta_text: 'View Catalog',
    cta_link: '/products/',
    sort_order: 3,
    is_active: true
  }
];

