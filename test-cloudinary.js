const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dv0lg87ib',
  api_key: '195345735854272',
  api_secret: 'jigNQt700eFYsi7TSNB9ZJQJfGI'
});

async function testCloudinaryConnection() {
  try {
    console.log('🔗 Testing Cloudinary connection...');
    
    // Test with a simple URL upload
    const testResult = await cloudinary.uploader.upload(
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
      {
        public_id: 'test-upload',
        folder: 'ritkart/test',
        overwrite: true
      }
    );
    
    console.log('✅ Cloudinary connection successful!');
    console.log('Test image URL:', testResult.secure_url);
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

testCloudinaryConnection();