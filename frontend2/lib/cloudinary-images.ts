// RitKART Cloudinary Image URLs
// Optimized and uploaded to Cloudinary: dv0lg87ib

export const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dv0lg87ib/image/upload';

// Cloudinary transformation presets
export const transformations = {
  product_thumb: 'w_300,h_300,c_fill,f_auto,q_auto',
  product_card: 'w_250,h_250,c_fill,f_auto,q_auto',
  product_detail: 'w_500,h_500,c_fill,f_auto,q_auto',
  category_icon: 'w_120,h_120,c_fill,f_auto,q_auto',
  hero_banner: 'w_1200,h_400,c_fill,f_auto,q_auto',
};

// Helper function to generate Cloudinary URL
export const getCloudinaryUrl = (publicId: string, transformation: string = 'w_300,h_300,c_fill,f_auto,q_auto') => {
  return `${CLOUDINARY_BASE_URL}/${transformation}/ritkart/${publicId}`;
};

// Product Images - Updated with actual Cloudinary URLs
export const productImages = {
  // Electronics - Main Products
  'samsung-s24': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/samsung-galaxy-s24-ultra',
  'samsung-s24-ultra': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/samsung-galaxy-s24-ultra',
  'iphone-15': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/iphone-15-pro-max',
  'iphone-15-pro-max': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/iphone-15-pro-max',
  'sony-headphones': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/sony-wh1000xm5',
  'sony-wh1000xm5': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/sony-wh1000xm5',
  'macbook-air': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/macbook-air-m2',
  'macbook-air-m2': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/macbook-air-m2',
  'dell-xps': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/dell-xps-13',
  'dell-xps-13': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/dell-xps-13',
  'lg-oled-tv': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/lg-oled-tv-55',
  'lg-oled-tv-55': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/lg-oled-tv-55',
  'canon-camera': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/canon-eos-r6',
  'canon-eos-r6': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/canon-eos-r6',
  'ps5-console': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/playstation-5',
  'playstation-5': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/playstation-5',
  'nintendo-switch': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/nintendo-switch-oled',
  'nintendo-switch-oled': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/electronics/nintendo-switch-oled',
  'oneplus-12': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/mobiles/oneplus-12',
  'pixel-8': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/mobiles/google-pixel-8',
  'google-pixel-8': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/mobiles/google-pixel-8',
  'xiaomi-14': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/mobiles/xiaomi-14-ultra',
  'xiaomi-14-ultra': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/mobiles/xiaomi-14-ultra',

  // Fashion
  'levis-jeans': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/levis-jeans-men',
  'levis-jeans-men': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/levis-jeans-men',
  'floral-dress': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/womens-floral-dress',
  'womens-floral-dress': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/womens-floral-dress',
  'nike-shoes': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/nike-air-force-1',
  'nike-air-force-1': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/nike-air-force-1',
  'cotton-tshirt': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/mens-cotton-tshirt',
  'mens-cotton-tshirt': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/mens-cotton-tshirt',
  'denim-jacket': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/womens-denim-jacket',
  'womens-denim-jacket': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/womens-denim-jacket',
  'adidas-shoes': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/adidas-ultraboost',
  'adidas-ultraboost': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/fashion/adidas-ultraboost',

  // Home & Kitchen
  'wooden-bed': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/wooden-bed-frame',
  'wooden-bed-frame': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/wooden-bed-frame',
  'navy-sofa': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/navy-fabric-sofa',
  'navy-fabric-sofa': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/navy-fabric-sofa',
  'study-desk': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/wooden-study-desk',
  'wooden-study-desk': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/wooden-study-desk',
  'dining-set': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/dining-table-set',
  'dining-table-set': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/dining-table-set',
  'kitchen-cabinet': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/kitchen-cabinet-white',
  'kitchen-cabinet-white': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/kitchen-cabinet-white',
  'memory-mattress': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/memory-foam-mattress',
  'memory-foam-mattress': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/memory-foam-mattress',
  'wooden-wardrobe': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/wooden-wardrobe',
  'ceiling-light': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/led-ceiling-light',
  'led-ceiling-light': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/led-ceiling-light',
  'ikea-bed': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/home/wooden-bed-frame',

  // Appliances
  'lg-refrigerator': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/lg-double-door-fridge',
  'lg-double-door-fridge': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/lg-double-door-fridge',
  'washing-machine': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/front-load-washer',
  'front-load-washer': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/front-load-washer',
  'split-ac': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/split-air-conditioner',
  'split-air-conditioner': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/split-air-conditioner',
  'microwave-oven': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/convection-microwave',
  'convection-microwave': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/convection-microwave',
  'induction-cooktop': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/appliances/induction-cooktop',

  // Books
  'psychology-money': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/books/psychology-money-book',
  'psychology-money-book': 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_250,h_250,c_fill,f_auto,q_auto/ritkart/books/psychology-money-book',
};

// Category Images - Updated with actual Cloudinary URLs
export const categoryImages = {
  electronics: 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_120,h_120,c_fill,f_auto,q_auto/ritkart/categories/category-electronics',
  fashion: 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_120,h_120,c_fill,f_auto,q_auto/ritkart/categories/category-fashion',
  home: 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_120,h_120,c_fill,f_auto,q_auto/ritkart/categories/category-home-kitchen',
  appliances: 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_120,h_120,c_fill,f_auto,q_auto/ritkart/categories/category-appliances',
  mobiles: 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_120,h_120,c_fill,f_auto,q_auto/ritkart/categories/category-mobiles',
  books: 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_120,h_120,c_fill,f_auto,q_auto/ritkart/categories/category-books',
};

// Hero Banner Images
export const bannerImages = {
  electronics: getCloudinaryUrl('electronics-banner', transformations.hero_banner),
  fashion: getCloudinaryUrl('fashion-banner', transformations.hero_banner),
  mobiles: getCloudinaryUrl('mobiles-banner', transformations.hero_banner),
};

// Payment and Footer Images
export const footerImages = {
  payment: getCloudinaryUrl('payment-icons', 'w_200,h_60,c_fit,f_auto,q_auto'),
};

// Placeholder images for when we need generic product images
export const placeholderImages = {
  product: getCloudinaryUrl('placeholder-product', transformations.product_card),
  category: getCloudinaryUrl('placeholder-category', transformations.category_icon),
  user: getCloudinaryUrl('placeholder-user', 'w_100,h_100,c_fill,f_auto,q_auto'),
};

// Fallback to Unsplash if Cloudinary image is not available
export const getProductImage = (productId: string, fallbackCategory: string = 'product') => {
  const cloudinaryImage = productImages[productId as keyof typeof productImages];
  if (cloudinaryImage) {
    return cloudinaryImage;
  }
  
  // Fallback to Unsplash with category-based images
  const unsplashUrls = {
    electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop',
    fashion: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
    home: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
    appliances: 'https://images.unsplash.com/photo-1556909114-5ba5c0e48b9b?w=300&h=300&fit=crop',
    mobiles: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    books: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    product: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop',
  };

  return unsplashUrls[fallbackCategory as keyof typeof unsplashUrls] || unsplashUrls.product;
};

export default {
  productImages,
  categoryImages,
  bannerImages,
  footerImages,
  placeholderImages,
  getProductImage,
  getCloudinaryUrl,
  transformations,
};