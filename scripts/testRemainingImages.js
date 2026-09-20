async function testRemaining() {
  const urls = [
    { id: '8_belts', url: 'https://essentialware.com/wp-content/uploads/2021/11/essentialware-VCT20-silicone-belt-wrap-roundup-vct-2-toaster-1-pair.webp' },
    { id: '7_thermopile', url: 'https://m.media-amazon.com/images/I/61gR2gB59sL.jpg' },
    { id: '4_flojet', url: 'https://m.media-amazon.com/images/I/51eP06Z3fDL.jpg' },
    { id: '2_toaster_motor1', url: 'https://m.media-amazon.com/images/I/61M-kZ-wR4L.jpg' },
    { id: '3_toaster_motor2', url: 'https://m.media-amazon.com/images/I/51i6sW+x5BL.jpg' },
    { id: '12_lube', url: 'https://m.media-amazon.com/images/I/61H4h2G6nKL.jpg' },
    { id: '13_gas_regulator', url: 'https://m.media-amazon.com/images/I/61kGgOqgM0L.jpg' }
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      console.log(item.id, res.status, res.headers.get('content-type'));
    } catch (e) {
      console.error(item.id, 'Failed:', e.message);
    }
  }
}

testRemaining();
