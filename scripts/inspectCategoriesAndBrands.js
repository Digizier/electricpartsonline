const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const cats = await client.query('SELECT id, name, slug FROM categories ORDER BY sort_order');
  console.log('--- CATEGORIES ---');
  console.log(cats.rows);

  const subcats = await client.query('SELECT id, category_id, name, slug FROM subcategories ORDER BY name');
  console.log('--- SUBCATEGORIES ---');
  console.log(subcats.rows);

  const brands = await client.query('SELECT id, name, slug FROM brands ORDER BY name');
  console.log('--- BRANDS ---');
  console.log(brands.rows);

  await client.end();
}

run().catch(console.error);
