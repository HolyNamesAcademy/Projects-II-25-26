#!/usr/bin/env bash
# Downloads Unsplash sources for DevDataSeedService into public/images/unsplash.
# Re-run after changing photo IDs in this script (keep names in sync with Java arrays).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/images/unsplash"
Q="w=600&q=80"

mkdir -p "$OUT"

download() {
  local file="$1"
  local id="$2"
  local url="https://images.unsplash.com/photo-${id}?${Q}"
  echo "→ $file"
  curl -fsSL "$url" -o "$OUT/$file"
}

# Tops (matches UNSPLASH_TOPS tops-01 … tops-06)
download "tops-01.jpg" "1521572163474-6864f9cf17ab"
download "tops-02.jpg" "1556909114-f6e7ad7d3136"
download "tops-03.jpg" "1434389677669-e08b4cac3105"
download "tops-04.jpg" "1490481651871-ab68de25d43d"
download "tops-05.jpg" "1576566588028-4147f3842f27"
download "tops-06.jpg" "1523381210434-271e8be1f52b"

# Bottoms
download "bottoms-01.jpg" "1542272604-787c3835535d"
download "bottoms-02.jpg" "1506629082955-511b1aa562c8"
download "bottoms-03.jpg" "1562157873-818bc0726f68"

# Dresses
download "dresses-01.jpg" "1595777457583-95e059d581b8"
download "dresses-02.jpg" "1496747611176-843222e1e57c"
download "dresses-03.jpg" "1515372039744-b8f02a3ae446"
download "dresses-04.jpg" "1469334031218-e382a71b716b"
download "dresses-05.jpg" "1515886657613-9f3515b0c78f"

# Shoes
download "shoes-01.jpg" "1542291026-7eec264c27ff"
download "shoes-02.jpg" "1549298916-b41d501d3772"
download "shoes-03.jpg" "1600185365926-3a2ce3cdb9eb"
download "shoes-04.jpg" "1595950653106-6c9ebd614d3a"
download "shoes-05.jpg" "1460353581641-37baddab0fa2"
download "shoes-06.jpg" "1608231387042-66d1773070a5"
download "shoes-07.jpg" "1560769629-975ec94e6a86"
download "shoes-08.jpg" "1525966222134-fcfa99b8ae77"

echo "Done: $OUT ($(ls -1 "$OUT" | wc -l | tr -d ' ') files)"
