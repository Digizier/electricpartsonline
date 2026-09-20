const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT * FROM site_settings WHERE key = 'shipping'");
  if (res.rows.length === 0) {
    await client.query("INSERT INTO site_settings (key, value) VALUES ('shipping', $1)", [
      JSON.stringify({
        freeShippingThreshold: 5000,
        flatShippingFee: 250,
        deliveryPolicy: 'Standard delivery takes 1-3 business days across Pakistan. Urgent commercial orders can be dispatched via WhatsApp directly.'
      })
    ]);
    console.log('Inserted shipping settings into Supabase.');
  } else {
    await client.query("UPDATE site_settings SET value = $1 WHERE key = 'shipping'", [
      JSON.stringify({
        freeShippingThreshold: 5000,
        flatShippingFee: 250,
        deliveryPolicy: 'Standard delivery takes 1-3 business days across Pakistan. Urgent commercial orders can be dispatched via WhatsApp directly.'
      })
    ]);
    console.log('Updated shipping settings in Supabase.');
  }
  await client.end();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
