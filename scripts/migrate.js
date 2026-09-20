const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  await client.connect();
  console.log('Connected to PostgreSQL...');

  await client.query(`
    ALTER TABLE products ADD COLUMN IF NOT EXISTS enable_details_bullets BOOLEAN DEFAULT true;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS enable_specs_compat BOOLEAN DEFAULT true;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS enable_manuals BOOLEAN DEFAULT true;
    ALTER TABLE products ADD COLUMN IF NOT EXISTS enable_variants_reviews BOOLEAN DEFAULT true;
  `);
  console.log('Products columns added/verified.');

  await client.query(`
    ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES subcategories(id) ON DELETE CASCADE;
  `);
  console.log('Subcategories parent_id column added/verified.');

  // Update existing prices to PKR if under 1000
  const upd = await client.query(`
    UPDATE products 
    SET price = ROUND(price * 100, -2), 
        msrp = CASE WHEN msrp IS NOT NULL THEN ROUND(msrp * 100, -2) ELSE NULL END
    WHERE price < 1000;
  `);
  console.log('Updated prices count:', upd.rowCount);

  // Set boolean defaults for any NULLs
  await client.query(`
    UPDATE products 
    SET enable_details_bullets = COALESCE(enable_details_bullets, true),
        enable_specs_compat = COALESCE(enable_specs_compat, true),
        enable_manuals = COALESCE(enable_manuals, true),
        enable_variants_reviews = COALESCE(enable_variants_reviews, true);
  `);
  console.log('Defaults set for product toggles.');

  const sample = await client.query('SELECT name, price, msrp, enable_details_bullets, enable_specs_compat, enable_manuals, enable_variants_reviews FROM products LIMIT 3');
  console.log('Sample updated products:', sample.rows);

  await client.end();
}

migrate().catch(e => {
  console.error('Migration error:', e);
  process.exit(1);
});
