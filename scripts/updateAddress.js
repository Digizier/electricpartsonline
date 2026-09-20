const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT value FROM site_settings WHERE key = 'general'");
  if (res.rows.length > 0) {
    const val = res.rows[0].value;
    val.address = 'Shop #19, Block N, Usman Traders (Near Pepsi Cola Factory), Gulberg 2, Lahore, 54000';
    await client.query("UPDATE site_settings SET value = $1 WHERE key = 'general'", [JSON.stringify(val)]);
    console.log('Updated address in Supabase site_settings!');
  }
  await client.end();
}

run().catch(console.error);
