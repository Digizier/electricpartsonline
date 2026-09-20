const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');
const crypto = require('crypto');

const PG_URL = 'postgresql://postgres.kbdhvnejdmytqscqkjas:Usmanmalik986666%40%23%256@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres';
const SUPABASE_URL = 'https://kbdhvnejdmytqscqkjas.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZGh2bmVqZG15dHFzY3FramFzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTgwMDI4MSwiZXhwIjoyMTA1Mzc2MjgxfQ.LXmRAQeitO5mCKjW11VXg8pJFFx67n50uf4EQ7oBk0o';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const pgClient = new Client({ connectionString: PG_URL, ssl: { rejectUnauthorized: false } });

// Helper to fetch and compress image to WebP buffer
async function fetchAndCompressWebP(url, slug) {
  try {
    console.log(`[Media] Fetching image for ${slug}: ${url}`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const inputBuf = Buffer.from(arrayBuffer);

    const webpBuf = await sharp(inputBuf)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    console.log(`[Media] Compressed ${slug}: ${Math.round(webpBuf.length / 1024)} KB`);
    return webpBuf;
  } catch (err) {
    console.warn(`[Media Warning] Could not fetch ${url} for ${slug}: ${err.message}. Using fallback.`);
    // Generate a fallback clean SVG-based WebP or standard commercial image
    return null;
  }
}

// Upload WebP buffer to Supabase Storage
async function uploadToStorage(webpBuffer, path) {
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(path, webpBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: pubData } = supabase.storage
    .from('product-images')
    .getPublicUrl(data.path);

  return pubData.publicUrl;
}

// 20 Client Products Definition
const PRODUCTS_DATA = [
  {
    sr: 1,
    name: "8-Channel Commercial Digital Kitchen Timer",
    slug: "8-channel-commercial-digital-kitchen-timer",
    part_number: "KT-8CH-COM",
    oem_number: "SLW-KT8CH",
    category_slug: "fryer-parts",
    subcategory_slug: "kitchen-timers",
    brand_name: "VEVOR",
    price: 16000,
    msrp: 18500,
    discount_percent: 14,
    source_img: "https://m.media-amazon.com/images/I/51sQNm88JYL.jpg",
    description: "Heavy-duty 8-channel commercial digital kitchen timer designed for busy restaurant kitchens, commercial fryers, burger stations, and bakeries. Features multi-channel simultaneous countdowns, loud adjustable alarm buzzer, large LED display, and durable stainless steel housing.",
    details_bullets: [
      "8 independent channel timers allow timing multiple fryer baskets simultaneously",
      "High-volume buzzer ensures notifications are heard even in noisy commercial kitchens",
      "Oil-resistant, water-resistant stainless steel front panel for easy cleaning",
      "Memory recall function saves standard cooking times for routine operations"
    ],
    specifications: {
      "Channels": "8 Independent Channels",
      "Display": "Bright Digital LED Display",
      "Housing": "Commercial Grade Stainless Steel",
      "Alarm": "Loud Multi-Decibel Adjustable Buzzer",
      "Voltage": "220V / 110V AC Adapter Compatible",
      "Mounting": "Wall Mount or Stand Placement"
    },
    compatibility: ["Commercial Deep Fryers", "Commercial Ovens", "Fast Food Cooking Stations", "Bakery Prep Lines"],
    is_featured: true,
    is_bestseller: true
  },
  {
    sr: 2,
    name: "Commercial Bun Toaster Drive Motor (230V / 50-60Hz)",
    slug: "commercial-bun-toaster-drive-motor-230v",
    part_number: "B3715UI-230V",
    oem_number: "ANT-B3715UI",
    category_slug: "bun-toaster-parts",
    subcategory_slug: "drive-motors",
    brand_name: "Hatco",
    price: 45000,
    msrp: 52000,
    discount_percent: 13,
    source_img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    description: "High-torque commercial bun toaster gear motor assembly (Model B3715UI) engineered for continuous conveyor belt operation in high-volume fast food restaurants, commercial burger toasters, and continuous feed units.",
    details_bullets: [
      "Heavy-duty hardened steel internal gears for continuous operation without slipping",
      "Sealed bearing design prevents grease and carbon build-up inside motor casing",
      "Direct drop-in replacement with pre-drilled flange mountings and wire connectors",
      "High thermal endurance windings prevent burnout during continuous rush hours"
    ],
    specifications: {
      "Model": "B3715UI",
      "Voltage": "220V - 230V AC",
      "Frequency": "50 / 60 Hz",
      "Speed": "8.5 RPM (50Hz) / 10 RPM (60Hz)",
      "Power": "30 Watts High Torque",
      "Insulation": "Class H High-Temperature Rated"
    },
    compatibility: ["Antunes Roundup Toasters", "Hatco Toast-Qwik Series", "Commercial Conveyor Toasters"],
    is_featured: false,
    is_bestseller: true
  },
  {
    sr: 3,
    name: "Prince Castle Bun Toaster Motor Drive Assembly (297-T14BFGB)",
    slug: "prince-castle-bun-toaster-motor-drive-assembly",
    part_number: "297-T14BFGB",
    oem_number: "PC-297-T14",
    category_slug: "bun-toaster-parts",
    subcategory_slug: "drive-motors",
    brand_name: "Hatco",
    price: 45000,
    msrp: 52000,
    discount_percent: 13,
    source_img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80",
    description: "Genuine OEM-spec Prince Castle 297-T14BFGB motor and drive gear assembly for commercial vertical contact bun toasters. Engineered for steady, reliable conveyor belt feed and uniform bun toasting across high-volume service.",
    details_bullets: [
      "Precision drive mechanism maintains exact conveyor transit times for consistent caramelization",
      "Industrial grade windings resist high ambient operating temperatures behind heating platens",
      "Complete assembly including drive gear sprocket and factory terminal leads"
    ],
    specifications: {
      "Part Number": "297-T14BFGB",
      "Voltage": "230V Commercial AC",
      "Application": "Vertical Contact Toaster Drive",
      "Duty": "Continuous High-Volume Commercial Duty"
    },
    compatibility: ["Prince Castle 297 Series", "Prince Castle VCT Vertical Toasters", "Fast Food Burger Chains"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 4,
    name: "Flojet T5000 Series Air-Operated Diaphragm Pump",
    slug: "flojet-t5000-air-operated-diaphragm-pump",
    part_number: "T5000-140",
    oem_number: "FLO-T5000",
    category_slug: "beverage-parts",
    subcategory_slug: "water-pumps",
    brand_name: "FLOJET",
    price: 16000,
    msrp: 18500,
    discount_percent: 14,
    source_img: "https://www.xylem.com/siteassets/brand/flojet/flojet-t5000-140.jpg.jpg",
    description: "Flojet T5000 Series air-operated gas/pneumatic diaphragm pump for commercial post-mix syrup dispensing, juice dispensing, and beverage transfer systems. Designed for smooth, pulse-free delivery.",
    details_bullets: [
      "Capable of running dry without damage for extended operating reliability",
      "Food-grade Santoprene diaphragms for certified hygienic beverage handling",
      "Automatic shut-off when syrup container or bag-in-box empties",
      "Quick disconnect ports allow tool-free maintenance and sanitation"
    ],
    specifications: {
      "Model": "T5000 Series",
      "Type": "Air-Operated Double Diaphragm (AODD)",
      "Max Operating Pressure": "90 PSI (6.2 bar)",
      "Fluid Compatibility": "Syrups, Concentrates, Teas, Juices",
      "Inlet / Outlet": "Quick Disconnect Barb Fittings"
    },
    compatibility: ["Commercial Soda Fountains", "Post-Mix Dispensers", "Commercial Beverage Bars", "Syrup Transfer Racks"],
    is_featured: true,
    is_bestseller: true
  },
  {
    sr: 5,
    name: "Robertshaw 700-506 Millivolt Commercial Fryer Gas Valve",
    slug: "robertshaw-700-506-millivolt-fryer-gas-valve",
    part_number: "700-506",
    oem_number: "ROB-700-506",
    category_slug: "fryer-parts",
    subcategory_slug: "gas-valves",
    brand_name: "Robertshaw",
    price: 55000,
    msrp: 62000,
    discount_percent: 11,
    source_img: "https://m.media-amazon.com/images/I/514iLGkZIQL.jpg",
    description: "Robertshaw 700-506 high-capacity combination millivolt commercial fryer gas valve with built-in manual safety shutoff and factory-calibrated natural gas / LP pressure regulator.",
    details_bullets: [
      "Standard industry-standard 750mV thermopile activation requires zero external electrical wiring",
      "Safety shut-off immediately cuts gas flow upon pilot flame loss",
      "Pilot gas adjustment screw for fine flame tuning",
      "Built-in pressure regulator ensures stable, non-fluctuating burner flames"
    ],
    specifications: {
      "Part Number": "700-506",
      "Electrical Rating": "750mV Powerpile / Millivolt System",
      "Gas Connections": "1/2\" NPT Inlet x 1/2\" NPT Outlet",
      "Capacity": "Up to 240,000 BTU/hr",
      "Gas Type": "Natural Gas (Convertible to LP)"
    },
    compatibility: ["Pitco Fryers", "Frymaster", "Dean", "Vulcan Commercial Deep Fryers"],
    is_featured: true,
    is_bestseller: true
  },
  {
    sr: 6,
    name: "Commercial Fryer Millivolt Thermostat (60125401 / 60124501)",
    slug: "commercial-fryer-millivolt-thermostat-60125401",
    part_number: "60125401",
    oem_number: "OEM-60124501",
    category_slug: "fryer-parts",
    subcategory_slug: "thermostats",
    brand_name: "Robertshaw",
    price: 16000,
    msrp: 18500,
    discount_percent: 14,
    source_img: "https://m.media-amazon.com/images/I/31aJqkGWh-L.jpg",
    description: "Commercial millivolt deep fryer operating thermostat with 200°F to 400°F temperature range. Direct replacement for Pitco, Frymaster, and Imperial commercial frying vats.",
    details_bullets: [
      "Tight temperature hysteresis ensures crispy food quality and prevents grease smoke point burning",
      "Includes stuffing box seal to prevent hot cooking oil seepage through vat walls",
      "Reinforced armored nickel capillary sheath protects against basket impact"
    ],
    specifications: {
      "Part Number": "60125401 / 60124501",
      "Temperature Range": "200°F - 400°F (93°C - 204°C)",
      "Capillary Length": "30 Inches nickel-plated armor",
      "Bulb Size": "3/8\" x 5-7/8\" Copper/Nickel Bulb",
      "Mounting": "Single Hole Stem Mount with Stuffing Box"
    },
    compatibility: ["Pitco 35C+, 45C+", "Frymaster GF14", "Vulcan LG300", "Imperial Fryers"],
    is_featured: false,
    is_bestseller: true
  },
  {
    sr: 7,
    name: "750mV Commercial Gas Fryer Thermopile Generator Pilot",
    slug: "750mv-commercial-gas-fryer-thermopile-generator",
    part_number: "TP-750MV-36",
    oem_number: "OEM-TP-750",
    category_slug: "fryer-parts",
    subcategory_slug: "thermopiles-powerpiles",
    brand_name: "Robertshaw",
    price: 12000,
    msrp: 14000,
    discount_percent: 14,
    source_img: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80",
    description: "High-output 750 millivolt thermopile generator with 36-inch stainless steel armored lead wire for commercial gas deep fryers, griddles, and broilers.",
    details_bullets: [
      "Generates robust DC voltage from pilot flame heat to power gas valve solenoid coils safely",
      "Fiberglass insulated internal conductors withstand continuous 1400°F flame exposure",
      "Spade terminals for direct, secure connection to gas valve millivolt terminals"
    ],
    specifications: {
      "Output Voltage": "750mV DC Open Circuit",
      "Resistance": "2.5 - 3.5 Ohms Internal",
      "Lead Length": "36 Inches (approx. 91 cm)",
      "Casing": "Stainless Steel Armored Sheath",
      "Terminals": "Fork / Spade Terminals"
    },
    compatibility: ["Pitco", "Frymaster", "Vulcan", "American Range", "Robertshaw Gas Valves"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 8,
    name: "Roundup VCT-2 Silicone Conveyor Belt Wrap (1 Pair)",
    slug: "roundup-vct-2-silicone-conveyor-belt-wrap-pair",
    part_number: "VCT-2-SIL-PAIR",
    oem_number: "EW-VCT2-BELT",
    category_slug: "bun-toaster-parts",
    subcategory_slug: "conveyor-belts",
    brand_name: "Hatco",
    price: 20000,
    msrp: 23500,
    discount_percent: 15,
    source_img: "https://essentialware.com/wp-content/uploads/2021/11/essentialware-VCT20-silicone-belt-wrap-roundup-vct-2-toaster-1-pair.webp",
    description: "Non-stick commercial silicone conveyor belt wraps (pair of 2) for Roundup / Antunes VCT-2 and VCT-200 vertical contact bun toasters. Prevents bun sticking, butter burn-on, and ensures uniform toast.",
    details_bullets: [
      "Advanced non-stick silicone surface eliminates bun crushing and platen tearing",
      "Reinforced seam prevents stretching, tearing, and belt runout on high-speed lunch rushes",
      "Sold as a complete pair (2 belts) for full toaster refresh"
    ],
    specifications: {
      "Quantity": "1 Pair (2 Belts included)",
      "Material": "Food Grade High-Temp Silicone with Reinforced Woven Mesh",
      "Temperature Limit": "550°F (288°C) Continuous Heat",
      "Application": "Roundup VCT-2 / VCT-200 Contact Toaster Platens"
    },
    compatibility: ["Antunes Roundup VCT-2", "VCT-200", "VCT-1000 Commercial Bun Toasters"],
    is_featured: true,
    is_bestseller: false
  },
  {
    sr: 9,
    name: "Taprite Commercial Dual Gauge CO2 Beverage Pressure Regulator",
    slug: "taprite-commercial-dual-gauge-co2-pressure-regulator",
    part_number: "T742HP-02",
    oem_number: "TAP-742HP",
    category_slug: "beverage-parts",
    subcategory_slug: "pressure-regulators-gauges",
    brand_name: "FLOJET",
    price: 35000,
    msrp: 39500,
    discount_percent: 11,
    source_img: "https://m.media-amazon.com/images/I/416SNEMq4uL.jpg",
    description: "Commercial dual-gauge CO2 pressure regulator engineered by Taprite for beverage dispensing, draft beer kegs, soda fountains, and carbonation tanks. Features high-pressure tank gauge and low-pressure output gauge with built-in safety relief.",
    details_bullets: [
      "Polycarbonate non-shatter gauge lenses resist accidental impact behind bar counters",
      "Duckbill check valve prevents syrup or liquid backflow into regulator body",
      "Heavy brass body construction with precision diaphragm for steady pressure"
    ],
    specifications: {
      "Inlet Fitting": "CGA-320 CO2 Standard Tank Fitting with Quad-Ring Seal",
      "Output Pressure Gauge": "0 - 60 PSI with Fine Adjustment Screw",
      "Tank Pressure Gauge": "0 - 3000 PSI Full Tank Content Indicator",
      "Safety Relief": "Built-in 55-65 PSI Automatic Pressure Blow-Off Valve",
      "Body": "Solid Forged Brass with Chrome Finish"
    },
    compatibility: ["Commercial Soda Dispensers", "Draft Beer Lines", "Post-Mix Carbonators", "CO2 Cylinders"],
    is_featured: true,
    is_bestseller: true
  },
  {
    sr: 10,
    name: "Commercial Fryer Pilot Burner Hood / Pilot Cap",
    slug: "commercial-fryer-pilot-burner-hood-cap",
    part_number: "PC-HOOD-01",
    oem_number: "MC-PILOT-CAP",
    category_slug: "fryer-parts",
    subcategory_slug: "pilot-accessories",
    brand_name: "Robertshaw",
    price: 1000,
    msrp: 1300,
    discount_percent: 23,
    source_img: "https://m.media-amazon.com/images/I/41ipscPpnxL.jpg",
    description: "High-temperature stainless steel replacement pilot burner hood and cap for commercial gas deep fryers, ranges, and braising pans. Directs pilot flame onto thermopile and burner ports.",
    details_bullets: [
      "Protects pilot orifice from grease drippings and carbon accumulation",
      "Directs sharp, steady flame onto thermocouple and main burner ignition track",
      "Easy screw-on installation on standard pilot burners"
    ],
    specifications: {
      "Material": "Heat-Resistant Stainless Steel / Brass Fitting",
      "Flame Configuration": "Multi-Directional Flame Direction Hood",
      "Thread": "Standard M8 / M10 Pilot Jet Fitting"
    },
    compatibility: ["Pitco", "Frymaster", "Vulcan", "Dean Commercial Gas Cooking Equipment"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 11,
    name: "Commercial Fryer Temperature Dial Knob / Thermostat Cap (200°F–400°F)",
    slug: "commercial-fryer-temperature-dial-knob-cap",
    part_number: "TC-KNOB-400",
    oem_number: "MC-DIAL-400",
    category_slug: "fryer-parts",
    subcategory_slug: "thermostats",
    brand_name: "Robertshaw",
    price: 1000,
    msrp: 1300,
    discount_percent: 23,
    source_img: "https://m.media-amazon.com/images/I/41F6Mml-u5L.jpg",
    description: "Durable heat-resistant replacement temperature control knob and cap for commercial deep fryer thermostats. Features clear embossed 200°F to 400°F markings and OFF position.",
    details_bullets: [
      "Embossed high-contrast white temperature numbers will not wear off from oil or degreasers",
      "Internal steel clip spring locks firmly onto the thermostat D-shaft without slipping",
      "Ergonomic ribbed edge for sure-grip temperature adjustments with gloved hands"
    ],
    specifications: {
      "Temperature Scale": "OFF, 200°F - 400°F (93°C - 204°C)",
      "Shaft Diameter": "1/4\" D-Stem Shaft Fit",
      "Material": "Heavy-Duty Phenolic Heat-Resistant Polymer"
    },
    compatibility: ["Pitco", "Robertshaw", "Imperial", "Vulcan Fryer Thermostat Shafts"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 12,
    name: "NSF H1 Food-Grade Sanitary Grease Lubricant Tube (4 oz)",
    slug: "nsf-h1-food-grade-sanitary-grease-lubricant-tube",
    part_number: "LUB-H1-4OZ",
    oem_number: "FG-LUB-1600",
    category_slug: "ice-cream-machine-parts",
    subcategory_slug: "lubrication-maintenance",
    brand_name: "Taylor",
    price: 2200,
    msrp: 2700,
    discount_percent: 18,
    source_img: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
    description: "NSF H1 registered sanitary food-grade lubricant grease for commercial soft serve ice cream machines, frozen yogurt dispensers, slush machines, and meat slicers. Odorless, tasteless, water-resistant.",
    details_bullets: [
      "Safe for incidental food contact on beater shaft O-rings, seals, and draw valves",
      "Will not wash away or emulsify during routine sanitizing wash cycles",
      "Extends life of rubber gaskets and prevents milkstone accumulation behind seals"
    ],
    specifications: {
      "Certification": "NSF H1 Registered Food-Grade Lubricant",
      "Volume": "4 oz (113g) Tube",
      "Operating Temperature": "-10°F to 350°F (-23°C to 177°C)",
      "Properties": "Odorless, Non-Toxic, Clear, Hydro-Treated Mineral Base"
    },
    compatibility: ["Taylor", "Stoelting", "Electro Freeze", "Carpigiani Soft Serve & Shake Freezers"],
    is_featured: true,
    is_bestseller: true
  },
  {
    sr: 13,
    name: "Heavy-Duty Commercial Gas Pressure Regulator (1/2\" NPT)",
    slug: "heavy-duty-commercial-gas-pressure-regulator-half-inch",
    part_number: "GR-12-NPT",
    oem_number: "REG-COM-12",
    category_slug: "gas-components",
    subcategory_slug: "gas-regulators",
    brand_name: "Robertshaw",
    price: 4000,
    msrp: 4800,
    discount_percent: 16,
    source_img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80",
    description: "Commercial gas appliance pressure regulator with 1/2-inch female NPT connections. Stabilizes gas supply pressure to commercial fryers, griddles, ovens, and charbroilers.",
    details_bullets: [
      "Maintains steady burner manifold pressure to prevent flame flare-ups or pilot outages",
      "Field convertible between Natural Gas and Liquid Propane via top cap adjustment",
      "Cast aluminum body resists rust and commercial kitchen heat"
    ],
    specifications: {
      "Pipe Size": "1/2\" Female NPT Inlet & Outlet",
      "Inlet Pressure Rating": "1/2 PSI Max",
      "Outlet Pressure": "Natural Gas (3.5\" to 6.0\" W.C.) / LP Convertible (10.0\" W.C.)",
      "Material": "Cast Aluminum Alloy Body with Internal Diaphragm"
    },
    compatibility: ["Commercial Fryers", "Ranges", "Griddles", "Broilers", "Salamanders"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 14,
    name: "Taylor 17-Inch Commercial Ice Cream Machine Scraper Blade (035174)",
    slug: "taylor-17-inch-commercial-ice-cream-machine-scraper-blade",
    part_number: "035174",
    oem_number: "TAY-035174",
    category_slug: "ice-cream-machine-parts",
    subcategory_slug: "scraper-blades",
    brand_name: "Taylor",
    price: 4000,
    msrp: 4800,
    discount_percent: 16,
    source_img: "https://m.media-amazon.com/images/I/418pXV4YLzL.jpg",
    description: "Genuine-fit 17-inch high-wear beater scraper blade for Taylor commercial soft serve ice cream and shake freezers. Scrapes freezing cylinder walls cleanly to maximize overrun and smooth texture.",
    details_bullets: [
      "Sharp, precise scraping edge prevents ice build-up and maintains optimal freezing efficiency",
      "Flexible sanitary resin construction resists cracking under sub-zero cylinder temperatures",
      "Snaps directly onto standard Taylor beater bars without tools"
    ],
    specifications: {
      "Length": "17 Inches (approx. 43.2 cm)",
      "Material": "FDA Food-Grade High-Density Wear-Resistant Polymer",
      "Color": "Cream / White",
      "Application": "Main Beater Freezing Cylinder Scraper"
    },
    compatibility: ["Taylor Soft Serve Models C706, C707, C708, C709, C712, C713, C716, C717, C722, C723"],
    is_featured: true,
    is_bestseller: true
  },
  {
    sr: 15,
    name: "Taylor 14-Inch Commercial Ice Cream Machine Scraper Blade (035175)",
    slug: "taylor-14-inch-commercial-ice-cream-machine-scraper-blade",
    part_number: "035175",
    oem_number: "TAY-035175",
    category_slug: "ice-cream-machine-parts",
    subcategory_slug: "scraper-blades",
    brand_name: "Taylor",
    price: 3500,
    msrp: 4200,
    discount_percent: 16,
    source_img: "https://m.media-amazon.com/images/I/418pXV4YLzL.jpg",
    description: "Taylor 14-inch beater scraper blade for commercial countertop and double-barrel soft serve machines. Ensures even product scraping and consistent soft serve viscosity.",
    details_bullets: [
      "Precision clip-on beater fit allows quick installation without tools during daily cleaning",
      "Maintains consistent motor load and prevents barrel scoring",
      "Food-contact safe polymer withstands commercial acid and caustic wash sanitizers"
    ],
    specifications: {
      "Length": "14 Inches (approx. 35.6 cm)",
      "Material": "Sanitary Food-Grade Self-Lubricating Polymer",
      "Color": "White",
      "Application": "Countertop Soft Serve Freezing Cylinder"
    },
    compatibility: ["Taylor 150, 152, 161, 162, 168 Countertop Soft Serve Models"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 16,
    name: "Taylor 8-Inch Pressurized Soft Serve Scraper Blade (035176)",
    slug: "taylor-8-inch-pressurized-soft-serve-scraper-blade",
    part_number: "035176",
    oem_number: "TAY-035176",
    category_slug: "ice-cream-machine-parts",
    subcategory_slug: "scraper-blades",
    brand_name: "Taylor",
    price: 3000,
    msrp: 3600,
    discount_percent: 16,
    source_img: "https://m.media-amazon.com/images/I/31oE7RIsGmL.jpg",
    description: "Taylor 8-inch beater scraper blade replacement for pressurized soft serve ice cream machines and shake dispensing barrels.",
    details_bullets: [
      "High durability formula delivers thousands of servings before replacement",
      "Clean-scraping profile ensures velvety smooth soft serve discharge",
      "Engineered specifically for short-barrel pressurized shake and frozen treat units"
    ],
    specifications: {
      "Length": "8 Inches (approx. 20.3 cm)",
      "Material": "Commercial Grade Heavy Wear Polymer",
      "Color": "White / Translucent"
    },
    compatibility: ["Taylor Pressurized Shake & Soft Serve Models (336, 338, 339, 754)"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 17,
    name: "Pitco P6071450 Commercial Fryer Natural Gas Pilot Assembly",
    slug: "pitco-p6071450-commercial-fryer-natural-gas-pilot-assembly",
    part_number: "P6071450",
    oem_number: "PIT-P6071450",
    category_slug: "fryer-parts",
    subcategory_slug: "pilot-assemblies",
    brand_name: "Robertshaw",
    price: 4500,
    msrp: 5400,
    discount_percent: 16,
    source_img: "https://m.media-amazon.com/images/I/414bO3G1dHL.jpg",
    description: "Genuine Pitco P6071450 commercial gas fryer pilot burner assembly. Includes natural gas orifice, ignition electrode mounting bracket, and mounting holes for 750mV thermopile and thermocouple.",
    details_bullets: [
      "Dual-target flame hood directs steady ignition flames to main burner and thermopile head",
      "Stainless steel pilot bracket resists hot oil drippings and harsh chemical boil-outs",
      "Complete assembly ready to connect to 1/4\" pilot tube and millivolt leads"
    ],
    specifications: {
      "Part Number": "P6071450",
      "Gas Type": "Natural Gas (LP convertible)",
      "Gas Line Connection": "1/4\" Compression Fitting",
      "Mounting": "Standard Pitco 2-Bolt Vat Flange Bracket"
    },
    compatibility: ["Pitco 35C+, 45C+, 65C+, VF35, SG14 Commercial Fryers"],
    is_featured: false,
    is_bestseller: true
  },
  {
    sr: 18,
    name: "Commercial Fryer Stainless Flexible Pilot Tubing (1/4\" x 24\")",
    slug: "commercial-fryer-stainless-flexible-pilot-tubing",
    part_number: "PT-FLEX-24",
    oem_number: "OEM-PT-024",
    category_slug: "fryer-parts",
    subcategory_slug: "gas-lines-tubing",
    brand_name: "Robertshaw",
    price: 1500,
    msrp: 1900,
    discount_percent: 21,
    source_img: "https://m.media-amazon.com/images/I/41o89KiZ8GL.jpg",
    description: "24-inch flexible stainless steel braided pilot gas supply tube with pre-installed 1/4\" brass compression nuts. Connects fryer gas valve pilot port to pilot burner assembly.",
    details_bullets: [
      "Flexible design allows easy routing around tight fryer vat frames without kinking",
      "Brass compression ferrules provide 100% leak-proof gas seal without thread tape",
      "Stainless steel outer braid shields inner tubing from hot grease splashes"
    ],
    specifications: {
      "Length": "24 Inches",
      "Outside Diameter": "1/4\" Tube Outer Diameter",
      "End Fittings": "1/4\" Brass Compression Nut & Ferrule (Both Ends)",
      "Material": "Corrosion-Resistant Flexible Stainless Sheathing"
    },
    compatibility: ["All Commercial Fryers, Griddles, Ranges, and Broilers"],
    is_featured: false,
    is_bestseller: false
  },
  {
    sr: 19,
    name: "Rainbow Capillary Mechanical Deep Fryer Thermostat (50°C–300°C)",
    slug: "rainbow-capillary-mechanical-deep-fryer-thermostat",
    part_number: "RB-TS-300C",
    oem_number: "RAIN-300C",
    category_slug: "fryer-parts",
    subcategory_slug: "thermostats",
    brand_name: "Robertshaw",
    price: 6000,
    msrp: 7200,
    discount_percent: 16,
    source_img: "https://m.media-amazon.com/images/I/41IK9-oRr3L.jpg",
    description: "Rainbow commercial capillary mechanical thermostat with 50°C to 300°C adjustable temperature dial. Ideal for commercial electric deep fryers, countertop fryers, boiling pans, and griddles.",
    details_bullets: [
      "High-accuracy liquid expansion capillary sensor ensures instant response to temp drops",
      "Universal terminal connectors compatible with all standard heating contactors and elements",
      "Includes graduated front dial bezel and knurled temperature adjustment knob"
    ],
    specifications: {
      "Temperature Range": "50°C - 300°C (122°F - 572°F)",
      "Electrical Rating": "16A 250V AC / 20A 125V AC",
      "Capillary Length": "1000mm (1 Meter) Stainless Steel Capillary",
      "Bulb Dimensions": "6mm Diameter x 120mm Length Stainless Sensor Bulb",
      "Switch Type": "SPST (Single Pole Single Throw) Break on Temp Rise"
    },
    compatibility: ["Commercial Countertop Fryers", "Donut Fryers", "Bain Maries", "Electric Griddles"],
    is_featured: false,
    is_bestseller: true
  },
  {
    sr: 20,
    name: "Commercial Fryer High Limit Safety Cut-Off Switch (450°F / 232°C)",
    slug: "commercial-fryer-high-limit-safety-cut-off-switch",
    part_number: "HL-450F-MAN",
    oem_number: "OEM-HL-450",
    category_slug: "fryer-parts",
    subcategory_slug: "safety-hi-limit-switches",
    brand_name: "Robertshaw",
    price: 16000,
    msrp: 18500,
    discount_percent: 14,
    source_img: "https://m.media-amazon.com/images/I/31LOoJm-YxL.jpg",
    description: "Manual reset commercial deep fryer high-limit safety cut-off switch. Automatically trips and cuts off power or gas supply if cooking oil exceeds 450°F (232°C), preventing grease fires and thermal oil degradation.",
    details_bullets: [
      "Crucial commercial kitchen fire code safety component prevents oil flash fires",
      "Positive mechanical latch prevents automatic re-ignition until safely inspected and reset",
      "Protected manual reset button with red rubberized dust and oil shield"
    ],
    specifications: {
      "Trip Temperature": "450°F (232°C) Fixed High Limit",
      "Reset Type": "Manual Push Button Reset with Protective Red Rubber Boot",
      "Capillary Length": "24 Inches Armored Capillary",
      "Bulb Size": "1/4\" Diameter Stainless Steel Temperature Sensor Bulb",
      "Stuffing Box": "3/8\" Tank Penetration Compression Fitting Included"
    },
    compatibility: ["Pitco, Frymaster, Dean, Vulcan, American Range Commercial Deep Fryers"],
    is_featured: true,
    is_bestseller: true
  }
];

async function main() {
  console.log('--- CONNECTING TO DATABASE ---');
  await pgClient.connect();
  console.log('Connected to PostgreSQL successfully.');

  // 1. Fetch current categories, subcategories, brands
  const catRes = await pgClient.query('SELECT id, slug, name FROM categories');
  const catMap = new Map();
  catRes.rows.forEach(r => catMap.set(r.slug, r.id));

  // Check if "Ice Cream Machine Parts" exists
  if (!catMap.has('ice-cream-machine-parts')) {
    console.log('[Category] Creating category: Ice Cream Machine Parts');
    const newCatId = crypto.randomUUID();
    const catImgUrl = 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80';
    await pgClient.query(`
      INSERT INTO categories (id, name, slug, image_url, description, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      newCatId,
      'Ice Cream Machine Parts',
      'ice-cream-machine-parts',
      catImgUrl,
      'Scraper blades, beater assemblies, sanitary NSF H1 lubricants, tune-up kits, and valves for commercial soft serve and ice cream machines.',
      9,
      true
    ]);
    catMap.set('ice-cream-machine-parts', newCatId);
  }

  const subRes = await pgClient.query('SELECT id, category_id, slug, name FROM subcategories');
  const subMap = new Map();
  subRes.rows.forEach(r => subMap.set(`${r.category_id}:${r.slug}`, r.id));

  // Helper to ensure subcategory exists
  async function ensureSubcategory(catSlug, subSlug, subName, sortOrder = 1) {
    const catId = catMap.get(catSlug);
    if (!catId) return null;
    const key = `${catId}:${subSlug}`;
    if (subMap.has(key)) return subMap.get(key);

    console.log(`[Subcategory] Creating ${subName} (${subSlug}) under ${catSlug}`);
    const subId = crypto.randomUUID();
    await pgClient.query(`
      INSERT INTO subcategories (id, category_id, name, slug, sort_order, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [subId, catId, subName, subSlug, sortOrder, true]);
    subMap.set(key, subId);
    return subId;
  }

  // Ensure all necessary subcategories exist
  await ensureSubcategory('ice-cream-machine-parts', 'scraper-blades', 'Scraper Blades', 1);
  await ensureSubcategory('ice-cream-machine-parts', 'lubrication-maintenance', 'Lubrication & Maintenance', 2);
  await ensureSubcategory('fryer-parts', 'kitchen-timers', 'Kitchen Timers', 6);
  await ensureSubcategory('fryer-parts', 'thermopiles-powerpiles', 'Thermopiles & Powerpiles', 7);
  await ensureSubcategory('fryer-parts', 'pilot-accessories', 'Pilot Accessories', 8);
  await ensureSubcategory('fryer-parts', 'gas-lines-tubing', 'Gas Lines & Tubing', 9);
  await ensureSubcategory('fryer-parts', 'safety-hi-limit-switches', 'Safety Hi-Limit Switches', 10);
  await ensureSubcategory('gas-components', 'gas-regulators', 'Gas Regulators', 3);
  await ensureSubcategory('beverage-parts', 'pressure-regulators-gauges', 'Pressure Regulators & Gauges', 4);

  // Brands map
  const brandRes = await pgClient.query('SELECT id, name FROM brands');
  const brandMap = new Map();
  brandRes.rows.forEach(r => brandMap.set(r.name.toLowerCase(), r.id));

  // 2. Process all 20 products
  console.log(`\n--- PROCESSING ${PRODUCTS_DATA.length} PRODUCTS ---`);

  for (const item of PRODUCTS_DATA) {
    console.log(`\n[Product #${item.sr}] ${item.name}`);
    const catId = catMap.get(item.category_slug);
    const subId = subMap.get(`${catId}:${item.subcategory_slug}`) || null;
    const brandId = brandMap.get(item.brand_name.toLowerCase()) || null;

    // A. Fetch & compress image to WebP
    let publicImageUrl = '';
    const storagePath = `catalog/${item.slug}.webp`;

    const webpBuf = await fetchAndCompressWebP(item.source_img, item.slug);
    if (webpBuf) {
      publicImageUrl = await uploadToStorage(webpBuf, storagePath);
      console.log(`[Storage] Uploaded CDN: ${publicImageUrl}`);
    } else {
      publicImageUrl = item.source_img;
    }

    // B. Check if product already exists in DB
    const existing = await pgClient.query('SELECT id FROM products WHERE slug = $1', [item.slug]);
    const prodId = existing.rows.length > 0 ? existing.rows[0].id : crypto.randomUUID();

    // C. Upsert into products table
    const query = `
      INSERT INTO products (
        id, name, slug, part_number, oem_number, brand_id, category_id, subcategory_id,
        price, msrp, discount_percent, stock_quantity, is_in_stock, rating, review_count,
        thumbnail_url, images, description, details_bullets, specifications, compatibility,
        manuals, enable_details_bullets, enable_specs_compat, enable_manuals, enable_variants_reviews,
        has_colors, color_options, has_sizes, size_options, show_reviews,
        is_featured, is_bestseller, is_new_arrival, is_top_rated, is_active,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26,
        $27, $28, $29, $30, $31,
        $32, $33, $34, $35, $36,
        NOW(), NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        msrp = EXCLUDED.msrp,
        discount_percent = EXCLUDED.discount_percent,
        thumbnail_url = EXCLUDED.thumbnail_url,
        images = EXCLUDED.images,
        description = EXCLUDED.description,
        details_bullets = EXCLUDED.details_bullets,
        specifications = EXCLUDED.specifications,
        compatibility = EXCLUDED.compatibility,
        is_active = EXCLUDED.is_active,
        updated_at = NOW();
    `;

    const imagesArray = [publicImageUrl];

    await pgClient.query(query, [
      prodId,
      item.name,
      item.slug,
      item.part_number,
      item.oem_number,
      brandId,
      catId,
      subId,
      item.price,
      item.msrp,
      item.discount_percent,
      35, // stock_quantity
      true, // is_in_stock
      4.8, // rating
      12, // review_count
      publicImageUrl,
      JSON.stringify(imagesArray),
      item.description,
      JSON.stringify(item.details_bullets),
      JSON.stringify(item.specifications),
      JSON.stringify(item.compatibility),
      JSON.stringify([]), // manuals
      true, // enable_details_bullets
      true, // enable_specs_compat
      true, // enable_manuals
      true, // enable_variants_reviews
      false, // has_colors
      JSON.stringify([]), // color_options
      false, // has_sizes
      JSON.stringify([]), // size_options
      false, // show_reviews
      item.is_featured || false,
      item.is_bestseller || false,
      true, // is_new_arrival
      true, // is_top_rated
      true // is_active
    ]);

    console.log(`[DB] Successfully upserted: ${item.name} (${prodId})`);
  }

  // 3. Verify total product count
  const totalRes = await pgClient.query('SELECT COUNT(*) FROM products WHERE is_active = true');
  console.log(`\n=== INGESTION COMPLETE ===`);
  console.log(`Total active products in database: ${totalRes.rows[0].count}`);

  await pgClient.end();
}

main().catch(err => {
  console.error('Fatal Ingestion Error:', err);
  process.exit(1);
});
