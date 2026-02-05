#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

// Ignore SSL certificate errors for restrictive networks
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, '../public/fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Font families and their configurations
const fontConfigs = [
  {
    family: 'Unna',
    weights: ['400', '700'],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Unna:wght@400;700&display=swap'
  },
  {
    family: 'Playfair Display',
    weights: ['500'],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap'
  },
  {
    family: 'Satisfy',
    weights: ['400'],
    cssUrl: 'https://fonts.googleapis.com/css2?family=Satisfy:wght@400&display=swap'
  }
];

async function fetchFontCSS(cssUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      rejectUnauthorized: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    https.get(cssUrl, options, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch CSS: ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractFontUrls(css) {
  const urlRegex = /url\((https:\/\/[^)]+\.(?:woff2|woff|ttf))\)/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(css)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function downloadFont(url, fontName) {
  return new Promise((resolve, reject) => {
    // Get file extension from URL
    const urlParts = url.split('.');
    const ext = urlParts[urlParts.length - 1];
    const filePath = path.join(fontsDir, `${fontName}.${ext}`);

    // Skip if file already exists and has content
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
      console.log(`✅ ${fontName}.${ext} already exists (${fs.statSync(filePath).size} bytes)`);
      resolve();
      return;
    }

    console.log(`📥 Downloading ${fontName}.${ext}...`);

    const file = fs.createWriteStream(filePath);

    const request = https.get(url, {
      rejectUnauthorized: false,
      timeout: 30000
    }, (response) => {

      if (response.statusCode !== 200) {
        file.close(() => fs.unlink(filePath, () => {}));
        reject(new Error(`Failed to download ${fontName}: HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close(() => {
          const stats = fs.statSync(filePath);
          if (stats.size === 0) {
            fs.unlink(filePath, () => {});
            reject(new Error(`Downloaded file is empty for ${fontName}`));
          } else {
            console.log(`✅ Downloaded ${fontName}.${ext} (${stats.size} bytes)`);
            resolve();
          }
        });
      });

      file.on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    });

    request.on('error', (err) => {
      reject(new Error(`Network error for ${fontName}: ${err.message}`));
    });

    request.on('timeout', () => {
      request.destroy();
      reject(new Error(`Download timeout for ${fontName}`));
    });
  });
}

async function downloadAllFonts() {
  console.log('📥 Downloading Google Fonts...');
  console.log('🔓 SSL certificate verification disabled for restrictive networks');

  try {
    for (const config of fontConfigs) {
      console.log(`\n🔍 Getting font URLs for ${config.family}...`);
      const css = await fetchFontCSS(config.cssUrl);
      const urls = extractFontUrls(css);

      if (urls.length === 0) {
        console.log(`⚠️  No font URLs found for ${config.family}`);
        continue;
      }

      console.log(`Found ${urls.length} font file(s) for ${config.family}`);

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const weight = config.weights[i] || '400';
        const fontName = `${config.family.toLowerCase().replace(/\s+/g, '-')}-${weight}`;

        await downloadFont(url, fontName);
      }
    }

    console.log('\n🎉 All fonts downloaded successfully!');
    console.log('💡 You can now use the app offline or on restricted networks.');
  } catch (error) {
    console.error('❌ Error downloading fonts:', error.message);
    console.error('💡 Make sure you have internet access and try again');
    process.exit(1);
  }
}

downloadAllFonts();
