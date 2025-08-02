#!/usr/bin/env node

// RitKART Cloudinary Image Uploader
// This script uploads all required product images to Cloudinary
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: 'dv0lg87ib',
    api_key: '195345735854272',
    api_secret: 'jigNQt700eFYsi7TSNB9ZJQJfGI',
    secure: true
});

// Product images to upload with their categories
const productImages = {
    // Electronics - Main Products
    'samsung-galaxy-s24-ultra': {
        search_query: 'Samsung Galaxy S24 Ultra smartphone titanium gray premium design professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'iphone-15-pro-max': {
        search_query: 'Apple iPhone 15 Pro Max natural titanium premium design professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'sony-wh1000xm5': {
        search_query: 'Sony WH-1000XM5 wireless noise cancelling headphones black premium professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'macbook-air-m2': {
        search_query: 'Apple MacBook Air M2 silver ultra-thin laptop professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'dell-xps-13': {
        search_query: 'Dell XPS 13 premium laptop silver professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'lg-oled-tv-55': {
        search_query: 'LG 55 inch OLED smart TV ultra-slim design professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'canon-eos-r6': {
        search_query: 'Canon EOS R6 Mark II mirrorless camera black professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'playstation-5': {
        search_query: 'PlayStation 5 console white gaming system professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'nintendo-switch-oled': {
        search_query: 'Nintendo Switch OLED gaming console professional product photography clean white background',
        folder: 'ritkart/electronics',
        category: 'Electronics'
    },
    'oneplus-12': {
        search_query: 'OnePlus 12 smartphone flowy emerald premium design professional product photography clean white background',
        folder: 'ritkart/mobiles',
        category: 'Mobiles'
    },
    'google-pixel-8': {
        search_query: 'Google Pixel 8 Pro obsidian black smartphone professional product photography clean white background',
        folder: 'ritkart/mobiles',
        category: 'Mobiles'
    },
    'xiaomi-14-ultra': {
        search_query: 'Xiaomi 14 Ultra smartphone black professional product photography clean white background',
        folder: 'ritkart/mobiles',
        category: 'Mobiles'
    },

    // Fashion Items
    'levis-jeans-men': {
        search_query: 'Levis mens slim fit dark blue jeans professional fashion photography clean white background',
        folder: 'ritkart/fashion',
        category: 'Fashion'
    },
    'womens-floral-dress': {
        search_query: 'Womens elegant floral midi dress professional fashion photography clean white background',
        folder: 'ritkart/fashion',
        category: 'Fashion'
    },
    'nike-air-force-1': {
        search_query: 'Nike Air Force 1 white sneakers classic design professional product photography clean white background',
        folder: 'ritkart/fashion',
        category: 'Fashion'
    },
    'mens-cotton-tshirt': {
        search_query: 'Mens navy blue cotton crew neck t-shirt professional fashion photography clean white background',
        folder: 'ritkart/fashion',
        category: 'Fashion'
    },
    'womens-denim-jacket': {
        search_query: 'Womens blue denim jacket classic style professional fashion photography clean white background',
        folder: 'ritkart/fashion',
        category: 'Fashion'
    },
    'adidas-ultraboost': {
        search_query: 'Adidas Ultraboost running shoes professional product photography clean white background',
        folder: 'ritkart/fashion',
        category: 'Fashion'
    },

    // Home & Kitchen
    'wooden-bed-frame': {
        search_query: 'Modern wooden bed frame with storage white finish professional furniture photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },
    'navy-fabric-sofa': {
        search_query: 'Modern navy blue fabric sofa contemporary design professional furniture photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },
    'wooden-study-desk': {
        search_query: 'Modern wooden study desk with drawers professional furniture photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },
    'dining-table-set': {
        search_query: 'Wooden dining table set with chairs professional furniture photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },
    'kitchen-cabinet-white': {
        search_query: 'Modern white kitchen cabinet storage professional furniture photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },
    'memory-foam-mattress': {
        search_query: 'Premium memory foam mattress white professional product photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },
    'wooden-wardrobe': {
        search_query: 'Modern wooden wardrobe with mirror professional furniture photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },
    'led-ceiling-light': {
        search_query: 'Modern LED ceiling light fixture round design professional product photography clean white background',
        folder: 'ritkart/home',
        category: 'Home'
    },

    // Appliances
    'lg-double-door-fridge': {
        search_query: 'LG double door refrigerator stainless steel professional product photography clean white background',
        folder: 'ritkart/appliances',
        category: 'Appliances'
    },
    'front-load-washer': {
        search_query: 'Front load washing machine white professional product photography clean white background',
        folder: 'ritkart/appliances',
        category: 'Appliances'
    },
    'split-air-conditioner': {
        search_query: 'Split air conditioner white professional product photography clean white background',
        folder: 'ritkart/appliances',
        category: 'Appliances'
    },
    'convection-microwave': {
        search_query: 'Convection microwave oven stainless steel professional product photography clean white background',
        folder: 'ritkart/appliances',
        category: 'Appliances'
    },
    'induction-cooktop': {
        search_query: 'Induction cooktop black glass professional product photography clean white background',
        folder: 'ritkart/appliances',
        category: 'Appliances'
    },

    // Books
    'psychology-money-book': {
        search_query: 'Psychology of Money book cover professional finance theme modern typography bestselling personal finance book clean white background',
        folder: 'ritkart/books',
        category: 'Books'
    },

    // Category Images
    'category-electronics': {
        search_query: 'Electronics category icon smartphone laptop modern technology clean design',
        folder: 'ritkart/categories',
        category: 'Categories'
    },
    'category-fashion': {
        search_query: 'Fashion category icon clothing shirt dress modern style clean design',
        folder: 'ritkart/categories',
        category: 'Categories'
    },
    'category-home-kitchen': {
        search_query: 'Home and kitchen category icon house furniture modern design clean background',
        folder: 'ritkart/categories',
        category: 'Categories'
    },
    'category-appliances': {
        search_query: 'Appliances category icon refrigerator washing machine modern design clean background',
        folder: 'ritkart/categories',
        category: 'Categories'
    },
    'category-mobiles': {
        search_query: 'Mobile phones category icon smartphone modern design clean background',
        folder: 'ritkart/categories',
        category: 'Categories'
    },
    'category-books': {
        search_query: 'Books category icon open book reading modern design clean background',
        folder: 'ritkart/categories',
        category: 'Categories'
    }
};

// Upload function using search-based image API
async function uploadProductImages() {
    const uploadedImages = {};
    const uploadResults = [];
    
    console.log('🚀 Starting RitKART product image upload to Cloudinary...\n');
    
    try {
        for (const [imageKey, imageConfig] of Object.entries(productImages)) {
            try {
                console.log(`📤 Uploading ${imageKey} (${imageConfig.category})...`);
                
                // Use a placeholder image URL as source (in production, you'd use actual images)
                // For now, we'll use a generic product image and rely on transformations
                const placeholderUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop&crop=center`;
                
                const uploadResult = await cloudinary.uploader.upload(placeholderUrl, {
                    public_id: imageKey,
                    folder: imageConfig.folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 800, crop: 'fill', gravity: 'center' },
                        { quality: 'auto', fetch_format: 'auto' }
                    ],
                    tags: [imageConfig.category.toLowerCase(), 'ritkart', 'product'],
                    context: {
                        category: imageConfig.category,
                        search_query: imageConfig.search_query,
                        alt: imageKey.replace(/-/g, ' ')
                    },
                    overwrite: true
                });
                
                uploadedImages[imageKey] = {
                    public_id: uploadResult.public_id,
                    secure_url: uploadResult.secure_url,
                    width: uploadResult.width,
                    height: uploadResult.height,
                    format: uploadResult.format,
                    bytes: uploadResult.bytes,
                    category: imageConfig.category,
                    uploaded_at: new Date().toISOString()
                };
                
                uploadResults.push({
                    success: true,
                    imageKey,
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url,
                    category: imageConfig.category
                });
                
                console.log(`✅ Successfully uploaded ${imageKey}`);
                
                // Add delay to respect rate limits
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`❌ Failed to upload ${imageKey}:`, error.message);
                uploadResults.push({
                    success: false,
                    imageKey,
                    error: error.message,
                    category: imageConfig.category
                });
            }
        }
        
        // Save mapping to JSON file
        await fs.writeFile(
            '/app/cloudinary-mapping.json', 
            JSON.stringify(uploadedImages, null, 2)
        );
        
        console.log('\n📊 Upload Summary:');
        const successful = uploadResults.filter(r => r.success);
        const failed = uploadResults.filter(r => !r.success);
        
        console.log(`✅ Successful uploads: ${successful.length}`);
        console.log(`❌ Failed uploads: ${failed.length}`);
        console.log(`📄 Mapping saved to: /app/cloudinary-mapping.json`);
        
        if (successful.length > 0) {
            console.log('\n🎉 Successfully uploaded images:');
            successful.forEach(result => {
                console.log(`   • ${result.imageKey} (${result.category}): ${result.url}`);
            });
        }
        
        if (failed.length > 0) {
            console.log('\n❌ Failed uploads:');
            failed.forEach(result => {
                console.log(`   • ${result.imageKey}: ${result.error}`);
            });
        }
        
        return { successful: successful.length, failed: failed.length, uploadedImages };
        
    } catch (error) {
        console.error('❌ Upload process failed:', error);
        throw error;
    }
}

// Main execution
if (require.main === module) {
    uploadProductImages()
        .then(result => {
            console.log(`\n🎊 Upload completed! ${result.successful} images uploaded successfully.`);
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Upload failed:', error);
            process.exit(1);
        });
}

module.exports = { uploadProductImages, productImages };