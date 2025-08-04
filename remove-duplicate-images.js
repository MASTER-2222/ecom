const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dv0lg87ib',
  api_key: '195345735854272',
  api_secret: 'jigNQt700eFYsi7TSNB9ZJQJfGI'
});

// The problematic duplicate image characteristics
const DUPLICATE_SIGNATURE = {
  bytes: 72754,
  width: 800,
  height: 800,
  format: 'jpg'
};

async function identifyDuplicateImages() {
  console.log('🔍 Scanning Cloudinary for duplicate images...\n');
  
  try {
    // Get all images from ritkart folder
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'ritkart/',
      max_results: 500,
      resource_type: 'image'
    });

    const allImages = result.resources;
    console.log(`📊 Found ${allImages.length} total images in ritkart folder\n`);

    // Identify exact duplicates (same byte size, dimensions, format)
    const duplicates = allImages.filter(image => 
      image.bytes === DUPLICATE_SIGNATURE.bytes &&
      image.width === DUPLICATE_SIGNATURE.width &&
      image.height === DUPLICATE_SIGNATURE.height &&
      image.format === DUPLICATE_SIGNATURE.format
    );

    console.log(`🚨 DUPLICATE DETECTION RESULTS:`);
    console.log(`   Total images: ${allImages.length}`);
    console.log(`   Duplicate placeholder images: ${duplicates.length}`);
    console.log(`   Unique/different images: ${allImages.length - duplicates.length}\n`);

    if (duplicates.length > 0) {
      console.log('🔍 Duplicate images found:');
      duplicates.forEach((img, index) => {
        console.log(`   ${index + 1}. ${img.public_id} (${img.bytes} bytes)`);
      });
      console.log('');
    }

    return {
      allImages,
      duplicates,
      uniqueImages: allImages.filter(img => !duplicates.includes(img))
    };

  } catch (error) {
    console.error('❌ Error scanning images:', error);
    throw error;
  }
}

async function removeDuplicateImages(duplicates, dryRun = true) {
  console.log(`🧹 ${dryRun ? '[DRY RUN] ' : ''}Removing ${duplicates.length} duplicate images...\n`);

  const results = {
    deleted: [],
    failed: [],
    skipped: []
  };

  for (let i = 0; i < duplicates.length; i++) {
    const image = duplicates[i];
    
    try {
      console.log(`${dryRun ? '🔍 Would delete' : '🗑️  Deleting'} (${i + 1}/${duplicates.length}): ${image.public_id}`);
      
      if (!dryRun) {
        await cloudinary.uploader.destroy(image.public_id);
        results.deleted.push(image.public_id);
        console.log(`   ✅ Successfully deleted`);
      } else {
        results.skipped.push(image.public_id);
        console.log(`   ⏭️  Skipped (dry run mode)`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`   ❌ Failed to delete ${image.public_id}:`, error.message);
      results.failed.push({
        public_id: image.public_id,
        error: error.message
      });
    }
  }

  console.log(`\n📊 REMOVAL RESULTS:`);
  console.log(`   Successfully deleted: ${results.deleted.length}`);
  console.log(`   Failed deletions: ${results.failed.length}`);
  console.log(`   Skipped (dry run): ${results.skipped.length}\n`);

  if (results.failed.length > 0) {
    console.log('❌ Failed deletions:');
    results.failed.forEach(fail => {
      console.log(`   - ${fail.public_id}: ${fail.error}`);
    });
    console.log('');
  }

  return results;
}

async function updateProductImageMapping(remainingImages) {
  console.log('📝 Updating cloudinary-mapping.json...\n');

  const newMapping = {};

  remainingImages.forEach(image => {
    // Extract product name from public_id
    const pathParts = image.public_id.split('/');
    const productName = pathParts[pathParts.length - 1];
    const category = pathParts[1] || 'unknown';

    newMapping[productName] = {
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

  // Save the updated mapping
  const mappingFile = './cloudinary-mapping.json';
  fs.writeFileSync(mappingFile, JSON.stringify(newMapping, null, 2));
  
  console.log(`✅ Updated mapping file with ${Object.keys(newMapping).length} remaining images\n`);
  
  return newMapping;
}

async function generateCleanupReport(beforeCount, afterCount, deletedCount) {
  const report = {
    timestamp: new Date().toISOString(),
    cleanup_summary: {
      images_before: beforeCount,
      images_after: afterCount,
      duplicates_removed: deletedCount,
      storage_saved: `${(deletedCount * DUPLICATE_SIGNATURE.bytes / 1024 / 1024).toFixed(2)} MB`
    },
    duplicate_criteria: DUPLICATE_SIGNATURE,
    recommendations: [
      'Upload unique, high-quality product images',
      'Use different dimensions/sizes for variety',
      'Implement image optimization in your upload process',
      'Regular cleanup to prevent future duplicates'
    ]
  };

  fs.writeFileSync('./cloudinary-cleanup-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Cleanup report saved to cloudinary-cleanup-report.json\n');
  
  return report;
}

async function main() {
  console.log('🚀 RitKART Cloudinary Duplicate Image Cleanup\n');
  console.log('🎯 Target: Remove all duplicate placeholder images (72754 bytes, 800x800, jpg)\n');

  try {
    // Step 1: Identify duplicates
    const analysis = await identifyDuplicateImages();

    if (analysis.duplicates.length === 0) {
      console.log('🎉 No duplicate images found! Your Cloudinary is clean.\n');
      return;
    }

    // Step 2: Dry run first (safety check)
    console.log('🔍 STEP 1: DRY RUN - Preview what will be deleted\n');
    await removeDuplicateImages(analysis.duplicates, true);

    // Step 3: Ask for confirmation
    console.log('⚠️  IMPORTANT SAFETY NOTICE:');
    console.log('   This will PERMANENTLY DELETE duplicate images from Cloudinary!');
    console.log('   Make sure you have backups if needed.\n');
    
    // For safety, set this to true only when you're ready to proceed
    const PROCEED_WITH_CLEANUP = false; // Change to true when ready
    
    if (PROCEED_WITH_CLEANUP) {
      console.log('🗑️  STEP 2: ACTUAL CLEANUP - Deleting duplicates...\n');
      
      // Perform actual cleanup
      const cleanupResults = await removeDuplicateImages(analysis.duplicates, false);
      
      // Update mapping file
      await updateProductImageMapping(analysis.uniqueImages);
      
      // Generate report
      await generateCleanupReport(
        analysis.allImages.length,
        analysis.uniqueImages.length,
        cleanupResults.deleted.length
      );

      console.log('🎉 CLEANUP COMPLETED SUCCESSFULLY!\n');
      console.log('📊 FINAL SUMMARY:');
      console.log(`   Original images: ${analysis.allImages.length}`);
      console.log(`   Duplicates removed: ${cleanupResults.deleted.length}`);
      console.log(`   Remaining unique images: ${analysis.uniqueImages.length}`);
      console.log(`   Storage saved: ${(cleanupResults.deleted.length * DUPLICATE_SIGNATURE.bytes / 1024 / 1024).toFixed(2)} MB\n`);
      
      console.log('✅ Next steps:');
      console.log('   1. Upload unique, high-quality product images');
      console.log('   2. Update your product database with new image URLs');
      console.log('   3. Test your frontend to ensure images display correctly\n');
      
    } else {
      console.log('🔒 SAFETY MODE ACTIVE - No changes made to Cloudinary');
      console.log('💡 To proceed with cleanup:');
      console.log('   1. Review the dry run results above');
      console.log('   2. Set PROCEED_WITH_CLEANUP = true in this script');
      console.log('   3. Run the script again\n');
    }

  } catch (error) {
    console.error('❌ Cleanup process failed:', error);
    process.exit(1);
  }
}

// Execute the cleanup
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  identifyDuplicateImages,
  removeDuplicateImages,
  updateProductImageMapping
};
