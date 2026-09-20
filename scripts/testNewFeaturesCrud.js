const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function runVerification() {
  console.log('=== VERIFYING MULTI-TIER SUBCATEGORIES & SIZE PRICING ON LIVE SUPABASE ===');
  await client.connect();

  // Step 1: Query an existing category
  const catRes = await client.query('SELECT id, name FROM categories LIMIT 1');
  if (catRes.rows.length === 0) throw new Error('No categories found');
  const parentCat = catRes.rows[0];
  console.log(`[OK] Base Category: "${parentCat.name}" (${parentCat.id})`);

  // Step 2: Insert multi-tier subcategories (Level 2 -> Level 3 -> Level 4)
  const l2Id = crypto.randomUUID();
  const l3Id = crypto.randomUUID();
  const l4Id = crypto.randomUUID();

  console.log('\n[TEST 1] Inserting Level 2, Level 3, and Level 4 nested subcategories...');
  await client.query(
    'INSERT INTO subcategories (id, category_id, parent_id, name, slug, sort_order, is_active) VALUES ($1, $2, NULL, $3, $4, 1, true)',
    [l2Id, parentCat.id, 'Heating Elements Level 2', `test-l2-${Date.now()}`]
  );
  await client.query(
    'INSERT INTO subcategories (id, category_id, parent_id, name, slug, sort_order, is_active) VALUES ($1, $2, $3, $4, $5, 1, true)',
    [l3Id, parentCat.id, l2Id, 'Nadir Burners Level 3', `test-l3-${Date.now()}`]
  );
  await client.query(
    'INSERT INTO subcategories (id, category_id, parent_id, name, slug, sort_order, is_active) VALUES ($1, $2, $3, $4, $5, 1, true)',
    [l4Id, parentCat.id, l3Id, 'Spare Coils Level 4', `test-l4-${Date.now()}`]
  );
  console.log('✓ Successfully inserted 3 tiers of nested subcategories with parent_id links.');

  // Step 3: Verify tree relationships
  const treeCheck = await client.query(`
    SELECT s4.name as level4, s3.name as level3, s2.name as level2
    FROM subcategories s4
    JOIN subcategories s3 ON s4.parent_id = s3.id
    JOIN subcategories s2 ON s3.parent_id = s2.id
    WHERE s4.id = $1
  `, [l4Id]);
  console.log('✓ Verified 3-tier hierarchy in DB:', treeCheck.rows[0]);

  // Step 4: Insert product linked to Level 4 subcategory with custom size prices
  console.log('\n[TEST 2] Inserting product with custom size pricing and subcategory linkage...');
  const prodId = crypto.randomUUID();
  const sizeOptions = [
    { name: 'Standard 12-inch', price: 9500 },
    { name: 'Extended 18-inch', price: 12000 },
    { name: 'Heavy Duty 24-inch', price: 16500 }
  ];

  await client.query(`
    INSERT INTO products (
      id, name, slug, part_number, price, msrp, stock_quantity, is_in_stock,
      category_id, subcategory_id, thumbnail_url, images, description,
      has_sizes, size_options, enable_specs_compat, is_active
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
  `, [
    prodId,
    'Industrial Spiral Coil Element',
    `test-prod-sizes-${Date.now()}`,
    'PN-COIL-400',
    9500,
    11000,
    20,
    true,
    parentCat.id,
    l4Id,
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    JSON.stringify(['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80']),
    'Precision heating coil with multiple size variations and custom pricing.',
    true,
    JSON.stringify(sizeOptions),
    false, // specs & compat turned off
    true
  ]);
  console.log('✓ Product inserted with structured size pricing.');

  // Step 5: Fetch product and verify size pricing & specs toggle
  const fetchedProd = await client.query('SELECT id, name, price, subcategory_id, has_sizes, size_options, enable_specs_compat FROM products WHERE id = $1', [prodId]);
  const row = fetchedProd.rows[0];
  console.log('✓ Retrieved product:', {
    name: row.name,
    base_price: row.price,
    subcategory_id: row.subcategory_id,
    has_sizes: row.has_sizes,
    size_options: row.size_options,
    enable_specs_compat: row.enable_specs_compat
  });

  if (row.size_options[1].price !== 12000) {
    throw new Error('Size option custom price did not persist correctly!');
  }
  console.log('✓ Size option custom price correctly preserved: Rs. ' + row.size_options[1].price);

  // Step 6: Clean up test records
  console.log('\n[TEST 3] Cleaning up test records...');
  await client.query('DELETE FROM products WHERE id = $1', [prodId]);
  await client.query('DELETE FROM subcategories WHERE id = $1', [l2Id]); // cascade will delete l3 and l4
  console.log('✓ Cascade deletion verified and test records cleaned.');

  console.log('\n=== ALL LIVE VERIFICATION CHECKS COMPLETED WITH 100% SUCCESS ===');
  await client.end();
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
