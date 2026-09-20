const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  await client.connect();
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Tables:', tables.rows.map(r => r.table_name));

  for (const t of ['brands', 'orders', 'coupons', 'site_settings', 'hero_slides', 'inquiries']) {
    try {
      const cols = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `, [t]);
      console.log(`\nColumns for ${t}:`, cols.rows);
      const sample = await client.query(`SELECT * FROM ${t} LIMIT 3`);
      console.log(`Sample rows from ${t}:`, sample.rows);
    } catch(e) {
      console.log(`Error querying ${t}:`, e.message);
    }
  }
  await client.end();
}
checkSchema().catch(console.error);
