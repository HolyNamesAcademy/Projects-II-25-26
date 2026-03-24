#!/usr/bin/env node

const fs = require("fs");
const https = require("https");
const path = require("path");

// Ignore SSL certificate errors for restrictive networks
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, "../public/fonts");
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Font families and their configurations
const fontConfigs = [
  {
    family: "Unna",
    weights: ["400", "700"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Unna:wght@400;700&display=swap",
  },
  {
    family: "Playfair Display",
    weights: ["500"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&display=swap",
  },
  {
    family: "Satisfy",
    weights: ["400"],
    cssUrl:
      "https://fonts.googleapis.com/css2?family=Satisfy:wght@400&display=swap",
  },
];

async function fetchFontCSS(cssUrl) {
  return new Promise((resolve, reject) => {
    const options = {
      rejectUnauthorized: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    };

    https
      .get(cssUrl, options, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to fetch CSS: ${response.statusCode}`));
          return;
        }

        let data = "";
        response.on("data", (chunk) => (data += chunk));
        response.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

/**
 * Google Fonts serves multiple @font-face blocks per weight (cyrillic, vietnamese,
 * latin-ext, latin). next/font loads one file per weight — we must use the block
 * that includes basic Latin (U+0000-00FF) or text renders in the fallback font.
 */
function extractBasicLatinUrlsByWeight(css) {
  const blockRegex = /@font-face\s*\{([^}]+)\}/g;
  /** @type {Map<string, string>} */
  const byWeight = new Map();
  let blockMatch;
  while ((blockMatch = blockRegex.exec(css)) !== null) {
    const block = blockMatch[1];
    const rangeMatch = block.match(/unicode-range:\s*([^;]+);/);
    const unicodeRange = rangeMatch ? rangeMatch[1].trim() : "";
    const isBasicLatin =
      !unicodeRange ||
      unicodeRange.includes("U+0000-00FF") ||
      unicodeRange.includes("U+0-FF");
    if (!isBasicLatin) {
      continue;
    }
    const weightMatch = block.match(/font-weight:\s*(\d+)/);
    const weight = weightMatch ? weightMatch[1] : "400";
    const urlMatch = block.match(/url\((https:\/\/[^)]+\.(?:woff2|woff))\)/);
    if (!urlMatch) {
      continue;
    }
    if (!byWeight.has(weight)) {
      byWeight.set(weight, urlMatch[1]);
    }
  }
  return byWeight;
}

const forceRedownload = process.argv.includes("--force");

async function downloadFont(url, fontName) {
  return new Promise((resolve, reject) => {
    // Get file extension from URL
    const urlParts = url.split(".");
    const ext = urlParts[urlParts.length - 1];
    const filePath = path.join(fontsDir, `${fontName}.${ext}`);

    // Skip if file already exists and has content
    if (
      !forceRedownload &&
      fs.existsSync(filePath) &&
      fs.statSync(filePath).size > 0
    ) {
      console.log(
        `✅ ${fontName}.${ext} already exists (${fs.statSync(filePath).size} bytes)`
      );
      resolve();
      return;
    }

    console.log(`📥 Downloading ${fontName}.${ext}...`);

    const file = fs.createWriteStream(filePath);

    const request = https.get(
      url,
      {
        rejectUnauthorized: false,
        timeout: 30000,
      },
      (response) => {
        if (response.statusCode !== 200) {
          file.close(() => fs.unlink(filePath, () => {}));
          reject(
            new Error(
              `Failed to download ${fontName}: HTTP ${response.statusCode}`
            )
          );
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close(() => {
            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
              fs.unlink(filePath, () => {});
              reject(new Error(`Downloaded file is empty for ${fontName}`));
            } else {
              console.log(
                `✅ Downloaded ${fontName}.${ext} (${stats.size} bytes)`
              );
              resolve();
            }
          });
        });

        file.on("error", (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
      }
    );

    request.on("error", (err) => {
      reject(new Error(`Network error for ${fontName}: ${err.message}`));
    });

    request.on("timeout", () => {
      request.destroy();
      reject(new Error(`Download timeout for ${fontName}`));
    });
  });
}

async function downloadAllFonts() {
  console.log("📥 Downloading Google Fonts...");
  console.log(
    "🔓 SSL certificate verification disabled for restrictive networks"
  );

  try {
    for (const config of fontConfigs) {
      console.log(`\n🔍 Getting font URLs for ${config.family}...`);
      const css = await fetchFontCSS(config.cssUrl);
      const byWeight = extractBasicLatinUrlsByWeight(css);

      for (const weight of config.weights) {
        const url = byWeight.get(weight);
        if (!url) {
          console.log(
            `⚠️  No basic-Latin woff2 for ${config.family} weight ${weight}`
          );
          continue;
        }
        const fontName = `${config.family.toLowerCase().replace(/\s+/g, "-")}-${weight}`;
        await downloadFont(url, fontName);
      }
    }

    console.log("\n🎉 All fonts downloaded successfully!");
    console.log(
      "💡 You can now use the app offline or on restricted networks."
    );
  } catch (error) {
    console.error("❌ Error downloading fonts:", error.message);
    console.error("💡 Make sure you have internet access and try again");
    process.exit(1);
  }
}

downloadAllFonts();
