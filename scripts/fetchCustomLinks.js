async function fetchLinks() {
  const list = [
    { id: '2_ebay_motor', url: 'https://www.ebay.com/itm/175803659238' },
    { id: '3_as_cater', url: 'https://www.ascateringsupplies.com/motor-drive-assembly-prince-castle-297-t14bfgb-toaster.html' },
    { id: '4_xylem', url: 'https://www.xylem.com/en-us/products--services/pumps-packaged-pump-systems/pumps/positive-displacement-pumps2/diaphragm/t5000-series-air-operated-diaphragm-pumps/' },
    { id: '7_thermopile_ca', url: 'https://www.amazon.ca/dp/B0FP29YZSC' }
  ];

  for (const item of list) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      console.log(item.id, 'Status:', res.status);
      const text = await res.text();
      const imgs = text.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi);
      console.log(item.id, 'Images found:', imgs ? imgs.slice(0, 3) : 'none');
    } catch (e) {
      console.error(item.id, e.message);
    }
  }
}

fetchLinks();
