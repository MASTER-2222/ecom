// RitKART Cloudinary Migration Script
// This script migrates all readdy.ai images to Cloudinary

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dv0lg87ib',
  api_key: '195345735854272',
  api_secret: 'jigNQt700eFYsi7TSNB9ZJQJfGI'
});

// Image mapping object to store migrated images
const imageMapping = {};

// Categories and their representative images
const imageDatabase = {
  // Electronics
  'samsung-s24': 'https://readdy.ai/api/search-image?query=premium%20Samsung%20Galaxy%20smartphone%20titanium%20gray%20color%20sleek%20modern%20design%20high%20quality%20product%20photography%20on%20clean%20white%20background%20professional%20ecommerce%20style&width=300&height=300&seq=samsung-s24&orientation=squarish',
  'iphone-15': 'https://readdy.ai/api/search-image?query=Apple%20iPhone%2015%20Pro%20Max%20natural%20titanium%20finish%20premium%20smartphone%20elegant%20design%20professional%20product%20photography%20clean%20white%20background%20high%20end%20mobile&width=300&height=300&seq=iphone-15&orientation=squarish',
  'sony-headphones': 'https://readdy.ai/api/search-image?query=Sony%20premium%20wireless%20headphones%20noise%20cancelling%20black%20sleek%20design%20professional%20audio%20equipment%20clean%20white%20background%20high%20quality%20product%20photography&width=300&height=300&seq=sony-headphones&orientation=squarish',
  'macbook-air': 'https://readdy.ai/api/search-image?query=Apple%20MacBook%20Air%20M2%20silver%20laptop%20sleek%20thin%20design%20premium%20computing%20device%20clean%20white%20background%20professional%20product%20photography%20modern%20notebook&width=300&height=300&seq=macbook-air&orientation=squarish',
  'dell-xps': 'https://readdy.ai/api/search-image?query=Dell%20XPS%20premium%20laptop%20sleek%20black%20design%20modern%20ultrabook%20professional%20computing%20device%20clean%20white%20background%20high%20quality%20product%20photography&width=300&height=300&seq=dell-xps&orientation=squarish',
  'lg-oled-tv': 'https://readdy.ai/api/search-image?query=premium%20LG%20OLED%20smart%20TV%2055%20inch%204K%20ultra%20HD%20sleek%20modern%20television%20black%20frame%20clean%20white%20background%20professional%20electronics%20product%20photography&width=300&height=300&seq=lg-oled-tv&orientation=squarish',
  'canon-camera': 'https://readdy.ai/api/search-image?query=Canon%20EOS%20professional%20mirrorless%20camera%20black%20body%20premium%20photography%20equipment%20clean%20white%20background%20high%20quality%20product%20photography%20DSLR%20style&width=300&height=300&seq=canon-camera&orientation=squarish',
  'ps5-console': 'https://readdy.ai/api/search-image?query=PlayStation%205%20console%20white%20and%20black%20design%20gaming%20system%20with%20wireless%20controller%20modern%20gaming%20setup%20clean%20white%20background%20professional%20product%20photography&width=300&height=300&seq=ps5-console&orientation=squarish',
  'nintendo-switch': 'https://readdy.ai/api/search-image?query=Nintendo%20Switch%20OLED%20handheld%20gaming%20console%20colorful%20screen%20portable%20gaming%20device%20clean%20white%20background%20professional%20product%20photography%20modern%20gaming&width=300&height=300&seq=nintendo-switch&orientation=squarish',
  'oneplus-12': 'https://readdy.ai/api/search-image?query=OnePlus%20flagship%20smartphone%20emerald%20green%20color%20premium%20mobile%20phone%20sleek%20design%20clean%20white%20background%20professional%20product%20photography%20modern%20android&width=300&height=300&seq=oneplus-12&orientation=squarish',
  'pixel-8': 'https://readdy.ai/api/search-image?query=Google%20Pixel%20smartphone%20obsidian%20black%20premium%20mobile%20phone%20clean%20minimalist%20design%20white%20background%20professional%20product%20photography%20android%20flagship&width=300&height=300&seq=pixel-8&orientation=squarish',
  'xiaomi-14': 'https://readdy.ai/api/search-image?query=Xiaomi%20flagship%20smartphone%20white%20color%20premium%20mobile%20phone%20modern%20design%20camera%20setup%20clean%20white%20background%20professional%20product%20photography&width=300&height=300&seq=xiaomi-14&orientation=squarish',

  // Categories
  'cat-electronics': 'https://readdy.ai/api/search-image?query=electronics%20category%20icon%20with%20laptop%20smartphone%20headphones%20modern%20tech%20gadgets%20blue%20background%20clean%20minimalist%20design%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-electronics&orientation=squarish',
  'cat-fashion': 'https://readdy.ai/api/search-image?query=fashion%20category%20icon%20with%20stylish%20clothing%20accessories%20shoes%20modern%20apparel%20design%20colorful%20background%20clean%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-fashion&orientation=squarish',
  'cat-home': 'https://readdy.ai/api/search-image?query=home%20kitchen%20category%20icon%20with%20appliances%20furniture%20cooking%20utensils%20modern%20household%20items%20warm%20background%20clean%20minimalist%20ecommerce%20illustration&width=120&height=120&seq=cat-home&orientation=squarish',
  'cat-appliances': 'https://readdy.ai/api/search-image?query=appliances%20category%20icon%20with%20refrigerator%20washing%20machine%20microwave%20modern%20home%20appliances%20clean%20background%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-appliances&orientation=squarish',
  'cat-mobiles': 'https://readdy.ai/api/search-image?query=mobile%20phones%20category%20icon%20with%20smartphones%20accessories%20modern%20mobile%20devices%20tech%20background%20clean%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-mobiles&orientation=squarish',
  'cat-books': 'https://readdy.ai/api/search-image?query=books%20category%20icon%20with%20stack%20of%20books%20reading%20education%20literature%20warm%20background%20clean%20minimalist%20ecommerce%20category%20illustration&width=120&height=120&seq=cat-books&orientation=squarish'
};

// Function to upload image to Cloudinary
async function uploadToCloudinary(imageUrl, filename) {
  try {
    console.log(`Uploading ${filename}...`);
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: `ritkart/${filename}`,
      folder: 'ritkart',
      quality: 'auto',
      format: 'auto'
    });
    console.log(`✅ Uploaded ${filename}: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

// Main migration function
async function migrateImages() {
  console.log('🚀 Starting Cloudinary Migration...\n');

  for (const [filename, imageUrl] of Object.entries(imageDatabase)) {
    const cloudinaryUrl = await uploadToCloudinary(imageUrl, filename);
    if (cloudinaryUrl) {
      imageMapping[filename] = cloudinaryUrl;
    }
  }

  // Save mapping to file
  const mappingFile = path.join(__dirname, 'cloudinary-mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(imageMapping, null, 2));
  console.log(`\n📄 Image mapping saved to: ${mappingFile}`);
  console.log(`\n🎉 Migration completed! ${Object.keys(imageMapping).length} images uploaded to Cloudinary.`);

  return imageMapping;
}

// Run migration if called directly
if (require.main === module) {
  migrateImages()
    .then(() => {
      console.log('\n✨ All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateImages, imageMapping };