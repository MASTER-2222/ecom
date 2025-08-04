// Test script to verify RitKART deployment
const https = require('https');
const http = require('http');

const BACKEND_URL = 'https://ritkart-backend.onrender.com';
const FRONTEND_URL = 'https://ritkart-frontend.onrender.com';

// Test endpoints
const endpoints = [
  { name: 'Backend Health', url: `${BACKEND_URL}/api/health`, method: 'GET' },
  { name: 'Backend Products', url: `${BACKEND_URL}/api/products`, method: 'GET' },
  { name: 'Backend Categories', url: `${BACKEND_URL}/api/categories`, method: 'GET' },
  { name: 'Backend Users', url: `${BACKEND_URL}/api/users`, method: 'GET' },
  { name: 'Admin Image List', url: `${BACKEND_URL}/api/admin/images/list`, method: 'GET' },
  { name: 'Admin Duplicate Analysis', url: `${BACKEND_URL}/api/admin/images/analyze-duplicates`, method: 'GET' }
];

function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RitKART-Test-Script/1.0'
      },
      timeout: 10000
    };

    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function testEndpoint(endpoint) {
  console.log(`\n🔍 Testing: ${endpoint.name}`);
  console.log(`   URL: ${endpoint.url}`);
  
  try {
    const result = await makeRequest(endpoint.url, endpoint.method);
    
    if (result.status >= 200 && result.status < 300) {
      console.log(`   ✅ SUCCESS (${result.status})`);
      
      // Show relevant data
      if (typeof result.data === 'object') {
        if (result.data.message) {
          console.log(`   📝 Message: ${result.data.message}`);
        }
        if (result.data.data && Array.isArray(result.data.data)) {
          console.log(`   📊 Data count: ${result.data.data.length} items`);
        }
        if (result.data.success !== undefined) {
          console.log(`   🎯 Success: ${result.data.success}`);
        }
      }
      
      return { success: true, status: result.status, data: result.data };
    } else {
      console.log(`   ❌ FAILED (${result.status})`);
      console.log(`   📝 Response: ${JSON.stringify(result.data).substring(0, 200)}...`);
      return { success: false, status: result.status, error: result.data };
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testFullStackIntegration() {
  console.log('🚀 RitKART Full-Stack Deployment Test\n');
  console.log('🎯 Testing backend endpoints and integration...\n');
  
  const results = [];
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({
      name: endpoint.name,
      url: endpoint.url,
      ...result
    });
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ WORKING ENDPOINTS:');
    successful.forEach(r => {
      console.log(`   - ${r.name} (${r.status || 'OK'})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED ENDPOINTS:');
    failed.forEach(r => {
      console.log(`   - ${r.name}: ${r.error || r.status}`);
    });
  }
  
  // Overall status
  console.log('\n🎯 OVERALL STATUS:');
  if (successful.length >= results.length * 0.8) {
    console.log('🟢 DEPLOYMENT STATUS: HEALTHY');
    console.log('✅ Backend is responding well');
    console.log('✅ Most endpoints are functional');
    console.log('✅ Ready for frontend integration');
  } else if (successful.length >= results.length * 0.5) {
    console.log('🟡 DEPLOYMENT STATUS: PARTIAL');
    console.log('⚠️  Some endpoints are not responding');
    console.log('💡 Check failed endpoints for issues');
  } else {
    console.log('🔴 DEPLOYMENT STATUS: ISSUES DETECTED');
    console.log('❌ Multiple endpoints are failing');
    console.log('🔧 Backend may need troubleshooting');
  }
  
  // Specific recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  
  const healthCheck = results.find(r => r.name === 'Backend Health');
  if (healthCheck && healthCheck.success) {
    console.log('✅ Backend is alive and responding');
  } else {
    console.log('❌ Backend health check failed - check deployment');
  }
  
  const adminEndpoints = results.filter(r => r.name.includes('Admin'));
  const workingAdminEndpoints = adminEndpoints.filter(r => r.success);
  
  if (workingAdminEndpoints.length === adminEndpoints.length) {
    console.log('✅ Admin panel endpoints are ready');
    console.log('🎯 You can now use the admin panel for image cleanup');
  } else {
    console.log('⚠️  Some admin endpoints need attention');
  }
  
  console.log('\n🔗 NEXT STEPS:');
  console.log('1. If backend is healthy, test frontend at:', FRONTEND_URL);
  console.log('2. Access admin panel at: /admin');
  console.log('3. Use admin credentials: admin@ritkart.com / admin123');
  console.log('4. Test image cleanup functionality');
  console.log('5. Upload new product images to replace duplicates');
  
  return results;
}

// Run the test
if (require.main === module) {
  testFullStackIntegration().catch(console.error);
}

module.exports = { testFullStackIntegration, testEndpoint };
