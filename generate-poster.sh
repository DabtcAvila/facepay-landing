#!/bin/bash

# Generate poster frame from video for mobile optimization
echo "🎬 Generating poster frame for FacePay demo video..."

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found. Installing via homebrew..."
    brew install ffmpeg
fi

# Generate poster at 2 seconds (good representative frame)
ffmpeg -i facepay-demo.mp4 -ss 00:00:02 -vframes 1 -f image2 -y facepay-demo-poster.jpg

# Optimize the image for web
if command -v convert &> /dev/null; then
    echo "🖼️ Optimizing poster image..."
    convert facepay-demo-poster.jpg -quality 85 -resize 1200x675 facepay-demo-poster.jpg
fi

echo "✅ Poster frame generated: facepay-demo-poster.jpg"
echo "📱 Mobile optimization complete!"