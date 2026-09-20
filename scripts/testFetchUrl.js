async function test() {
  const url = 'https://essentialware.com/product/silicone-belt-wrap-roundup-vct-2-toaster-1-pair/';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('Length:', html.length);
    const m = html.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi);
    console.log('Images:', m ? m.slice(0, 5) : 'None');
  } catch (err) {
    console.error(err);
  }
}
test();
