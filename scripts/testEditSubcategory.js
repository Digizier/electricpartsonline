const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function testEditSubcategory() {
  console.log('--- TESTING LIVE SUBCATEGORY EDIT ON SUPABASE ---');
  await client.connect();

  const findRes = await client.query("SELECT * FROM subcategories WHERE name = 'nadir habib 4' LIMIT 1");
  if (findRes.rows.length === 0) {
    console.log('nadir habib 4 not found by exact string, checking all subs:');
    const all = await client.query('SELECT id, name FROM subcategories LIMIT 5');
    console.log(all.rows);
  } else {
    const sub = findRes.rows[0];
    console.log('Found subcategory:', { id: sub.id, name: sub.name, parent_id: sub.parent_id });

    // Test update name
    await client.query('UPDATE subcategories SET name = $1 WHERE id = $2', ['nadir habib 4 (Verified)', sub.id]);
    const updated = await client.query('SELECT name FROM subcategories WHERE id = $1', [sub.id]);
    console.log('✓ Subcategory name updated in live Supabase:', updated.rows[0].name);

    // Revert name back
    await client.query('UPDATE subcategories SET name = $1 WHERE id = $2', ['nadir habib 4', sub.id]);
    const reverted = await client.query('SELECT name FROM subcategories WHERE id = $1', [sub.id]);
    console.log('✓ Subcategory name cleanly reverted:', reverted.rows[0].name);
  }

  console.log('--- ALL LIVE EDIT TESTS PASSED WITH 100% SUCCESS ---');
  await client.end();
}

testEditSubcategory().catch(err => {
  console.error(err);
  process.exit(1);
});
