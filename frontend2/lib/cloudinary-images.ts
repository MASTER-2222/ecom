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

// Product Images
export const productImages = {
  // Electronics
  'samsung-s24': getCloudinaryUrl('samsung-galaxy-s24-ultra', transformations.product_card),
  'iphone-15': getCloudinaryUrl('iphone-15-pro-max', transformations.product_card),
  'sony-headphones': getCloudinaryUrl('sony-wh1000xm5', transformations.product_card),
  'macbook-air': getCloudinaryUrl('macbook-air-m2', transformations.product_card),
  'dell-xps': getCloudinaryUrl('dell-xps-13', transformations.product_card),
  'lg-oled-tv': getCloudinaryUrl('lg-oled-tv-55', transformations.product_card),
  'canon-camera': getCloudinaryUrl('canon-eos-r6', transformations.product_card),
  'ps5-console': getCloudinaryUrl('playstation-5', transformations.product_card),
  'nintendo-switch': getCloudinaryUrl('nintendo-switch-oled', transformations.product_card),
  'oneplus-12': getCloudinaryUrl('oneplus-12', transformations.product_card),
  'pixel-8': getCloudinaryUrl('google-pixel-8', transformations.product_card),
  'xiaomi-14': getCloudinaryUrl('xiaomi-14-ultra', transformations.product_card),

  // Fashion
  'levis-jeans': getCloudinaryUrl('levis-jeans-men', transformations.product_card),
  'floral-dress': getCloudinaryUrl('womens-floral-dress', transformations.product_card),
  'nike-shoes': getCloudinaryUrl('nike-air-force-1', transformations.product_card),
  'cotton-tshirt': getCloudinaryUrl('mens-cotton-tshirt', transformations.product_card),
  'denim-jacket': getCloudinaryUrl('womens-denim-jacket', transformations.product_card),
  'adidas-shoes': getCloudinaryUrl('adidas-ultraboost', transformations.product_card),
  'polo-shirt': getCloudinaryUrl('tommy-polo-shirt', transformations.product_card),
  'track-pants': getCloudinaryUrl('puma-track-pants', transformations.product_card),

  // Home & Kitchen
  'wooden-bed': getCloudinaryUrl('wooden-bed-frame', transformations.product_card),
  'navy-sofa': getCloudinaryUrl('navy-fabric-sofa', transformations.product_card),
  'study-desk': getCloudinaryUrl('wooden-study-desk', transformations.product_card),
  'dining-set': getCloudinaryUrl('dining-table-set', transformations.product_card),
  'kitchen-cabinet': getCloudinaryUrl('kitchen-cabinet-white', transformations.product_card),
  'memory-mattress': getCloudinaryUrl('memory-foam-mattress', transformations.product_card),
  'wooden-wardrobe': getCloudinaryUrl('wooden-wardrobe', transformations.product_card),
  'ceiling-light': getCloudinaryUrl('led-ceiling-light', transformations.product_card),

  // Appliances
  'lg-refrigerator': getCloudinaryUrl('lg-double-door-fridge', transformations.product_card),
  'washing-machine': getCloudinaryUrl('front-load-washer', transformations.product_card),
  'split-ac': getCloudinaryUrl('split-air-conditioner', transformations.product_card),
  'microwave-oven': getCloudinaryUrl('convection-microwave', transformations.product_card),
  'induction-cooktop': getCloudinaryUrl('induction-cooktop', transformations.product_card),
  'top-load-washer': getCloudinaryUrl('top-load-washer', transformations.product_card),
  'window-ac': getCloudinaryUrl('window-air-conditioner', transformations.product_card),
};

// Category Images
export const categoryImages = {
  electronics: getCloudinaryUrl('category-electronics', transformations.category_icon),
  fashion: getCloudinaryUrl('category-fashion', transformations.category_icon),
  home: getCloudinaryUrl('category-home-kitchen', transformations.category_icon),
  appliances: getCloudinaryUrl('category-appliances', transformations.category_icon),
  mobiles: getCloudinaryUrl('category-mobiles', transformations.category_icon),
  books: getCloudinaryUrl('category-books', transformations.category_icon),
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
  placeholderImages,
  getProductImage,
  getCloudinaryUrl,
  transformations,
};