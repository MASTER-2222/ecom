
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { addToWishlist, saveForLater, addProductReview, getProductReviews } from '@/lib/database';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  images: string[];
  rating: number;
  reviews: number;
  brand: string;
  description: string;
  features: string[];
  specifications: { [key: string]: string };
  category: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const products: { [key: string]: Product } = {
  // Electronics Products
  '1': {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Black, 256GB)',
    price: 124999,
    originalPrice: 149999,
    images: [
      'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20smartphone%20in%20titanium%20black%20color%20with%20sleek%20modern%20design%2C%20product%20photography%20on%20clean%20white%20background%2C%20professional%20lighting%2C%20high-end%20smartphone%20with%20premium%20metallic%20finish%20and%20camera%20module%20visible&width=500&height=500&seq=s24-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20titanium%20black%20back%20view%20camera%20setup%20premium%20design%20clean%20white%20background%20professional%20product%20photography%20detailed%20view&width=500&height=500&seq=s24-back&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20titanium%20black%20side%20view%20profile%20premium%20smartphone%20design%20clean%20white%20background%20professional%20product%20photography&width=500&height=500&seq=s24-side&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Samsung%20Galaxy%20S24%20Ultra%20accessories%20box%20contents%20charger%20cable%20premium%20package%20clean%20white%20background%20professional%20product%20photography&width=500&height=500&seq=s24-box&orientation=squarish'
    ],
    rating: 4.5,
    reviews: 2847,
    brand: 'Samsung',
    description: 'The Samsung Galaxy S24 Ultra redefines mobile excellence with its titanium build, advanced AI features, and professional-grade camera system. Experience unmatched performance with the latest Snapdragon processor and stunning display technology.',
    features: [
      '200MP main camera with advanced night photography',
      '6.8-inch Dynamic AMOLED 2X display with 120Hz',
      'S Pen included for productivity and creativity',
      '5000mAh battery with 45W fast charging',
      'IP68 water and dust resistance',
      'AI-powered photo and video editing'
    ],
    specifications: {
      'Display': '6.8" Dynamic AMOLED 2X, 3120 x 1440 pixels',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Storage': '256GB',
      'Camera': '200MP + 50MP + 10MP + 12MP',
      'Battery': '5000mAh',
      'OS': 'Android 14 with One UI 6.1',
      'Connectivity': '5G, Wi-Fi 7, Bluetooth 5.3'
    },
    category: 'Electronics'
  },
  '2': {
    id: '2',
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    price: 29990,
    originalPrice: 34990,
    images: [
      'https://readdy.ai/api/search-image?query=Sony%20premium%20wireless%20noise%20canceling%20headphones%20in%20black%20color%20with%20modern%20sleek%20design%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20high-quality%20audio%20headphones%20with%20cushioned%20ear%20cups&width=500&height=500&seq=sony-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Sony%20WH-1000XM5%20headphones%20side%20view%20showing%20adjustable%20headband%20and%20premium%20build%20quality%2C%20professional%20product%20photography%20clean%20white%20background&width=500&height=500&seq=sony-side&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Sony%20WH-1000XM5%20headphones%20with%20accessories%20carry%20case%20and%20cables%2C%20premium%20package%20unboxing%20clean%20white%20background%20professional%20photography&width=500&height=500&seq=sony-acc&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Sony%20WH-1000XM5%20headphones%20folded%20compact%20design%20showing%20portability%2C%20professional%20product%20photography%20clean%20white%20background&width=500&height=500&seq=sony-fold&orientation=squarish'
    ],
    rating: 4.7,
    reviews: 1523,
    brand: 'Sony',
    description: 'Industry-leading noise cancellation with Dual Noise Sensor technology. Premium sound quality with LDAC codec support and 30-hour battery life for ultimate listening experience.',
    features: [
      'Industry-leading noise cancellation technology',
      'Premium 30mm drivers for exceptional sound',
      'Up to 30 hours battery life with quick charge',
      'Multipoint connection for two devices',
      'Speak-to-Chat technology automatically pauses music',
      'Touch sensor controls for easy operation'
    ],
    specifications: {
      'Driver Unit': '30mm dome type',
      'Frequency Response': '4 Hz - 40,000 Hz',
      'Battery Life': 'Up to 30 hours',
      'Charging Time': '3.5 hours (Quick charge: 3 min for 3 hours)',
      'Weight': 'Approx. 250g',
      'Connectivity': 'Bluetooth 5.2, NFC, USB-C',
      'Noise Cancellation': 'Dual Noise Sensor Technology',
      'Codecs': 'SBC, AAC, LDAC'
    },
    category: 'Electronics'
  },
  '3': {
    id: '3',
    name: 'Apple MacBook Air M2 (13-inch, 8GB RAM, 256GB SSD)',
    price: 114900,
    originalPrice: 119900,
    images: [
      'https://readdy.ai/api/search-image?query=Apple%20MacBook%20Air%20M2%20laptop%20in%20silver%20color%20with%20ultra-thin%20design%2C%20clean%20minimalist%20product%20photography%20on%20white%20background%2C%20premium%20aluminum%20finish%20laptop%20computer%20with%20Apple%20logo%20visible&width=500&height=500&seq=macbook-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Apple%20MacBook%20Air%20M2%20laptop%20open%20showing%20keyboard%20and%20screen%2C%20clean%20design%20professional%20product%20photography%20white%20background&width=500&height=500&seq=macbook-open&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Apple%20MacBook%20Air%20M2%20laptop%20side%20view%20showing%20ultra-thin%20profile%2C%20premium%20design%20professional%20photography%20white%20background&width=500&height=500&seq=macbook-side&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Apple%20MacBook%20Air%20M2%20laptop%20with%20accessories%20MagSafe%20charger%20and%20cables%2C%20premium%20unboxing%20white%20background%20professional%20photography&width=500&height=500&seq=macbook-acc&orientation=squarish'
    ],
    rating: 4.8,
    reviews: 3621,
    brand: 'Apple',
    description: 'Redesigned MacBook Air with M2 chip delivers incredible performance and efficiency. Ultra-thin design with stunning Liquid Retina display and all-day battery life.',
    features: [
      'Apple M2 chip with 8-core CPU and 8-core GPU',
      '13.6-inch Liquid Retina display with 500 nits brightness',
      'Up to 18 hours battery life',
      'MagSafe 3 charging port',
      '1080p FaceTime HD camera with advanced image signal processor',
      'Four-speaker sound system with Spatial Audio'
    ],
    specifications: {
      'Processor': 'Apple M2 chip with 8-core CPU',
      'Memory': '8GB unified memory',
      'Storage': '256GB SSD',
      'Display': '13.6-inch Liquid Retina, 2560 x 1664 pixels',
      'Graphics': '8-core GPU',
      'Camera': '1080p FaceTime HD camera',
      'Audio': 'Four-speaker sound system',
      'Connectivity': 'Wi-Fi 6, Bluetooth 5.0, 2x Thunderbolt'
    },
    category: 'Electronics'
  },
  // Fashion Products
  '4': {
    id: '4',
    name: 'Levi\'s Men\'s 511 Slim Fit Jeans - Dark Blue',
    price: 2999,
    originalPrice: 4499,
    images: [
      'https://readdy.ai/api/search-image?query=Levis%20mens%20slim%20fit%20dark%20blue%20jeans%20with%20modern%20cut%20and%20premium%20denim%20fabric%2C%20professional%20fashion%20product%20photography%20on%20clean%20white%20background%2C%20stylish%20casual%20wear%20with%20brand%20details%20visible&width=500&height=500&seq=levis-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Levis%20511%20jeans%20back%20view%20showing%20pockets%20and%20fit%2C%20premium%20denim%20detailing%20professional%20fashion%20photography%20white%20background&width=500&height=500&seq=levis-back&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Levis%20jeans%20fabric%20detail%20showing%20premium%20denim%20texture%20and%20stitching%20quality%2C%20close-up%20professional%20photography%20white%20background&width=500&height=500&seq=levis-fabric&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Levis%20jeans%20waistband%20and%20label%20detail%20showing%20authentic%20brand%20tags%2C%20professional%20fashion%20photography%20white%20background&width=500&height=500&seq=levis-label&orientation=squarish'
    ],
    rating: 4.4,
    reviews: 1247,
    brand: 'Levi\'s',
    description: 'Classic slim fit jeans crafted from premium denim. The 511 offers a modern silhouette that sits below the waist with a slim fit through the hip and thigh.',
    features: [
      'Slim fit through hip and thigh',
      'Premium stretch denim for comfort',
      'Classic 5-pocket styling',
      'Zip fly with button closure',
      'Machine washable',
      'Iconic Levi\'s Red Tab'
    ],
    specifications: {
      'Material': '99% Cotton, 1% Elastane',
      'Fit': 'Slim fit',
      'Rise': 'Sits below waist',
      'Leg Opening': '14.5 inches',
      'Inseam': '32 inches',
      'Care': 'Machine wash cold',
      'Origin': 'Imported',
      'Style': '511-0408'
    },
    category: 'Fashion'
  },
  '5': {
    id: '5',
    name: 'Nike Air Force 1 Low White Sneakers - Unisex',
    price: 7999,
    originalPrice: 8999,
    images: [
      'https://readdy.ai/api/search-image?query=Nike%20Air%20Force%201%20white%20sneakers%20with%20classic%20design%20and%20premium%20leather%20upper%2C%20iconic%20basketball%20shoes%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20athletic%20footwear%20with%20Nike%20swoosh%20logo&width=500&height=500&seq=nike-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Nike%20Air%20Force%201%20sneakers%20side%20view%20showing%20classic%20silhouette%20and%20Air%20sole%20unit%2C%20professional%20footwear%20photography%20white%20background&width=500&height=500&seq=nike-side&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Nike%20Air%20Force%201%20sneakers%20sole%20view%20showing%20tread%20pattern%20and%20Air%20technology%2C%20professional%20product%20photography%20white%20background&width=500&height=500&seq=nike-sole&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Nike%20Air%20Force%201%20sneakers%20pair%20with%20shoebox%20and%20tissue%20paper%2C%20premium%20packaging%20professional%20photography%20white%20background&width=500&height=500&seq=nike-box&orientation=squarish'
    ],
    rating: 4.8,
    reviews: 2156,
    brand: 'Nike',
    description: 'The iconic Nike Air Force 1 Low delivers timeless style with premium leather construction and legendary Air cushioning for all-day comfort.',
    features: [
      'Premium leather upper for durability',
      'Encapsulated Air-Sole unit for lightweight cushioning',
      'Solid rubber outsole with pivot points',
      'Perforations on toe for breathability',
      'Classic basketball-inspired design',
      'Iconic Nike Swoosh branding'
    ],
    specifications: {
      'Upper': 'Premium leather',
      'Midsole': 'Encapsulated Air-Sole unit',
      'Outsole': 'Solid rubber with pivot points',
      'Closure': 'Lace-up',
      'Weight': 'Approximately 1.2 lbs',
      'Origin': 'Imported',
      'Style': 'CW2288-111',
      'Gender': 'Unisex'
    },
    category: 'Fashion'
  },
  // Home & Living Products
  '6': {
    id: '6',
    name: 'IKEA HEMNES Bed Frame with 4 Storage Boxes - White Stain',
    price: 24999,
    originalPrice: 29999,
    images: [
      'https://readdy.ai/api/search-image?query=Modern%20white%20wooden%20bed%20frame%20with%20built-in%20storage%20drawers%20underneath%2C%20Scandinavian%20minimalist%20design%20furniture%20for%20bedroom%2C%20clean%20white%20background%20professional%20product%20photography%2C%20elegant%20home%20furniture&width=500&height=500&seq=ikea-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=IKEA%20HEMNES%20bed%20frame%20storage%20drawer%20detail%20showing%20organization%20compartments%2C%20functional%20bedroom%20furniture%20white%20background%20professional%20photography&width=500&height=500&seq=ikea-storage&orientation=squarish',
      'https://readdy.ai/api/search-image?query=IKEA%20HEMNES%20bed%20frame%20headboard%20detail%20showing%20wooden%20craftsmanship%20and%20white%20stain%20finish%2C%20professional%20furniture%20photography%20white%20background&width=500&height=500&seq=ikea-head&orientation=squarish',
      'https://readdy.ai/api/search-image?query=IKEA%20HEMNES%20bed%20frame%20assembly%20parts%20and%20hardware%20components%2C%20flat-pack%20furniture%20packaging%20professional%20photography%20white%20background&width=500&height=500&seq=ikea-parts&orientation=squarish'
    ],
    rating: 4.5,
    reviews: 1247,
    brand: 'IKEA',
    description: 'Solid wood bed frame with integrated storage solution. Four spacious storage boxes provide ample space for bedding, clothes, or seasonal items.',
    features: [
      'Solid pine wood construction',
      '4 large storage boxes on castors',
      'Adjustable bed sides for different mattress heights',
      'Traditional style with modern functionality',
      'Easy to assemble with included hardware',
      'Sustainable wood from responsibly managed forests'
    ],
    specifications: {
      'Material': 'Solid pine, white stain',
      'Bed Size': 'Queen (160x200 cm)',
      'Storage Boxes': '4 boxes on castors',
      'Weight Capacity': '300 kg',
      'Assembly Required': 'Yes',
      'Warranty': '25 years',
      'Dimensions': '166x209x95 cm',
      'Mattress Size': '160x200 cm'
    },
    category: 'Home'
  },
  '7': {
    id: '7',
    name: 'Urban Ladder Aruba 3-Seater Fabric Sofa - Navy Blue',
    price: 34999,
    originalPrice: 44999,
    images: [
      'https://readdy.ai/api/search-image?query=Modern%20navy%20blue%20fabric%20sofa%20with%20clean%20lines%20and%20comfortable%20cushions%2C%20contemporary%20living%20room%20furniture%20with%20wooden%20legs%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20stylish%20home%20decor&width=500&height=500&seq=sofa-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Urban%20Ladder%20Aruba%20sofa%20side%20view%20showing%20wooden%20legs%20and%20fabric%20upholstery%2C%20modern%20furniture%20design%20professional%20photography%20white%20background&width=500&height=500&seq=sofa-side&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Urban%20Ladder%20sofa%20cushion%20detail%20showing%20premium%20fabric%20texture%20and%20comfort%2C%20close-up%20furniture%20photography%20white%20background&width=500&height=500&seq=sofa-fabric&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Urban%20Ladder%20sofa%20wooden%20legs%20detail%20showing%20craftsmanship%20and%20finish%2C%20professional%20furniture%20photography%20white%20background&width=500&height=500&seq=sofa-legs&orientation=squarish'
    ],
    rating: 4.6,
    reviews: 892,
    brand: 'Urban Ladder',
    description: 'Contemporary 3-seater sofa featuring premium fabric upholstery and solid wood legs. Perfect blend of comfort, style, and durability for modern living rooms.',
    features: [
      'Premium polyester fabric upholstery',
      'High-density foam cushioning for comfort',
      'Solid wood legs with natural finish',
      'Modern mid-century design',
      'Easy-to-clean fabric with stain resistance',
      'Sturdy hardwood frame construction'
    ],
    specifications: {
      'Seating Capacity': '3 seater',
      'Dimensions': '190 x 85 x 80 cm',
      'Frame Material': 'Engineered wood with hardwood',
      'Upholstery': 'Premium polyester fabric',
      'Cushion Fill': 'High-density foam',
      'Leg Material': 'Solid wood',
      'Weight Capacity': '250 kg',
      'Warranty': '1 year'
    },
    category: 'Home'
  },
  // Appliances Products
  '8': {
    id: '8',
    name: 'LG 260L 3-Star Smart Inverter Frost-Free Double Door Refrigerator',
    price: 28999,
    originalPrice: 34999,
    images: [
      'https://readdy.ai/api/search-image?query=Modern%20stainless%20steel%20double%20door%20refrigerator%20with%20sleek%20design%20and%20digital%20display%2C%20energy%20efficient%20home%20appliance%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20premium%20kitchen%20appliance&width=500&height=500&seq=lg-fridge-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=LG%20refrigerator%20interior%20showing%20spacious%20compartments%20and%20shelves%2C%20organized%20food%20storage%20professional%20appliance%20photography%20white%20background&width=500&height=500&seq=lg-fridge-inside&orientation=squarish',
      'https://readdy.ai/api/search-image?query=LG%20refrigerator%20digital%20control%20panel%20and%20display%20showing%20smart%20features%2C%20modern%20appliance%20interface%20professional%20photography%20white%20background&width=500&height=500&seq=lg-fridge-panel&orientation=squarish',
      'https://readdy.ai/api/search-image?query=LG%20refrigerator%20energy%20star%20rating%20label%20and%20specifications%2C%20efficient%20home%20appliance%20professional%20photography%20white%20background&width=500&height=500&seq=lg-fridge-rating&orientation=squarish'
    ],
    rating: 4.4,
    reviews: 1247,
    brand: 'LG',
    description: 'Energy-efficient double door refrigerator with Smart Inverter Compressor and frost-free technology. Features spacious interior and advanced cooling system.',
    features: [
      'Smart Inverter Compressor for energy efficiency',
      'Frost-free technology eliminates manual defrosting',
      'Multi Air Flow for uniform cooling',
      'Toughened glass shelves',
      'LED lighting for better visibility',
      'Door cooling+ for faster cooling'
    ],
    specifications: {
      'Capacity': '260 Litres',
      'Energy Rating': '3 Star',
      'Type': 'Frost Free Double Door',
      'Compressor': 'Smart Inverter',
      'Shelves': 'Toughened Glass',
      'Defrosting': 'Automatic',
      'Warranty': '1 Year Product + 10 Years Compressor',
      'Annual Energy Consumption': '248 kWh'
    },
    category: 'Appliances'
  },
  '9': {
    id: '9',
    name: 'Samsung 7kg Front Load Washing Machine with EcoBubble Technology',
    price: 32999,
    originalPrice: 39999,
    images: [
      'https://readdy.ai/api/search-image?query=Modern%20white%20front%20loading%20washing%20machine%20with%20digital%20display%20and%20sleek%20design%2C%20efficient%20laundry%20appliance%20for%20home%20use%2C%20professional%20product%20photography%20on%20clean%20white%20background%2C%20contemporary%20home%20appliance&width=500&height=500&seq=samsung-wash-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Samsung%20washing%20machine%20control%20panel%20showing%20various%20wash%20programs%20and%20digital%20display%2C%20modern%20appliance%20interface%20professional%20photography%20white%20background&width=500&height=500&seq=samsung-wash-panel&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Samsung%20washing%20machine%20drum%20interior%20showing%20stainless%20steel%20construction%20and%20wash%20basket%2C%20professional%20appliance%20photography%20white%20background&width=500&height=500&seq=samsung-wash-drum&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Samsung%20washing%20machine%20EcoBubble%20technology%20feature%20demonstration%2C%20energy%20efficient%20laundry%20professional%20photography%20white%20background&width=500&height=500&seq=samsung-wash-eco&orientation=squarish'
    ],
    rating: 4.5,
    reviews: 892,
    brand: 'Samsung',
    description: 'Advanced front load washing machine with EcoBubble technology for effective cleaning while being gentle on fabrics. Energy efficient with multiple wash programs.',
    features: [
      'EcoBubble technology for better cleaning',
      '7kg capacity suitable for families',
      'Digital Inverter Motor for durability',
      'Quick Wash cycle saves time',
      'Child Safety Lock for protection',
      '14 wash programs for different fabrics'
    ],
    specifications: {
      'Capacity': '7 kg',
      'Loading Type': 'Front Loading',
      'Motor': 'Digital Inverter Motor',
      'Spin Speed': '1200 RPM',
      'Programs': '14 wash programs',
      'Energy Rating': '5 Star',
      'Warranty': '2 Years + 20 Years Motor',
      'Water Consumption': '45 litres per cycle'
    },
    category: 'Appliances'
  },
  // Books Products
  '10': {
    id: '10',
    name: 'The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness',
    price: 299,
    originalPrice: 399,
    images: [
      'https://readdy.ai/api/search-image?query=Psychology%20of%20Money%20book%20cover%20with%20professional%20finance%20theme%20design%2C%20bestselling%20personal%20finance%20book%20with%20modern%20typography%20and%20money%20symbols%2C%20clean%20book%20cover%20photography%20on%20white%20background&width=500&height=500&seq=psychology-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Psychology%20of%20Money%20book%20back%20cover%20showing%20author%20bio%20and%20book%20summary%2C%20professional%20book%20photography%20white%20background&width=500&height=500&seq=psychology-back&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Psychology%20of%20Money%20book%20open%20showing%20chapter%20pages%20and%20typography%20layout%2C%20professional%20book%20photography%20white%20background&width=500&height=500&seq=psychology-open&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Psychology%20of%20Money%20book%20with%20bookmark%20and%20reading%20glasses%2C%20professional%20lifestyle%20book%20photography%20white%20background&width=500&height=500&seq=psychology-read&orientation=squarish'
    ],
    rating: 4.6,
    reviews: 2847,
    brand: 'Jaico Publishing',
    description: 'A masterpiece on behavioral finance that explores the strange ways people think about money. Morgan Housel shares 19 short stories exploring the psychology behind financial decisions.',
    features: [
      '19 compelling stories about financial behavior',
      'Insights into wealth building and money management',
      'Easy-to-understand financial psychology concepts',
      'Real-world examples and case studies',
      'Practical advice for better financial decisions',
      'International bestseller with proven impact'
    ],
    specifications: {
      'Author': 'Morgan Housel',
      'Publisher': 'Jaico Publishing House',
      'Language': 'English',
      'Pages': '252 pages',
      'Format': 'Paperback',
      'ISBN': '978-8184959932',
      'Publication Date': '2020',
      'Dimensions': '19.8 x 12.9 x 1.8 cm'
    },
    category: 'Books'
  },
  '11': {
    id: '11',
    name: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    price: 349,
    originalPrice: 449,
    images: [
      'https://readdy.ai/api/search-image?query=Atomic%20Habits%20book%20cover%20with%20minimalist%20design%20and%20productivity%20theme%2C%20bestselling%20self-help%20book%20with%20modern%20clean%20typography%2C%20professional%20book%20photography%20on%20white%20background&width=500&height=500&seq=atomic-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Atomic%20Habits%20book%20spine%20showing%20title%20and%20author%20name%2C%20professional%20book%20photography%20white%20background%20library%20setting&width=500&height=500&seq=atomic-spine&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Atomic%20Habits%20book%20open%20showing%20habit%20formation%20diagrams%20and%20illustrations%2C%20professional%20book%20photography%20white%20background&width=500&height=500&seq=atomic-inside&orientation=squarish',
      'https://readdy.ai/api/search-image?query=Atomic%20Habits%20book%20with%20notepad%20and%20pen%20for%20taking%20notes%2C%20professional%20lifestyle%20book%20photography%20white%20background&width=500&height=500&seq=atomic-notes&orientation=squarish'
    ],
    rating: 4.7,
    reviews: 1923,
    brand: 'Random House',
    description: 'The ultimate guide to building good habits and breaking bad ones. James Clear presents a proven system for getting 1% better every day through small changes that deliver remarkable results.',
    features: [
      'Proven system for habit formation',
      'Scientific approach to behavior change',
      'Practical strategies for daily improvement',
      'Real-world examples and case studies',
      '4-step process for building habits',
      'Techniques for breaking bad habits'
    ],
    specifications: {
      'Author': 'James Clear',
      'Publisher': 'Random House Business Books',
      'Language': 'English',
      'Pages': '320 pages',
      'Format': 'Paperback',
      'ISBN': '978-1847941831',
      'Publication Date': '2018',
      'Dimensions': '19.6 x 12.6 x 2.2 cm'
    },
    category: 'Books'
  },
  '12': {
    id: '12',
    name: 'The Alchemist: A Fable About Following Your Dream',
    price: 249,
    originalPrice: 329,
    images: [
      'https://readdy.ai/api/search-image?query=The%20Alchemist%20book%20cover%20with%20mystical%20and%20adventure%20theme%20design%2C%20bestselling%20fiction%20novel%20with%20desert%20and%20journey%20imagery%2C%20artistic%20book%20cover%20photography%20on%20clean%20white%20background&width=500&height=500&seq=alchemist-main&orientation=squarish',
      'https://readdy.ai/api/search-image?query=The%20Alchemist%20book%20with%20desert%20sand%20and%20compass%2C%20mystical%20journey%20theme%20professional%20book%20photography%20white%20background&width=500&height=500&seq=alchemist-theme&orientation=squarish',
      'https://readdy.ai/api/search-image?query=The%20Alchemist%20book%20open%20showing%20beautiful%20prose%20and%20storytelling%2C%20professional%20book%20photography%20white%20background&width=500&height=500&seq=alchemist-open&orientation=squarish',
      'https://readdy.ai/api/search-image?query=The%20Alchemist%20book%20collection%20showing%20multiple%20language%20editions%2C%20international%20bestseller%20professional%20photography%20white%20background&width=500&height=500&seq=alchemist-collection&orientation=squarish'
    ],
    rating: 4.8,
    reviews: 4521,
    brand: 'HarperCollins',
    description: 'A timeless tale of following your dreams. Paulo Coelho\'s masterpiece follows Santiago, a shepherd boy, on his journey to find a worldly treasure and discover his Personal Legend.',
    features: [
      'International bestseller translated into 80+ languages',
      'Inspiring story about following your dreams',
      'Philosophical insights about life and destiny',
      'Beautiful prose and storytelling',
      'Timeless wisdom about personal growth',
      'Perfect for readers of all ages'
    ],
    specifications: {
      'Author': 'Paulo Coelho',
      'Publisher': 'HarperCollins Publishers',
      'Language': 'English',
      'Pages': '163 pages',
      'Format': 'Paperback',
      'ISBN': '978-0007155668',
      'Publication Date': '1988 (English: 1993)',
      'Dimensions': '17.8 x 11.1 x 1.2 cm'
    },
    category: 'Books'
  }
};

const reviews: Review[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    rating: 5,
    comment: 'Excellent product! The quality is outstanding and performance exceeds expectations. Worth every penny.',
    date: '2024-01-15'
  },
  {
    id: '2',
    name: 'Priya Singh',
    rating: 4,
    comment: 'Great quality and build. Very satisfied with the purchase. Fast delivery and perfect packaging.',
    date: '2024-01-12'
  },
  {
    id: '3',
    name: 'Amit Sharma',
    rating: 5,
    comment: 'Amazing product with top-notch features. Fast delivery and perfect packaging. Highly recommended!',
    date: '2024-01-10'
  },
  {
    id: '4',
    name: 'Sneha Patel',
    rating: 4,
    comment: 'Very good quality and exactly as described. Great value for money. Will definitely buy again.',
    date: '2024-01-08'
  },
  {
    id: '5',
    name: 'Vikram Mehta',
    rating: 5,
    comment: 'Outstanding product! Exceeded my expectations in every way. Perfect for daily use.',
    date: '2024-01-05'
  }
];

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const product = products[productId] || products['1'];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`ri-star-${index < Math.floor(rating) ? 'fill' : 'line'} text-[#fdd835] text-lg w-5 h-5 flex items-center justify-center`}
      />
    ));
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    alert('Redirecting to checkout...');
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        category: product.category
      });
      setIsWishlisted(true);
      alert(`${product.name} added to your wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist. Please try again.');
    }
  };

  const handleSaveForLater = async () => {
    try {
      await saveForLater({
        id: product.id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        category: product.category
      });
      alert(`${product.name} saved for later!`);
    } catch (error) {
      console.error('Error saving for later:', error);
      alert('Failed to save for later. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    try {
      await addProductReview(product.id, reviewRating, reviewComment);
      setShowReviewForm(false);
      setReviewComment('');
      setReviewRating(5);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-2 text-sm mb-6 text-gray-600">
          <Link href="/" className="hover:text-[#2874f0] cursor-pointer">
            Home
          </Link>
          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
          <Link
            href={`/${product.category.toLowerCase()}`}
            className="hover:text-[#2874f0] cursor-pointer"
          >
            {product.category}
          </Link>
          <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center" />
          <span className="text-gray-800">{product.brand}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-6">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg object-top"
                />
              </div>
              <div className="flex space-x-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer ${
                      selectedImageIndex === index
                        ? 'border-[#2874f0]'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover object-top"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-2">{product.brand}</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex">{renderStars(product.rating)}</div>
                <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-green-600 font-medium">
                  {Math.round(
                    (1 - product.price / product.originalPrice) * 100
                  )}%{' '}
                  off
                </span>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <i className="ri-check-line text-green-500 mt-1 mr-2 w-4 h-4 flex items-center justify-center" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <i className="ri-subtract-line w-4 h-4 flex items-center justify-center" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <i className="ri-add-line w-4 h-4 flex items-center justify-center" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#fdd835] text-black py-3 rounded-md font-semibold hover:bg-yellow-400 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#2874f0] text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>

              <div className="flex space-x-3 mb-6">
                <button
                  onClick={handleAddToWishlist}
                  className={`flex-1 border rounded-md py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <i
                    className={`${isWishlisted ? 'ri-heart-fill' : 'ri-heart-line'} mr-2 w-4 h-4 flex items-center justify-center inline`}
                  />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
                <button
                  onClick={handleSaveForLater}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-bookmark-line mr-2 w-4 h-4 flex items-center justify-center inline" />
                  Save for Later
                </button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <i className="ri-truck-line mr-2 w-5 h-5 flex items-center justify-center" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-arrow-left-right-line mr-2 w-5 h-5 flex items-center justify-center" />
                    <span>7 Day Return</span>
                  </div>
                  <div className="flex items-center">
                    <i className="ri-shield-check-line mr-2 w-5 h-5 flex items-center justify-center" />
                    <span>Warranty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex space-x-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === 'description'
                    ? 'border-[#2874f0] text-[#2874f0]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === 'specifications'
                    ? 'border-[#2874f0] text-[#2874f0]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'border-[#2874f0] text-[#2874f0]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews
              </button>
            </div>

            <div className="py-8">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 mb-6">{product.description}</p>
                  <h3 className="font-semibold text-gray-800 mb-4">All Features:</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <i className="ri-check-line text-green-500 mt-1 mr-2 w-4 h-4 flex items-center justify-center" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 border-b border-gray-100"
                      >
                        <span className="font-medium text-gray-800">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Customer Reviews
                      </h3>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="bg-[#2874f0] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Write a Review
                      </button>
                    </div>

                    {showReviewForm && (
                      <div className="bg-gray-50 p-6 rounded-lg mb-6">
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Write Your Review
                        </h4>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                          </label>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setReviewRating(star)}
                                className="cursor-pointer"
                              >
                                <i
                                  className={`ri-star-${star <= reviewRating ? 'fill' : 'line'} text-2xl text-[#fdd835] w-6 h-6 flex items-center justify-center`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                          </label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2874f0] text-sm"
                            placeholder="Share your experience with this product..."
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSubmitReview}
                            className="bg-[#2874f0] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Submit Review
                          </button>
                          <button
                            onClick={() => setShowReviewForm(false)}
                            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 mb-6">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold text-gray-900 mr-2">
                          {product.rating}
                        </span>
                        <div className="flex">{renderStars(product.rating)}</div>
                      </div>
                      <span className="text-gray-600">
                        Based on {product.reviews} reviews
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#2874f0] rounded-full flex items-center justify-center text-white font-semibold">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">
                                {review.name}
                              </div>
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
