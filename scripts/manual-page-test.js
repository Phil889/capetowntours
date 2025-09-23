// Simple page testing script
const https = require('http');

function testPage(url, language) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`\n🔍 Testing ${language} (${url})`);
                console.log(`Status: ${res.statusCode}`);
                
                if (res.statusCode !== 200) {
                    console.log(`❌ ERROR: ${res.statusCode} ${res.statusMessage}`);
                    resolve({ success: false, status: res.statusCode, content: data });
                    return;
                }
                
                // Check for translation keys appearing as raw text
                const translationKeyPatterns = [
                    /\b\w+\.\w+\.\w+/g, // Pattern like "booking.max_group_size"
                    /booking\.max_group_size/g,
                    /tour_detail\.pickup_included/g,
                    /navigation\.home/g
                ];
                
                const foundKeys = [];
                translationKeyPatterns.forEach(pattern => {
                    const matches = data.match(pattern);
                    if (matches) {
                        foundKeys.push(...matches);
                    }
                });
                
                if (foundKeys.length > 0) {
                    console.log(`⚠️  Found ${foundKeys.length} potential naked translation keys:`);
                    foundKeys.slice(0, 5).forEach(key => console.log(`   - ${key}`));
                } else {
                    console.log(`✅ No naked translation keys detected`);
                }
                
                // Check for English fallbacks in non-English pages
                if (language !== 'English') {
                    const englishPhrases = ['Book Now', 'Max Group Size', 'per person', 'Check Availability', 'What\'s Included'];
                    const foundEnglish = [];
                    
                    englishPhrases.forEach(phrase => {
                        if (data.includes(phrase)) {
                            foundEnglish.push(phrase);
                        }
                    });
                    
                    if (foundEnglish.length > 0) {
                        console.log(`⚠️  Found ${foundEnglish.length} English fallbacks:`);
                        foundEnglish.forEach(phrase => console.log(`   - "${phrase}"`));
                    } else {
                        console.log(`✅ No English fallbacks detected`);
                    }
                }
                
                // Look for expected translated content
                const contentLength = data.length;
                console.log(`📄 Content length: ${contentLength} characters`);
                
                if (contentLength < 1000) {
                    console.log(`⚠️  Very short content - possible rendering issue`);
                } else {
                    console.log(`✅ Content appears to be loading properly`);
                }
                
                resolve({
                    success: true,
                    status: res.statusCode,
                    contentLength: contentLength,
                    nakedKeys: foundKeys.length,
                    englishFallbacks: language !== 'English' ? foundEnglish.length : 0
                });
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ Request failed for ${url}: ${err.message}`);
            reject(err);
        });
        
        req.setTimeout(10000, () => {
            console.log(`⏱️  Request timeout for ${url}`);
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function runTests() {
    console.log('🧪 MANUAL PAGE TRANSLATION TEST');
    console.log('===============================');
    
    const tests = [
        { url: 'http://localhost:3000/tours/inverdoorn-safari-tour', lang: 'English' },
        { url: 'http://localhost:3000/de/tours/inverdoorn-safari-tour', lang: 'German' },
        // Only test pages we know might work
    ];
    
    const results = [];
    
    for (const test of tests) {
        try {
            const result = await testPage(test.url, test.lang);
            results.push({ ...test, ...result });
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.log(`❌ Test failed for ${test.lang}: ${error.message}`);
            results.push({ ...test, success: false, error: error.message });
        }
    }
    
    console.log('\n📊 TEST SUMMARY');
    console.log('===============');
    results.forEach(result => {
        if (result.success) {
            console.log(`✅ ${result.lang}: ${result.status} - ${result.nakedKeys} naked keys, ${result.englishFallbacks || 0} English fallbacks`);
        } else {
            console.log(`❌ ${result.lang}: Failed - ${result.status || result.error}`);
        }
    });
}

runTests().catch(console.error);