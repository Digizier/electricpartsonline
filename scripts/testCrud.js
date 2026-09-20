const { Client } = require('pg');
const crypto = require('crypto');

const client = new Client({
  connectionString: 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function runTests() {
  console.log('--- STARTING LIVE SUPABASE CRUD & SCHEMA TESTS ---');
  await client.connect();

  const testId = crypto.randomUUID();
  const testSubId = crypto.randomUUID();

  // 1. Test Product Insertion with multiple images and section toggles
  console.log('\n[TEST 1] Inserting test product with PKR pricing and section toggles...');
  const insertQuery = `
    INSERT INTO products (
      id, name, slug, part_number, price, msrp, stock_quantity, is_in_stock,
      thumbnail_url, images, description, details_bullets, specifications, compatibility,
      manuals, enable_details_bullets, enable_specs_compat, enable_manuals, enable_variants_reviews,
      has_colors, color_options, has_sizes, size_options, show_reviews, is_active
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
    ) RETURNING *;
  `;

  const insertVals = [
    testId,
    'Commercial Heavy Duty Contact Element 5000W',
    `test-part-${Date.now()}`,
    'PN-TEST-999',
    12500, // PKR 12,500
    14000, // PKR 14,000
    15,
    true,
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    JSON.stringify([
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'
    ]),
    'Heavy-duty test commercial fryer element.',
    JSON.stringify(['Heavy gauge nickel alloy', 'Standard 3-hole flange']),
    JSON.stringify({ Voltage: '208V', Wattage: '5000W', Material: 'Stainless Steel' }),
    JSON.stringify(['Commercial Fryer 40L', 'Universal 208V Fit']),
    JSON.stringify([{ title: 'Spec Sheet', url: 'https://example.com/sheet.pdf', file_size: '1.2 MB' }]),
    true,  // enable_details_bullets
    true,  // enable_specs_compat
    true,  // enable_manuals
    false, // enable_variants_reviews
    false,
    JSON.stringify([]),
    true,
    JSON.stringify(['Standard 15-inch', 'Extended 18-inch']),
    false,
    true
  ];

  const inserted = await client.query(insertQuery, insertVals);
  console.log('✓ Product successfully inserted:', {
    id: inserted.rows[0].id,
    name: inserted.rows[0].name,
    price: inserted.rows[0].price,
    enable_variants_reviews: inserted.rows[0].enable_variants_reviews
  });

  // 2. Test Product Fetch & Verification
  console.log('\n[TEST 2] Verifying product from database...');
  const fetched = await client.query('SELECT id, name, price, enable_details_bullets, enable_variants_reviews, images FROM products WHERE id = $1', [testId]);
  if (fetched.rows.length === 0) throw new Error('Product not found after insertion!');
  console.log('✓ Product verified in database:', fetched.rows[0]);

  // 3. Test Product Update
  console.log('\n[TEST 3] Updating product price and name in database...');
  const updated = await client.query(
    'UPDATE products SET price = 13200, name = $1, enable_variants_reviews = true WHERE id = $2 RETURNING id, name, price, enable_variants_reviews',
    ['Commercial Heavy Duty Contact Element 5000W (Updated)', testId]
  );
  console.log('✓ Product successfully updated:', updated.rows[0]);

  // 4. Test Product Deletion
  console.log('\n[TEST 4] Deleting test product from database...');
  await client.query('DELETE FROM products WHERE id = $1', [testId]);
  const checkDeleted = await client.query('SELECT id FROM products WHERE id = $1', [testId]);
  if (checkDeleted.rows.length !== 0) throw new Error('Product still exists after deletion!');
  console.log('✓ Product cleanly deleted from database.');

  // 5. Test Subcategory with parent_id (Hierarchical nesting)
  console.log('\n[TEST 5] Testing nested subcategory with parent_id...');
  const sampleCat = await client.query('SELECT id FROM categories LIMIT 1');
  const catId = sampleCat.rows[0].id;

  const sub1Id = crypto.randomUUID();
  await client.query(
    'INSERT INTO subcategories (id, category_id, name, slug, sort_order, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
    [sub1Id, catId, 'Test Level 2 Subcategory', `test-sub2-${Date.now()}`, 1, true]
  );

  const sub2Id = crypto.randomUUID();
  await client.query(
    'INSERT INTO subcategories (id, category_id, parent_id, name, slug, sort_order, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [sub2Id, catId, sub1Id, 'Test Level 3 Nested Item', `test-sub3-${Date.now()}`, 1, true]
  );
  console.log('✓ Nested Level 2 and Level 3 subcategories inserted with parent_id relation.');

  // Clean up test subcategories
  await client.query('DELETE FROM subcategories WHERE id = $1 OR id = $2', [sub2Id, sub1Id]);
  console.log('✓ Test subcategories cleanly deleted.');

  console.log('\n--- ALL SUPABASE LIVE CRUD & HIERARCHY TESTS PASSED WITH 100% SUCCESS! ---');
  await client.end();
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
