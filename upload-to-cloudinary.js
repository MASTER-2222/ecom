const { v2: cloudinary } = require('cloudinary');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dv0lg87ib',
  api_key: '195345735854272',
  api_secret: 'jigNQt700eFYsi7TSNB9ZJQJfGI'
});

// Comprehensive product data with high-quality source images
const productsToUpload = [
  // Electronics Category
  {
    folder: 'ritkart/electronics',
    images: [
      {
        name: 'samsung-galaxy-s24-ultra',
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['smartphone', 'samsung', 'android', 'electronics']
      },
      {
        name: 'iphone-15-pro-max',
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['smartphone', 'iphone', 'apple', 'electronics']
      },
      {
        name: 'sony-wh1000xm5',
        url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&q=80',
        tags: ['headphones', 'sony', 'audio', 'electronics']
      },
      {
        name: 'macbook-air-m2',
        url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1487&q=80',
        tags: ['laptop', 'macbook', 'apple', 'electronics']
      },
      {
        name: 'dell-xps-13',
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
        tags: ['laptop', 'dell', 'windows', 'electronics']
      },
      {
        name: 'lg-oled-tv-55',
        url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['television', 'lg', 'oled', 'electronics']
      },
      {
        name: 'canon-eos-r6',
        url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['camera', 'canon', 'photography', 'electronics']
      },
      {
        name: 'playstation-5',
        url: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1447&q=80',
        tags: ['gaming', 'playstation', 'sony', 'electronics']
      },
      {
        name: 'nintendo-switch-oled',
        url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['gaming', 'nintendo', 'portable', 'electronics']
      }
    ]
  },

  // Mobiles Category
  {
    folder: 'ritkart/mobiles',
    images: [
      {
        name: 'oneplus-12',
        url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
        tags: ['smartphone', 'oneplus', 'android', 'mobiles']
      },
      {
        name: 'google-pixel-8',
        url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1548&q=80',
        tags: ['smartphone', 'google', 'pixel', 'mobiles']
      },
      {
        name: 'xiaomi-14-ultra',
        url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1629&q=80',
        tags: ['smartphone', 'xiaomi', 'android', 'mobiles']
      }
    ]
  },

  // Fashion Category
  {
    folder: 'ritkart/fashion',
    images: [
      {
        name: 'levis-jeans-men',
        url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1626&q=80',
        tags: ['jeans', 'levis', 'men', 'fashion']
      },
      {
        name: 'womens-floral-dress',
        url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1583&q=80',
        tags: ['dress', 'floral', 'women', 'fashion']
      },
      {
        name: 'nike-air-max',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1612&q=80',
        tags: ['sneakers', 'nike', 'shoes', 'fashion']
      },
      {
        name: 'leather-handbag',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
        tags: ['handbag', 'leather', 'women', 'fashion']
      },
      {
        name: 'cotton-t-shirt',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
        tags: ['t-shirt', 'cotton', 'casual', 'fashion']
      }
    ]
  },

  // Home Category
  {
    folder: 'ritkart/home',
    images: [
      {
        name: 'sofa-set-3-seater',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1558&q=80',
        tags: ['sofa', 'furniture', 'living-room', 'home']
      },
      {
        name: 'dining-table-6-seater',
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['dining-table', 'furniture', 'dining-room', 'home']
      },
      {
        name: 'ceramic-dinner-set',
        url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['dinnerware', 'ceramic', 'kitchen', 'home']
      },
      {
        name: 'bed-sheet-set',
        url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['bed-sheets', 'bedroom', 'textile', 'home']
      }
    ]
  },

  // Books Category
  {
    folder: 'ritkart/books',
    images: [
      {
        name: 'programming-books',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
        tags: ['books', 'programming', 'education', 'technology']
      },
      {
        name: 'fiction-novels',
        url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
        tags: ['books', 'fiction', 'novels', 'literature']
      },
      {
        name: 'business-books',
        url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1586&q=80',
        tags: ['books', 'business', 'management', 'education']
      }
    ]
  },

  // Beauty Category
  {
    folder: 'ritkart/beauty',
    images: [
      {
        name: 'skincare-set',
        url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        tags: ['skincare', 'cosmetics', 'beauty', 'wellness']
      },
      {
        name: 'makeup-palette',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
        tags: ['makeup', 'palette', 'cosmetics', 'beauty']
      },
      {
        name: 'perfume-collection',
        url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1504&q=80',
        tags: ['perfume', 'fragrance', 'beauty', 'luxury']
      }
    ]
  }
];

// Upload function
async function uploadImageToCloudinary(imageData, folderPath) {
  try {
    console.log(`Uploading ${imageData.name} to ${folderPath}...`);
    
    const result = await cloudinary.uploader.upload(imageData.url, {
      public_id: imageData.name,
      folder: folderPath,
      tags: imageData.tags,
      overwrite: true,
      resource_type: 'image',
      format: 'auto',
      quality: 'auto',
      fetch_format: 'auto'
    });

    console.log(`✅ Successfully uploaded ${imageData.name}: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to upload ${imageData.name}:`, error.message);
    return null;
  }
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Starting RitKART Image Upload to Cloudinary...\n');
  
  const uploadResults = [];
  let successCount = 0;
  let failCount = 0;

  for (const category of productsToUpload) {
    console.log(`\n📁 Processing ${category.folder} category...`);
    
    for (const image of category.images) {
      const result = await uploadImageToCloudinary(image, category.folder);
      
      if (result) {
        uploadResults.push({
          category: category.folder,
          name: image.name,
          url: result.secure_url,
          public_id: result.public_id,
          tags: image.tags
        });
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Generate summary
  console.log('\n🎉 Upload Summary:');
  console.log(`✅ Successful uploads: ${successCount}`);
  console.log(`❌ Failed uploads: ${failCount}`);
  console.log(`📊 Total images: ${successCount + failCount}`);

  // Save results to file for reference
  const resultsData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: successCount + failCount,
      successful: successCount,
      failed: failCount
    },
    uploads: uploadResults
  };

  fs.writeFileSync('/app/cloudinary-upload-results.json', JSON.stringify(resultsData, null, 2));
  console.log('\n📄 Results saved to cloudinary-upload-results.json');
  
  return resultsData;
}

// Run the upload
if (require.main === module) {
  uploadAllImages()
    .then((results) => {
      console.log('\n🎯 RitKART Image Upload Completed!');
      console.log(`View your images at: https://cloudinary.com/console/c-dv0lg87ib/media_library`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Upload failed:', error);
      process.exit(1);
    });
}

module.exports = { uploadAllImages, uploadImageToCloudinary };