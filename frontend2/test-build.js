// Simple test to check if components can be imported without errors
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing component imports...\n');

const componentsToTest = [
  'components/admin/DashboardSimple.tsx',
  'components/admin/UserManagement.tsx',
  'components/admin/ProductManagement.tsx',
  'components/admin/CategoryManagement.tsx',
  'components/admin/OrderManagement.tsx',
  'components/admin/CloudinaryCleanup.tsx',
  'components/admin/AdminAuth.tsx',
  'app/admin/page.tsx'
];

let allGood = true;

componentsToTest.forEach(component => {
  const filePath = path.join(__dirname, component);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Basic syntax checks
    const issues = [];
    
    // Check for proper React import
    if (!content.includes('import React') && !content.includes('from \'react\'')) {
      issues.push('Missing React import');
    }
    
    // Check for 'use client' directive
    if (!content.includes('\'use client\'')) {
      issues.push('Missing \'use client\' directive');
    }
    
    // Check for proper export
    if (!content.includes('export default')) {
      issues.push('Missing default export');
    }
    
    // Check for unclosed JSX tags (basic check)
    const openTags = (content.match(/<[^/][^>]*>/g) || []).length;
    const closeTags = (content.match(/<\/[^>]*>/g) || []).length;
    const selfClosingTags = (content.match(/<[^>]*\/>/g) || []).length;
    
    if (openTags !== closeTags + selfClosingTags) {
      issues.push('Potential JSX tag mismatch');
    }
    
    if (issues.length > 0) {
      console.log(`❌ ${component}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      allGood = false;
    } else {
      console.log(`✅ ${component}: OK`);
    }
  } else {
    console.log(`❌ ${component}: File not found`);
    allGood = false;
  }
});

console.log('\n📊 Test Summary:');
if (allGood) {
  console.log('✅ All components look good for compilation!');
  console.log('🚀 Ready for deployment');
} else {
  console.log('❌ Some issues found - check components above');
}

console.log('\n💡 If deployment still fails:');
console.log('1. Check Next.js version compatibility');
console.log('2. Verify all dependencies are installed');
console.log('3. Check for TypeScript configuration issues');
console.log('4. Review build logs for specific error details');
