async function test() {
  const asin = 'B0BRCMMHG4';
  const url = `https://www.amazon.com/dp/${asin}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    const matches = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9%_-]+\.(?:jpg|png)/g);
    console.log('Amazon Images:', matches ? [...new Set(matches)].slice(0, 5) : 'None');
  } catch (e) {
    console.error(e);
  }
}
test();
