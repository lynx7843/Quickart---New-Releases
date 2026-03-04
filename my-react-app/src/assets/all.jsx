import { useState, useEffect, useRef } from "react";

const categoriesData = [
  {
    id: "categories-for-you",
    name: "Categories for You",
    icon: "⭐",
    featured: true,
    subCategories: [
      { name: "Vending Machines", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&h=200&fit=crop", hot: true },
      { name: "Electric Cars", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=200&fit=crop", hot: true },
      { name: "Electric Scooters", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&h=200&fit=crop", hot: true },
      { name: "Smart Watches", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&h=200&fit=crop" },
      { name: "Drones", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop" },
      { name: "5G Smartphones", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff70?w=200&h=200&fit=crop" },
      { name: "Wedding Dresses", image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=200&h=200&fit=crop" },
      { name: "Handbags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "apparel",
    name: "Apparel & Accessories",
    icon: "👗",
    subCategories: [
      { name: "Wedding Dresses", image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=200&h=200&fit=crop", hot: true },
      { name: "Evening Gowns", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200&h=200&fit=crop" },
      { name: "Women's Sets", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=200&h=200&fit=crop" },
      { name: "Handbags", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&h=200&fit=crop", hot: true },
      { name: "Jackets & Coats", image: "https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?w=200&h=200&fit=crop" },
      { name: "Shoes", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
      { name: "Men's Suits", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&h=200&fit=crop" },
      { name: "T-Shirts", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" },
      { name: "Jeans & Denim", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
      { name: "Sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop" },
      { name: "Belts", image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&h=200&fit=crop" },
      { name: "Scarves", image: "https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=200&h=200&fit=crop" },
      { name: "Hats & Caps", image: "https://images.unsplash.com/photo-1533827432537-1f3aafnaea23?w=200&h=200&fit=crop" },
      { name: "Swimwear", image: "https://images.unsplash.com/photo-1570976447640-ac859083963f?w=200&h=200&fit=crop" },
      { name: "Sportswear", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop" },
      { name: "Underwear", image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4687?w=200&h=200&fit=crop" },
      { name: "Socks & Hosiery", image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=200&h=200&fit=crop" },
      { name: "Wallets", image: "https://images.unsplash.com/photo-1627123424574-724758594913?w=200&h=200&fit=crop" },
      { name: "Ties & Bowties", image: "https://images.unsplash.com/photo-1598808503746-f34cfffe31d7?w=200&h=200&fit=crop" },
      { name: "Winter Boots", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=200&h=200&fit=crop" },
      { name: "Heels", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop" },
      { name: "Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop" },
      { name: "Pajamas", image: "https://images.unsplash.com/photo-1631541909061-71e349d1f1e8?w=200&h=200&fit=crop" },
      { name: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "electronics",
    name: "Consumer Electronics",
    icon: "📱",
    subCategories: [
      { name: "5G Smartphones", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff70?w=200&h=200&fit=crop", hot: true },
      { name: "Cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop" },
      { name: "Drones", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=200&h=200&fit=crop", hot: true },
      { name: "Smart Watches", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&h=200&fit=crop" },
      { name: "Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
      { name: "Speakers", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=200&fit=crop" },
      { name: "Laptops", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop" },
      { name: "Tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop" },
      { name: "Gaming Consoles", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop" },
      { name: "Smart TVs", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=200&h=200&fit=crop" },
      { name: "Earbuds", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&h=200&fit=crop" },
      { name: "Power Banks", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&h=200&fit=crop" },
      { name: "USB Hubs", image: "https://images.unsplash.com/photo-1625947185073-2e61fd7e33bf?w=200&h=200&fit=crop" },
      { name: "Monitors", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop" },
      { name: "Keyboards", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200&h=200&fit=crop" },
      { name: "Smart Home Hubs", image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=200&h=200&fit=crop" },
      { name: "Projectors", image: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=200&h=200&fit=crop" },
      { name: "Printers", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200&h=200&fit=crop" },
      { name: "Routers", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=200&fit=crop" },
      { name: "Action Cameras", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "VR Headsets", image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=200&h=200&fit=crop" },
      { name: "LED Strips", image: "https://images.unsplash.com/photo-1634150379059-7b2f3d2d4d16?w=200&h=200&fit=crop" },
      { name: "SSD Drives", image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&h=200&fit=crop" },
      { name: "Webcams", image: "https://images.unsplash.com/photo-1626379616069-1b33b5c6ca68?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "sports",
    name: "Sports & Entertainment",
    icon: "⚽",
    subCategories: [
      { name: "Treadmills", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop", hot: true },
      { name: "Dumbbells", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop" },
      { name: "Yoga Mats", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&h=200&fit=crop" },
      { name: "Bicycles", image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=200&h=200&fit=crop" },
      { name: "Camping Tents", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=200&h=200&fit=crop" },
      { name: "Fishing Rods", image: "https://images.unsplash.com/photo-1545450571-efce5b1e4de9?w=200&h=200&fit=crop" },
      { name: "Skateboards", image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=200&h=200&fit=crop" },
      { name: "Tennis Rackets", image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=200&h=200&fit=crop" },
      { name: "Golf Clubs", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=200&h=200&fit=crop" },
      { name: "Boxing Gloves", image: "https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=200&h=200&fit=crop" },
      { name: "Swimming Goggles", image: "https://images.unsplash.com/photo-1600965962361-9035dbfd1c50?w=200&h=200&fit=crop" },
      { name: "Roller Skates", image: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?w=200&h=200&fit=crop" },
      { name: "Resistance Bands", image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=200&h=200&fit=crop" },
      { name: "Footballs", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=200&h=200&fit=crop" },
      { name: "Basketballs", image: "https://images.unsplash.com/photo-1546519638405-a2a27459bfc7?w=200&h=200&fit=crop" },
      { name: "Surfboards", image: "https://images.unsplash.com/photo-1531722569936-825d4ecea6cd?w=200&h=200&fit=crop" },
      { name: "Hiking Gear", image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=200&h=200&fit=crop" },
      { name: "Jump Ropes", image: "https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?w=200&h=200&fit=crop" },
      { name: "Dart Boards", image: "https://images.unsplash.com/photo-1603363615705-5efdfb9cad05?w=200&h=200&fit=crop" },
      { name: "Board Games", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200&h=200&fit=crop" },
      { name: "Gym Benches", image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=200&h=200&fit=crop" },
      { name: "Kettlebells", image: "https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=200&h=200&fit=crop" },
      { name: "Badminton Sets", image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&h=200&fit=crop" },
      { name: "Archery Sets", image: "https://images.unsplash.com/photo-1564951434112-64d74cc2a2d7?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "beauty",
    name: "Beauty & Personal Care",
    icon: "💄",
    subCategories: [
      { name: "Lipsticks", image: "https://images.unsplash.com/photo-1586495777744-4e6232bf2264?w=200&h=200&fit=crop", hot: true },
      { name: "Perfumes", image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&h=200&fit=crop" },
      { name: "Face Serums", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=200&h=200&fit=crop" },
      { name: "Mascaras", image: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=200&h=200&fit=crop" },
      { name: "Face Wash", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop" },
      { name: "Hair Dryers", image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=200&h=200&fit=crop" },
      { name: "Nail Polish", image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200&h=200&fit=crop" },
      { name: "Sunscreen", image: "https://images.unsplash.com/photo-1556228852-6d35a585d566?w=200&h=200&fit=crop" },
      { name: "Eye Shadow Palettes", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&h=200&fit=crop" },
      { name: "Hair Extensions", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=200&h=200&fit=crop" },
      { name: "Foundation", image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=200&h=200&fit=crop" },
      { name: "Moisturizers", image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=200&h=200&fit=crop" },
      { name: "Curling Irons", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop" },
      { name: "Shampoos", image: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=200&h=200&fit=crop" },
      { name: "Body Lotion", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop" },
      { name: "Electric Shavers", image: "https://images.unsplash.com/photo-1621607950894-5c4d95fbbcd8?w=200&h=200&fit=crop" },
      { name: "Face Masks", image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&h=200&fit=crop" },
      { name: "Bronzers", image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop" },
      { name: "Hair Wigs", image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=200&h=200&fit=crop" },
      { name: "Eyelashes", image: "https://images.unsplash.com/photo-1522426266214-ec2d2abb9bb2?w=200&h=200&fit=crop" },
      { name: "Tweezers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Teeth Whitening", image: "https://images.unsplash.com/photo-1559591935-c53d295ea7c9?w=200&h=200&fit=crop" },
      { name: "Jade Rollers", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&h=200&fit=crop" },
      { name: "Makeup Brushes", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "jewelry",
    name: "Jewelry, Eyewear & Watches",
    icon: "💎",
    subCategories: [
      { name: "Gold Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop", hot: true },
      { name: "Diamond Necklaces", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
      { name: "Pearl Earrings", image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=200&h=200&fit=crop" },
      { name: "Luxury Watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
      { name: "Reading Glasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop" },
      { name: "Bracelets", image: "https://images.unsplash.com/photo-1573408301185-9519f94815b7?w=200&h=200&fit=crop" },
      { name: "Anklets", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=200&h=200&fit=crop" },
      { name: "Cufflinks", image: "https://images.unsplash.com/photo-1598808503746-f34cfffe31d7?w=200&h=200&fit=crop" },
      { name: "Pendants", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop" },
      { name: "Charm Bracelets", image: "https://images.unsplash.com/photo-1624621027457-3ef37e35e6f4?w=200&h=200&fit=crop" },
      { name: "Titanium Rings", image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=200&h=200&fit=crop" },
      { name: "Hair Jewelry", image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=200&h=200&fit=crop" },
      { name: "Body Jewelry", image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=200&h=200&fit=crop" },
      { name: "Blue Light Glasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop" },
      { name: "Sports Watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop" },
      { name: "Smartwatches", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&h=200&fit=crop" },
      { name: "Aviator Sunglasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&h=200&fit=crop" },
      { name: "Silver Chains", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop" },
      { name: "Gemstone Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&h=200&fit=crop" },
      { name: "Nose Rings", image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "home",
    name: "Home & Garden",
    icon: "🏠",
    subCategories: [
      { name: "Sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop", hot: true },
      { name: "Dining Tables", image: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=200&h=200&fit=crop" },
      { name: "Bedding Sets", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=200&h=200&fit=crop" },
      { name: "Curtains", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Kitchen Knives", image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=200&h=200&fit=crop" },
      { name: "Garden Tools", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Wall Art", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop" },
      { name: "Rugs", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=200&h=200&fit=crop" },
      { name: "Candles", image: "https://images.unsplash.com/photo-1608181831718-c9fba5da50db?w=200&h=200&fit=crop" },
      { name: "Flower Pots", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=200&h=200&fit=crop" },
      { name: "LED Lights", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&h=200&fit=crop" },
      { name: "Air Purifiers", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop" },
      { name: "Cookware Sets", image: "https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=200&h=200&fit=crop" },
      { name: "Towels", image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=200&h=200&fit=crop" },
      { name: "Mirrors", image: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=200&h=200&fit=crop" },
      { name: "Wardrobes", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=200&h=200&fit=crop" },
      { name: "Vacuum Cleaners", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=200&h=200&fit=crop" },
      { name: "Coffee Makers", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop" },
      { name: "Blenders", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&h=200&fit=crop" },
      { name: "Storage Boxes", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Door Mats", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop" },
      { name: "Shower Heads", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop" },
      { name: "Trash Cans", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Picture Frames", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "vehicles",
    name: "Vehicles & Accessories",
    icon: "🚗",
    subCategories: [
      { name: "Electric Cars", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=200&h=200&fit=crop", hot: true },
      { name: "Electric Scooters", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&h=200&fit=crop", hot: true },
      { name: "Electric Motorcycles", image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?w=200&h=200&fit=crop" },
      { name: "Car Accessories", image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=200&h=200&fit=crop" },
      { name: "Used Cars", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=200&h=200&fit=crop" },
      { name: "Car Seat Covers", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop" },
      { name: "Dashcams", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=200&h=200&fit=crop" },
      { name: "Car Wax", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Bicycles", image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=200&h=200&fit=crop" },
      { name: "Truck Parts", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=200&h=200&fit=crop" },
      { name: "Tires", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "GPS Trackers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Boat Accessories", image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=200&h=200&fit=crop" },
      { name: "Helmets", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "LED Headlights", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Car Chargers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Roof Racks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "ATV Vehicles", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Motor Oil", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Car Mats", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "machinery",
    name: "Commercial Machinery",
    icon: "🏭",
    subCategories: [
      { name: "Vending Machines", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=200&h=200&fit=crop", hot: true },
      { name: "Lathes", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop" },
      { name: "Excavators", image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=200&h=200&fit=crop" },
      { name: "CNC Machines", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "3D Printers", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Laser Cutters", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Forklifts", image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=200&h=200&fit=crop" },
      { name: "Industrial Pumps", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Air Compressors", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Welding Machines", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Generators", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Solar Panels", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop" },
      { name: "Packaging Machines", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Conveyor Belts", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Food Processing", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Textile Machines", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "luggage",
    name: "Luggage, Bags & Cases",
    icon: "🧳",
    subCategories: [
      { name: "Suitcases", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop", hot: true },
      { name: "Backpacks", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Laptop Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Duffel Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Clutch Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
      { name: "Gym Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "School Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Tote Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
      { name: "Travel Pillows", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Passport Holders", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Packing Cubes", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Business Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Camera Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Kids Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Waist Bags", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop" },
      { name: "Crossbody Bags", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "kids",
    name: "Parents, Kids & Toys",
    icon: "🧸",
    subCategories: [
      { name: "LEGO Sets", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop", hot: true },
      { name: "Stuffed Animals", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Baby Strollers", image: "https://images.unsplash.com/photo-1541971297127-c4e6f5d2b97e?w=200&h=200&fit=crop" },
      { name: "RC Cars", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Puzzles", image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=200&h=200&fit=crop" },
      { name: "Dolls", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Baby Monitors", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Baby Clothes", image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=200&h=200&fit=crop" },
      { name: "Educational Toys", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop" },
      { name: "Playmats", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Kids Bicycles", image: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=200&h=200&fit=crop" },
      { name: "Board Games", image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200&h=200&fit=crop" },
      { name: "Slime Kits", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Art Supplies", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop" },
      { name: "Trampoline", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Play Tents", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Baby Cribs", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Breastfeeding Gear", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "food",
    name: "Food & Beverages",
    icon: "🍎",
    subCategories: [
      { name: "Organic Honey", image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop", hot: true },
      { name: "Green Tea", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop" },
      { name: "Protein Powder", image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=200&h=200&fit=crop" },
      { name: "Coffee Beans", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop" },
      { name: "Olive Oil", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop" },
      { name: "Spices & Herbs", image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=200&h=200&fit=crop" },
      { name: "Chocolate", image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=200&h=200&fit=crop" },
      { name: "Dried Fruits", image: "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=200&h=200&fit=crop" },
      { name: "Nuts & Seeds", image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=200&h=200&fit=crop" },
      { name: "Fruit Juice", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop" },
      { name: "Energy Drinks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Rice & Grains", image: "https://images.unsplash.com/photo-1536304993881-ff86e0c9b589?w=200&h=200&fit=crop" },
      { name: "Pasta & Noodles", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop" },
      { name: "Cooking Sauces", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Vitamins", image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop" },
      { name: "Mineral Water", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop" },
      { name: "Wine", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop" },
      { name: "Cheese", image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=200&h=200&fit=crop" },
      { name: "Snack Foods", image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=200&h=200&fit=crop" },
      { name: "Cooking Oil", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "health",
    name: "Health & Medical",
    icon: "💊",
    subCategories: [
      { name: "Blood Pressure Monitors", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop", hot: true },
      { name: "Pulse Oximeters", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "Massage Guns", image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop" },
      { name: "Thermometers", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "First Aid Kits", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "Hearing Aids", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop" },
      { name: "Wheelchairs", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "CPAP Machines", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "Surgical Masks", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "Glucose Monitors", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "Nebulizers", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "Yoga Blocks", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=200&h=200&fit=crop" },
      { name: "Eye Drops", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
      { name: "Compression Socks", image: "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=200&h=200&fit=crop" },
      { name: "Orthotics", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "office",
    name: "Office & School Supplies",
    icon: "📚",
    subCategories: [
      { name: "Office Chairs", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&h=200&fit=crop", hot: true },
      { name: "Standing Desks", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=200&fit=crop" },
      { name: "Notebooks", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop" },
      { name: "Pens & Pencils", image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200&h=200&fit=crop" },
      { name: "Whiteboards", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Staplers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "File Organizers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Desk Lamps", image: "https://images.unsplash.com/photo-1513506003901-1e6a35049769?w=200&h=200&fit=crop" },
      { name: "Paper Shredders", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Calculators", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Label Makers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Paper", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Ink Cartridges", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Binders", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Scissors", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "construction",
    name: "Construction & Real Estate",
    icon: "🏗️",
    subCategories: [
      { name: "Cement", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop" },
      { name: "Steel Pipes", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Power Drills", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop", hot: true },
      { name: "Safety Helmets", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Paint Brushes", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Tile Flooring", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Plywood Sheets", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Angle Grinders", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop" },
      { name: "Scaffold Systems", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop" },
      { name: "Safety Gloves", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Wall Paint", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Waterproofing", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "agriculture",
    name: "Agriculture & Food",
    icon: "🌾",
    subCategories: [
      { name: "Tractors", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=200&fit=crop", hot: true },
      { name: "Irrigation Systems", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Seeds", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Fertilizers", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Greenhouses", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Harvesting Tools", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Beehives", image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&h=200&fit=crop" },
      { name: "Crop Protection", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Garden Sprayers", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Animal Feed", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Soil Testing Kits", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Hydroponic Kits", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "energy",
    name: "Energy & Environment",
    icon: "⚡",
    subCategories: [
      { name: "Solar Panels", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop", hot: true },
      { name: "Wind Turbines", image: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?w=200&h=200&fit=crop" },
      { name: "EV Chargers", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Battery Storage", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Power Inverters", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "LED Lighting", image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&h=200&fit=crop" },
      { name: "Smart Meters", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Hydroponics", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop" },
      { name: "Generators", image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop" },
      { name: "Water Filters", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&h=200&fit=crop" },
      { name: "Air Purifiers", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop" },
      { name: "Solar Water Heaters", image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop" },
    ]
  },
  {
    id: "pets",
    name: "Pets & Animals",
    icon: "🐾",
    subCategories: [
      { name: "Dog Food", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop", hot: true },
      { name: "Cat Trees", image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=200&h=200&fit=crop" },
      { name: "Pet Carriers", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
      { name: "Aquariums", image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=200&h=200&fit=crop" },
      { name: "Bird Cages", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
      { name: "Dog Leashes", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
      { name: "Pet Beds", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
      { name: "Grooming Tools", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
      { name: "Pet Toys", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
      { name: "Cat Litter", image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=200&h=200&fit=crop" },
      { name: "Dog Collars", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop" },
      { name: "Reptile Terrariums", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop" },
    ]
  },
];

const AllCategory = () => {
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredSub, setHoveredSub] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef(null);

  const handleCategoryChange = (cat) => {
    if (cat.id === activeCategory.id) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveCategory(cat);
      setIsAnimating(false);
    }, 150);
  };

  const filteredSubs = activeCategory.subCategories.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSubCount = activeCategory.subCategories.length;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#faf7f5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sidebar-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 16px;
          cursor: pointer;
          transition: all 0.18s ease;
          border-left: 3px solid transparent;
          user-select: none;
        }
        .sidebar-item:hover {
          background: #f5f0ed;
          border-left-color: #250902;
        }
        .sidebar-item.active {
          background: #f5f0ed;
          border-left-color: #250902;
          color: #250902;
        }
        .sidebar-item .item-icon {
          font-size: 18px;
          width: 26px;
          text-align: center;
          flex-shrink: 0;
        }
        .sidebar-item .item-name {
          flex: 1;
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          margin-left: 10px;
          line-height: 1.3;
        }
        .sidebar-item.active .item-name {
          color: #250902;
          font-weight: 600;
        }
        .sidebar-item .chevron {
          border-left-color: #250902
          color: ;
          font-size: 11px;
          opacity: 0;
          transition: opacity 0.18s;
        }
        .sidebar-item:hover .chevron,
        .sidebar-item.active .chevron {
          opacity: 1;
        }

        .sub-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          padding: 14px 10px 12px;
          border-radius: 12px;
          transition: all 0.2s ease;
          position: relative;
          background: #fff;
          border: 1.5px solid #f0f0f0;
        }
        .sub-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(37,9,2,0.13);
          border-color: #d4b8a5;
        }
        .sub-card img {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          object-fit: cover;
          background: #f7f7f7;
          transition: transform 0.2s ease;
        }
        .sub-card:hover img {
          transform: scale(1.07);
        }
        .sub-card .sub-name {
          margin-top: 10px;
          font-size: 12.5px;
          font-weight: 500;
          text-align: center;
          color: #333;
          line-height: 1.35;
        }
        .sub-card:hover .sub-name {
          color: #250902;
        }
        .hot-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 14px;
          line-height: 1;
        }
        .new-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #250902;
          color: white;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .content-area {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .content-area.animating {
          opacity: 0;
          transform: translateX(8px);
        }
        .search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1.5px solid #e8e8e8;
          border-radius: 8px;
          padding: 8px 14px;
          margin-bottom: 20px;
          transition: border-color 0.2s;
        }
        .search-bar:focus-within {
          border-color: #250902;
          box-shadow: 0 0 0 3px rgba(37,9,2,0.1);
        }
        .search-bar input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 13.5px;
          color: #333;
          font-family: inherit;
          background: transparent;
        }
        .search-bar input::placeholder { color: #aaa; }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .category-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .category-title .title-icon { font-size: 22px; }
        .count-badge {
          background: #f5f0ed;
          color: #250902;
          font-size: 12px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid #d4b8a5;
        }
        .sub-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 14px;
        }

        .top-bar {
          background: linear-gradient(135deg, #250902 0%, #4a1a04 100%);
          padding: 10px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 12px rgba(37,9,2,0.25);
        }
        .top-bar-title {
          font-size: 18px;
          font-weight: 700;
          color: white;
          letter-spacing: -0.3px;
        }
        .top-bar-sub { font-size: 12px; color: rgba(255,255,255,0.8); }

        .sidebar-section-header {
          padding: 10px 16px 6px;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #8b7355;
          background: #faf7f5;
          border-bottom: 1px solid #e8e0d8;
        }

        .scroll-sidebar {
          overflow-y: auto;
          flex: 1;
          scrollbar-width: thin;
          scrollbar-color: #d4b8a5 transparent;
        }
        .scroll-sidebar::-webkit-scrollbar { width: 4px; }
        .scroll-sidebar::-webkit-scrollbar-thumb { background: #d4b8a5; border-radius: 2px; }

        .scroll-content {
          overflow-y: auto;
          flex: 1;
          padding: 24px;
          scrollbar-width: thin;
          scrollbar-color: #e0e0e0 transparent;
        }
        .scroll-content::-webkit-scrollbar { width: 4px; }
        .scroll-content::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 2px; }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: #bbb;
          text-align: center;
        }
        .empty-state .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .empty-state p { font-size: 14px; }
      `}</style>

      {/* Top Bar */}
      <div className="top-bar">
        <div>
          <div className="top-bar-title">🛒 All Categories</div>
          <div className="top-bar-sub">{categoriesData.reduce((a, c) => a + c.subCategories.length, 0)}+ products across {categoriesData.length} categories</div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", fontWeight: 500 }}>
          {activeCategory.icon} {activeCategory.name}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, height: "calc(100vh - 56px)", overflow: "hidden" }}>
        
        {/* Sidebar */}
        <div style={{ width: "220px", flexShrink: 0, background: "#ffffff", borderRight: "1px solid #e8e0d8", display: "flex", flexDirection: "column", boxShadow: "2px 0 8px rgba(37,9,2,0.04)" }}>
          <div className="sidebar-section-header">Browse</div>
          <div className="scroll-sidebar">
            {categoriesData.map((cat) => (
              <div
                key={cat.id}
                className={`sidebar-item ${activeCategory.id === cat.id ? "active" : ""}`}
                onMouseEnter={() => handleCategoryChange(cat)}
                onClick={() => handleCategoryChange(cat)}
              >
                <span className="item-icon">{cat.icon}</span>
                <span className="item-name">{cat.name}</span>
                {cat.subCategories.length > 0 && (
                  <span style={{ fontSize: "10px", color: "#ccc", marginRight: 4, fontWeight: 500 }}>
                    {cat.subCategories.length}
                  </span>
                )}
                <span className="chevron">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="scroll-content">
          <div className={`content-area ${isAnimating ? "animating" : ""}`}>
            
            {/* Header */}
            <div className="category-header">
              <div className="category-title">
                <span className="title-icon">{activeCategory.icon}</span>
                {activeCategory.name}
              </div>
              <span className="count-badge">{totalSubCount} items</span>
            </div>

            {/* Search */}
            <div className="search-bar">
              <span style={{ color: "#aaa", fontSize: "16px" }}>🔍</span>
              <input
                type="text"
                placeholder={`Search in ${activeCategory.name}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <span
                  style={{ color: "#aaa", cursor: "pointer", fontSize: "16px" }}
                  onClick={() => setSearchQuery("")}
                >✕</span>
              )}
            </div>

            {/* Grid */}
            {filteredSubs.length > 0 ? (
              <div className="sub-grid">
                {filteredSubs.map((sub, index) => (
                  <div
                    key={index}
                    className="sub-card"
                    style={{ animationDelay: `${index * 20}ms` }}
                    onMouseEnter={() => setHoveredSub(index)}
                    onMouseLeave={() => setHoveredSub(null)}
                  >
                    {sub.hot && <span className="hot-badge">🔥</span>}
                    {index % 7 === 0 && !sub.hot && <span className="new-badge">New</span>}
                    <img
                      src={sub.image}
                      alt={sub.name}
                      onError={e => { e.target.src = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop"; }}
                    />
                    <span className="sub-name">{sub.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <p>No results for "<strong>{searchQuery}</strong>"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
