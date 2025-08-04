const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dv0lg87ib',
  api_key: process.env.CLOUDINARY_API_KEY || '195345735854272',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'jigNQt700eFYsi7TSNB9ZJQJfGI'
});

// Load current mapping
const mappingFile = path.join(__dirname, 'cloudinary-mapping.json');
let currentMapping = {};

if (fs.existsSync(mappingFile)) {
  try {
    currentMapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
  } catch (error) {
    console.error('Error reading mapping file:', error);
  }
}

// Duplicate detection criteria
const DUPLICATE_CRITERIA = {
  SAME_BYTE_SIZE: 72754, // All current images have this exact size
  SAME_DIMENSIONS: { width: 800, height: 800 },
  SAME_FORMAT: 'jpg'
};

async function analyzeCloudinaryImages() {
  console.log('🔍 Analyzing Cloudinary images for duplicates...\n');
  
  try {
    // Get all images from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'ritkart/',
      max_results: 500,
      resource_type: 'image'
    });

    const images = result.resources;
    console.log(`📊 Found ${images.length} images in Cloudinary\n`);

    // Analyze duplicates
    const duplicates = [];
    const uniqueImages = [];
    const sizeGroups = {};

    images.forEach(image => {
      const key = `${image.bytes}_${image.width}_${image.height}_${image.format}`;
      
      if (!sizeGroups[key]) {
        sizeGroups[key] = [];
      }
      sizeGroups[key].push(image);
    });

    // Identify duplicates
    Object.entries(sizeGroups).forEach(([key, group]) => {
      if (group.length > 1) {
        console.log(`🔄 Found ${group.length} images with identical properties:`);
        console.log(`   Size: ${group[0].bytes} bytes, Dimensions: ${group[0].width}x${group[0].height}, Format: ${group[0].format}`);
        group.forEach((img, index) => {
          console.log(`   ${index + 1}. ${img.public_id}`);
          if (index > 0) { // Keep first, mark others as duplicates
            duplicates.push(img);
          } else {
            uniqueImages.push(img);
          }
        });
        console.log('');
      } else {
        uniqueImages.push(group[0]);
      }
    });

    // Special check for the problematic 72754 byte images
    const problematicImages = images.filter(img => 
      img.bytes === DUPLICATE_CRITERIA.SAME_BYTE_SIZE &&
      img.width === DUPLICATE_CRITERIA.SAME_DIMENSIONS.width &&
      img.height === DUPLICATE_CRITERIA.SAME_DIMENSIONS.height &&
      img.format === DUPLICATE_CRITERIA.SAME_FORMAT
    );

    console.log(`🚨 DUPLICATE ANALYSIS RESULTS:`);
    console.log(`   Total images: ${images.length}`);
    console.log(`   Problematic duplicates (72754 bytes): ${problematicImages.length}`);
    console.log(`   Other duplicates: ${duplicates.length - problematicImages.length}`);
    console.log(`   Unique images: ${uniqueImages.length}`);
    console.log(`   Total duplicates to remove: ${duplicates.length}\n`);

    return {
      allImages: images,
      duplicates,
      uniqueImages,
      problematicImages
    };

  } catch (error) {
    console.error('❌ Error analyzing images:', error);
    throw error;
  }
}

async function cleanupDuplicates(duplicates, dryRun = true) {
  console.log(`🧹 ${dryRun ? 'DRY RUN - ' : ''}Cleaning up ${duplicates.length} duplicate images...\n`);

  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  for (const image of duplicates) {
    try {
      console.log(`${dryRun ? '🔍 Would delete:' : '🗑️  Deleting:'} ${image.public_id}`);
      
      if (!dryRun) {
        await cloudinary.uploader.destroy(image.public_id);
        results.success.push(image.public_id);
        console.log(`   ✅ Successfully deleted`);
      } else {
        results.skipped.push(image.public_id);
        console.log(`   ⏭️  Skipped (dry run)`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`   ❌ Failed to delete ${image.public_id}:`, error.message);
      results.failed.push({ public_id: image.public_id, error: error.message });
    }
  }

  console.log(`\n📊 CLEANUP RESULTS:`);
  console.log(`   Successfully deleted: ${results.success.length}`);
  console.log(`   Failed: ${results.failed.length}`);
  console.log(`   Skipped (dry run): ${results.skipped.length}\n`);

  return results;
}

async function uploadBetterImages() {
  console.log('📤 Uploading better quality product images...\n');

  const productImages = [
    {
      name: 'samsung-galaxy-s24-ultra',
      category: 'electronics',
      url: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-ultra-s928-sm-s928bztqins-thumb-539573257'
    },
    {
      name: 'iphone-15-pro-max',
      category: 'electronics', 
      url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select'
    },
    {
      name: 'macbook-air-m2',
      category: 'electronics',
      url: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606'
    }
    // Add more real product images as needed
  ];

  const uploadResults = [];

  for (const product of productImages) {
    try {
      console.log(`📤 Uploading ${product.name}...`);
      
      const result = await cloudinary.uploader.upload(product.url, {
        public_id: `ritkart/${product.category}/${product.name}`,
        folder: `ritkart/${product.category}`,
        overwrite: true,
        transformation: [
          { width: 800, height: 800, crop: 'fill', quality: 'auto' }
        ]
      });

      uploadResults.push({
        name: product.name,
        public_id: result.public_id,
        secure_url: result.secure_url,
        bytes: result.bytes,
        width: result.width,
        height: result.height
      });

      console.log(`   ✅ Successfully uploaded: ${result.secure_url}`);
      
    } catch (error) {
      console.error(`   ❌ Failed to upload ${product.name}:`, error.message);
      uploadResults.push({
        name: product.name,
        error: error.message
      });
    }
  }

  return uploadResults;
}

async function updateMappingFile(uniqueImages, newUploads = []) {
  console.log('📝 Updating mapping file...\n');

  const newMapping = {};

  // Add unique images
  uniqueImages.forEach(image => {
    const name = image.public_id.split('/').pop();
    const category = image.public_id.split('/')[1] || 'unknown';
    
    newMapping[name] = {
      public_id: image.public_id,
      secure_url: image.secure_url,
      width: image.width,
      height: image.height,
      format: image.format,
      bytes: image.bytes,
      category: category.charAt(0).toUpperCase() + category.slice(1),
      uploaded_at: new Date().toISOString()
    };
  });

  // Add new uploads
  newUploads.forEach(upload => {
    if (!upload.error) {
      newMapping[upload.name] = {
        public_id: upload.public_id,
        secure_url: upload.secure_url,
        width: upload.width,
        height: upload.height,
        format: 'jpg',
        bytes: upload.bytes,
        category: upload.public_id.split('/')[1]?.charAt(0).toUpperCase() + upload.public_id.split('/')[1]?.slice(1) || 'Unknown',
        uploaded_at: new Date().toISOString()
      };
    }
  });

  // Save updated mapping
  fs.writeFileSync(mappingFile, JSON.stringify(newMapping, null, 2));
  console.log(`✅ Updated mapping file with ${Object.keys(newMapping).length} images\n`);

  return newMapping;
}

async function main() {
  console.log('🚀 Starting Cloudinary Cleanup Process...\n');
  console.log('🎯 Objective: Remove duplicate placeholder images and replace with quality product images\n');

  try {
    // Step 1: Analyze current images
    const analysis = await analyzeCloudinaryImages();

    // Step 2: Dry run cleanup
    console.log('🔍 STEP 1: DRY RUN - Analyzing what would be deleted...\n');
    await cleanupDuplicates(analysis.problematicImages, true);

    // Ask for confirmation
    console.log('⚠️  WARNING: This will permanently delete duplicate images from Cloudinary!');
    console.log('💡 Recommendation: Backup important images before proceeding.\n');
    
    // For automated execution, set to false to actually delete
    const PERFORM_ACTUAL_CLEANUP = false; // Set to true when ready
    
    if (PERFORM_ACTUAL_CLEANUP) {
      // Step 3: Actual cleanup
      console.log('🗑️  STEP 2: ACTUAL CLEANUP - Deleting duplicates...\n');
      const cleanupResults = await cleanupDuplicates(analysis.problematicImages, false);

      // Step 4: Upload better images
      console.log('📤 STEP 3: Uploading better quality images...\n');
      const uploadResults = await uploadBetterImages();

      // Step 5: Update mapping
      console.log('📝 STEP 4: Updating mapping file...\n');
      await updateMappingFile(analysis.uniqueImages, uploadResults);

      console.log('🎉 CLEANUP COMPLETED SUCCESSFULLY!\n');
      console.log('📊 SUMMARY:');
      console.log(`   Duplicates removed: ${cleanupResults.success.length}`);
      console.log(`   New images uploaded: ${uploadResults.filter(r => !r.error).length}`);
      console.log(`   Total unique images: ${analysis.uniqueImages.length + uploadResults.filter(r => !r.error).length}`);
    } else {
      console.log('🔒 SAFETY MODE: No actual changes made.');
      console.log('💡 To perform actual cleanup, set PERFORM_ACTUAL_CLEANUP = true in the script.');
    }

  } catch (error) {
    console.error('❌ Cleanup process failed:', error);
    process.exit(1);
  }
}

// Run the cleanup
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  analyzeCloudinaryImages,
  cleanupDuplicates,
  uploadBetterImages,
  updateMappingFile
};
