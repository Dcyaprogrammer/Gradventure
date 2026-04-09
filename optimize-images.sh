#!/bin/bash

# A simple script to automatically find and compress large images (>1MB) in the public folder.
# It uses macOS native `sips` tool, so no extra dependencies are needed.

TARGET_DIR="./docs/public"
SIZE_LIMIT="+1000k" # Find files larger than 1000KB (approx 1MB)
MAX_DIMENSION=1200  # Resize images so the longest edge is 1200px
JPEG_QUALITY=80     # Quality for JPEG compression (0-100)

echo "🔍 Searching for large images (>${SIZE_LIMIT}) in ${TARGET_DIR}..."

# Find large PNGs and JPEGs
find "$TARGET_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -size $SIZE_LIMIT | while read img; do
    echo "----------------------------------------"
    echo "⚠️ Found large image: $img"
    
    # Get original size in MB for display
    orig_size=$(ls -lh "$img" | awk '{print $5}')
    echo "   Original size: $orig_size"
    
    # Compress based on file type
    if [[ "$img" == *.png || "$img" == *.PNG ]]; then
        echo "   Compressing PNG..."
        # For PNG, we resize. (sips doesn't compress PNG size as well as JPEG, but resizing helps)
        sips -Z $MAX_DIMENSION "$img" --out "$img" > /dev/null
    else
        echo "   Compressing JPEG..."
        # For JPEG, we resize and adjust quality
        sips -Z $MAX_DIMENSION -s format jpeg -s formatOptions $JPEG_QUALITY "$img" --out "$img" > /dev/null
    fi
    
    # Get new size in MB for display
    new_size=$(ls -lh "$img" | awk '{print $5}')
    echo "✅ Optimized to: $new_size"
done

echo "----------------------------------------"
echo "🎉 Optimization complete!"
