const sharp = require('sharp');

async function getAmazonImages(asin) {
  try {
    const url = `https://www.amazon.com/dp/${asin}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });
    if (!res.ok) return [];
    const html = await res.text();
    const matches = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9%_-]+\.(?:jpg|png)/g);
    if (!matches) return [];
    // Filter out tiny icons
    return [...new Set(matches)].filter(u => !u.includes('21DX0E62GJL') && !u.includes('017s+'));
  } catch (e) {
    return [];
  }
}

async function testAll() {
  const asins = {
    '1_timer': 'B0F6T34DS5',
    '5_gas_valve': 'B0BRCMMHG4',
    '6_thermostat': 'B0CCL3WW57',
    '7_thermopile': 'B0FP29YZSC',
    '9_taprite': 'B002UZUJ22',
    '10_pilot_cap': 'B0CN8QTG8J',
    '14_taylor17': 'B0F95B4CDP',
    '16_taylor8': 'B07ZRZQ7BM',
    '17_pitco_pilot': 'B00EN8GI6U',
    '18_pilot_pipe': 'B0CPDTDZS9',
    '19_rainbow': 'B0FTVNY238',
    '20_hilimit': 'B0CHNSSF5T'
  };

  for (const [key, asin] of Object.entries(asins)) {
    const imgs = await getAmazonImages(asin);
    console.log(key, `(ASIN ${asin}):`, imgs.slice(0, 2));
    await new Promise(r => setTimeout(r, 600));
  }
}

testAll().catch(console.error);
