# ElectricPartsOnline (Usman Traders)

ElectricPartsOnline is a modern e-commerce storefront and admin management platform for commercial food service equipment parts, electrical components, plumbing fixtures, and industrial hardware.

## Features

- **Storefront & Catalog**:
  - Multi-tier category and subcategory navigation with interactive desktop menus and mobile slide-out navigation.
  - Dynamic filtering by category, nested subcategories, and manufacturer brands.
  - Real-time catalog search and 12-item pagination optimized for fast page loads and zero Cloudflare/Supabase quota limits.
  - Multi-variant product pages (sizes, colors), specification sheets, compatibility tables, and downloadable PDF manuals.
  - Interactive quantity selector with dynamic price recalculation.

- **Checkout & Ordering**:
  - Instant direct checkout with Buy Now and responsive shopping cart drawer.
  - Multiple payment methods: Cash on Delivery / Warehouse Pickup, EasyPaisa, JazzCash, Direct Bank Transfer, and WhatsApp Order.
  - Automatic coupon code system.
  - Instant scroll-to-top on route changes and order placement.

- **Admin Management Panel**:
  - **Orders Manager**: Live order tracker with status updates, filter by status, dynamic sidebar badge count, and printable PDF invoices.
  - **Product Manager**: Add, edit, and manage products, custom fields, variants, image galleries, and pricing.
  - **Category & Subcategory Manager**: Hierarchical multi-level subcategories with built-in client-side WebP image compression.
  - **Brand Manager**: Filterable brand catalog with logo uploads.
  - **Site Settings & Coupons**: Real-time store contact, shipping fees, announcements, and promotional discounts.
  - **Fixed Sidebar Layout**: Desktop sidebar remains anchored while the main content area scrolls smoothly.

- **Performance & Security**:
  - Client-side WebP image compression (< 80KB) preventing database bloat.
  - Static HTML export (`output: 'export'`) ready for Cloudflare Pages edge deployment.
  - 100% white-labeled architecture.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Cloud & DB**: Supabase (PostgreSQL, Storage)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Digizier/electricpartsonline.git
cd electricpartsonline
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your credentials:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```
Generates static export files in the `/out` directory ready for deployment on Cloudflare Pages.
