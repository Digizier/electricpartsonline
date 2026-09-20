const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, '../src/lib/mockData.ts');
let content = fs.readFileSync(mockPath, 'utf8');

// Update shipping settings
content = content.replace(/freeShippingThreshold:\s*300/g, 'freeShippingThreshold: 5000');
content = content.replace(/flatShippingFee:\s*15/g, 'flatShippingFee: 250');

// Price replacements for products
const priceMap = [
  { oldP: '89.99', newP: '9000', oldM: '105.99', newM: '10600' },
  { oldP: '45.50', newP: '4600', oldM: '52.00', newM: '5200' },
  { oldP: '129.99', newP: '13000', oldM: '149.99', newM: '15000' },
  { oldP: '76.99', newP: '7700', oldM: '89.00', newM: '8900' },
  { oldP: '159.00', newP: '16000', oldM: '185.00', newM: '18500' },
  { oldP: '68.75', newP: '6900', oldM: '79.00', newM: '7900' },
  { oldP: '72.99', newP: '7300', oldM: '84.00', newM: '8400' },
  { oldP: '28.75', newP: '2900', oldM: '34.00', newM: '3400' },
  { oldP: '64.99', newP: '6500', oldM: '75.00', newM: '7500' },
  { oldP: '38.50', newP: '3900', oldM: '44.00', newM: '4400' },
  { oldP: '12.99', newP: '1300', oldM: '16.00', newM: '1600' },
  { oldP: '164.00', newP: '16500', oldM: '190.00', newM: '19000' },
  { oldP: '74.50', newP: '7500', oldM: '85.00', newM: '8500' },
];

for (const { oldP, newP, oldM, newM } of priceMap) {
  content = content.replace(new RegExp(`price: ${oldP.replace('.', '\\.')}`, 'g'), `price: ${newP}`);
  content = content.replace(new RegExp(`msrp: ${oldM.replace('.', '\\.')}`, 'g'), `msrp: ${newM}`);
}

// Update mock orders totals & subtotals
content = content.replace(/subtotal: 179\.98/g, 'subtotal: 18000');
content = content.replace(/subtotal: 45\.50/g, 'subtotal: 4600');
content = content.replace(/subtotal: 129\.99/g, 'subtotal: 13000');
content = content.replace(/subtotal: 153\.98/g, 'subtotal: 15400');
content = content.replace(/subtotal: 12\.99/g, 'subtotal: 1300');
content = content.replace(/subtotal: 318\.00/g, 'subtotal: 32000');
content = content.replace(/subtotal: 164\.00/g, 'subtotal: 16500');
content = content.replace(/subtotal: 72\.99/g, 'subtotal: 7300');
content = content.replace(/subtotal: 74\.50/g, 'subtotal: 7500');
content = content.replace(/subtotal: 64\.99/g, 'subtotal: 6500');
content = content.replace(/subtotal: 328\.00/g, 'subtotal: 33000');
content = content.replace(/subtotal: 68\.75/g, 'subtotal: 6900');

// Order subtotals and totals
content = content.replace(/subtotal: 355\.47,\s*shipping_fee: 0,\s*total: 355\.47/g, 'subtotal: 35600, shipping_fee: 0, total: 35600');
content = content.replace(/subtotal: 166\.97,\s*shipping_fee: 15,\s*total: 181\.97/g, 'subtotal: 16700, shipping_fee: 250, total: 16950');
content = content.replace(/subtotal: 554\.99,\s*shipping_fee: 0,\s*total: 554\.99/g, 'subtotal: 55800, shipping_fee: 0, total: 55800');
content = content.replace(/subtotal: 269\.48,\s*shipping_fee: 15,\s*total: 284\.48/g, 'subtotal: 27000, shipping_fee: 0, total: 27000');
content = content.replace(/subtotal: 396\.75,\s*shipping_fee: 0,\s*total: 396\.75/g, 'subtotal: 39900, shipping_fee: 0, total: 39900');

// Ensure section toggles are present on INITIAL_PRODUCTS
content = content.replace(
  /is_featured: (true|false),/g,
  `enable_details_bullets: true,\n    enable_specs_compat: true,\n    enable_manuals: true,\n    enable_variants_reviews: true,\n    is_featured: $1,`
);

fs.writeFileSync(mockPath, content, 'utf8');
console.log('Successfully updated mockData.ts to PKR and added section toggles!');
