#!/usr/bin/env node

// RitKART READDY.AI URL Replacer
// This script replaces all READDY.AI URLs with proper Cloudinary image references

const fs = require('fs').promises;
const path = require('path');

// Load the Cloudinary mapping
const cloudinaryMapping = require('./cloudinary-mapping.json');

// Create mapping from product names to Cloudinary URLs
const productToCloudinaryMap = {
    // Electronics
    'Samsung Galaxy S24 Ultra': cloudinaryMapping['samsung-galaxy-s24-ultra']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/samsung-galaxy-s24-ultra',
    'Apple iPhone 15 Pro Max': cloudinaryMapping['iphone-15-pro-max']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/iphone-15-pro-max',
    'Sony WH-1000XM5': cloudinaryMapping['sony-wh1000xm5']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/sony-wh1000xm5',
    'MacBook Air M2': cloudinaryMapping['macbook-air-m2']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/macbook-air-m2',
    'Dell XPS 13': cloudinaryMapping['dell-xps-13']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/dell-xps-13',
    'LG OLED TV': cloudinaryMapping['lg-oled-tv-55']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/lg-oled-tv-55',
    'Canon EOS R6': cloudinaryMapping['canon-eos-r6']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/canon-eos-r6',
    'PlayStation 5': cloudinaryMapping['playstation-5']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/playstation-5',
    'Nintendo Switch': cloudinaryMapping['nintendo-switch-oled']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/electronics/nintendo-switch-oled',
    'OnePlus 12': cloudinaryMapping['oneplus-12']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/mobiles/oneplus-12',
    'Google Pixel 8': cloudinaryMapping['google-pixel-8']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/mobiles/google-pixel-8',
    'Xiaomi 14 Ultra': cloudinaryMapping['xiaomi-14-ultra']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/mobiles/xiaomi-14-ultra',
    
    // Fashion
    'Levis Jeans': cloudinaryMapping['levis-jeans-men']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/fashion/levis-jeans-men',
    'Floral Dress': cloudinaryMapping['womens-floral-dress']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/fashion/womens-floral-dress',
    'Nike Air Force': cloudinaryMapping['nike-air-force-1']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/fashion/nike-air-force-1',
    'Cotton T-shirt': cloudinaryMapping['mens-cotton-tshirt']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/fashion/mens-cotton-tshirt',
    'Denim Jacket': cloudinaryMapping['womens-denim-jacket']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/fashion/womens-denim-jacket',
    'Adidas Shoes': cloudinaryMapping['adidas-ultraboost']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/fashion/adidas-ultraboost',
    
    // Home & Kitchen
    'Wooden Bed': cloudinaryMapping['wooden-bed-frame']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/wooden-bed-frame',
    'Navy Sofa': cloudinaryMapping['navy-fabric-sofa']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/navy-fabric-sofa',
    'Study Desk': cloudinaryMapping['wooden-study-desk']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/wooden-study-desk',
    'Dining Set': cloudinaryMapping['dining-table-set']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/dining-table-set',
    'Kitchen Cabinet': cloudinaryMapping['kitchen-cabinet-white']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/kitchen-cabinet-white',
    'Memory Mattress': cloudinaryMapping['memory-foam-mattress']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/memory-foam-mattress',
    'Wooden Wardrobe': cloudinaryMapping['wooden-wardrobe']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/wooden-wardrobe',
    'LED Light': cloudinaryMapping['led-ceiling-light']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/home/led-ceiling-light',
    
    // Appliances
    'LG Refrigerator': cloudinaryMapping['lg-double-door-fridge']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/appliances/lg-double-door-fridge',
    'Washing Machine': cloudinaryMapping['front-load-washer']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/appliances/front-load-washer',
    'Air Conditioner': cloudinaryMapping['split-air-conditioner']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/appliances/split-air-conditioner',
    'Microwave': cloudinaryMapping['convection-microwave']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/appliances/convection-microwave',
    'Induction Cooktop': cloudinaryMapping['induction-cooktop']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/appliances/induction-cooktop',
    
    // Books
    'Psychology Money': cloudinaryMapping['psychology-money-book']?.secure_url || 'https://res.cloudinary.com/dv0lg87ib/image/upload/w_300,h_300,c_fill,f_auto,q_auto/ritkart/books/psychology-money-book'
};

// Create product images object reference
const productImagesReference = `productImages['samsung-s24']`;

// Function to replace READDY.AI URLs in a file
async function replaceReddyUrlsInFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        
        // Check if file contains READDY.AI URLs
        if (!content.includes('readdy.ai')) {
            return { changed: false, filePath };
        }
        
        let updatedContent = content;
        let changesCount = 0;
        
        // Replace READDY.AI URLs with productImages references
        const reddyUrlPattern = /image: 'https:\/\/readdy\.ai\/api\/search-image\?[^']+'/g;
        
        // Map of specific product names to productImages keys
        const productMappings = {
            'Samsung Galaxy S24': "image: productImages['samsung-s24']",
            'iPhone 15 Pro Max': "image: productImages['iphone-15']",
            'Sony.*headphones': "image: productImages['sony-headphones']",
            'MacBook Air': "image: productImages['macbook-air']",
            'Dell XPS': "image: productImages['dell-xps']",
            'LG.*OLED': "image: productImages['lg-oled-tv']",
            'Canon.*camera': "image: productImages['canon-camera']",
            'PlayStation': "image: productImages['ps5-console']",
            'Nintendo': "image: productImages['nintendo-switch']",
            'OnePlus 12': "image: productImages['oneplus-12']",
            'Pixel 8': "image: productImages['pixel-8']",
            'Xiaomi 14': "image: productImages['xiaomi-14']",
            'Levis.*jeans': "image: productImages['levis-jeans']",
            'floral.*dress': "image: productImages['floral-dress']",
            'Nike.*Force': "image: productImages['nike-shoes']",
            'cotton.*t-shirt': "image: productImages['cotton-tshirt']",
            'denim.*jacket': "image: productImages['denim-jacket']",
            'Adidas': "image: productImages['adidas-shoes']",
            'wooden.*bed': "image: productImages['wooden-bed']",
            'navy.*sofa': "image: productImages['navy-sofa']",
            'study.*desk': "image: productImages['study-desk']",
            'dining.*table': "image: productImages['dining-set']",
            'kitchen.*cabinet': "image: productImages['kitchen-cabinet']",
            'memory.*mattress': "image: productImages['memory-mattress']",
            'wardrobe': "image: productImages['wooden-wardrobe']",
            'LED.*light': "image: productImages['ceiling-light']",
            'LG.*refrigerator': "image: productImages['lg-refrigerator']",
            'washing.*machine': "image: productImages['washing-machine']",
            'air.*conditioner': "image: productImages['split-ac']",
            'microwave': "image: productImages['microwave-oven']",
            'induction': "image: productImages['induction-cooktop']",
            'Psychology.*Money': "image: productImages['psychology-money']"
        };
        
        // Get context around READDY URLs to determine product type
        const lines = updatedContent.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('readdy.ai')) {
                // Look for product name in current and previous lines
                const contextLines = lines.slice(Math.max(0, i-3), i+1).join(' ');
                let replaced = false;
                
                for (const [productPattern, replacement] of Object.entries(productMappings)) {
                    const regex = new RegExp(productPattern, 'i');
                    if (regex.test(contextLines)) {
                        lines[i] = line.replace(reddyUrlPattern, replacement);
                        replaced = true;
                        changesCount++;
                        break;
                    }
                }
                
                // If no specific match found, use a generic replacement
                if (!replaced) {
                    const fallbackUrl = "image: productImages['samsung-s24']";
                    lines[i] = line.replace(reddyUrlPattern, fallbackUrl);
                    changesCount++;
                }
            }
        }
        
        updatedContent = lines.join('\n');
        
        // Additional fallback replacement for any remaining READDY URLs
        updatedContent = updatedContent.replace(
            /https:\/\/readdy\.ai\/api\/search-image\?[^"'\s]+/g,
            "productImages['samsung-s24']"
        );
        
        if (changesCount > 0) {
            await fs.writeFile(filePath, updatedContent, 'utf8');
            return { changed: true, filePath, changesCount };
        }
        
        return { changed: false, filePath };
        
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return { changed: false, filePath, error: error.message };
    }
}

// Function to recursively find all TypeScript and JavaScript files
async function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
    const files = [];
    const items = await fs.readdir(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            const subFiles = await findFiles(fullPath, extensions);
            files.push(...subFiles);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// Main function
async function replaceAllReddyUrls() {
    console.log('🔍 Starting READDY.AI URL replacement process...\n');
    
    try {
        const frontend2Dir = '/app/frontend2';
        const files = await findFiles(frontend2Dir);
        
        console.log(`📁 Found ${files.length} files to process`);
        
        const results = [];
        let totalChanges = 0;
        
        for (const file of files) {
            const result = await replaceReddyUrlsInFile(file);
            results.push(result);
            
            if (result.changed) {
                console.log(`✅ Updated ${path.relative(frontend2Dir, file)} (${result.changesCount} changes)`);
                totalChanges += result.changesCount || 0;
            }
        }
        
        const changedFiles = results.filter(r => r.changed);
        const errorFiles = results.filter(r => r.error);
        
        console.log('\n📊 Replacement Summary:');
        console.log(`✅ Files processed: ${files.length}`);
        console.log(`🔄 Files changed: ${changedFiles.length}`);
        console.log(`📝 Total replacements: ${totalChanges}`);
        console.log(`❌ Errors: ${errorFiles.length}`);
        
        if (changedFiles.length > 0) {
            console.log('\n🎉 Successfully updated files:');
            changedFiles.forEach(result => {
                console.log(`   • ${path.relative(frontend2Dir, result.filePath)}`);
            });
        }
        
        if (errorFiles.length > 0) {
            console.log('\n❌ Files with errors:');
            errorFiles.forEach(result => {
                console.log(`   • ${path.relative(frontend2Dir, result.filePath)}: ${result.error}`);
            });
        }
        
        console.log('\n🎊 READDY.AI URL replacement completed!');
        
        return {
            totalFiles: files.length,
            changedFiles: changedFiles.length,
            totalChanges,
            errors: errorFiles.length
        };
        
    } catch (error) {
        console.error('💥 Replacement process failed:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    replaceAllReddyUrls()
        .then(result => {
            console.log(`\n🎉 Process completed: ${result.changedFiles} files updated with ${result.totalChanges} replacements`);
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Process failed:', error);
            process.exit(1);
        });
}

module.exports = { replaceAllReddyUrls, replaceReddyUrlsInFile };