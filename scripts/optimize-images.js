#!/usr/bin/env node
/**
 * IMAGE OPTIMIZATION SCRIPT
 * Converts images to WebP/AVIF formats with optimal compression
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const INPUT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(__dirname, '..', 'optimized');
const FORMATS = ['webp', 'avif'];

const OPTIMIZATION_CONFIG = {
    jpeg: {
        quality: 80,
        progressive: true,
        mozjpeg: true
    },
    png: {
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true
    },
    webp: {
        quality: 82,
        effort: 6,
        lossless: false
    },
    avif: {
        quality: 75,
        effort: 9,
        lossless: false
    }
};

async function ensureDir(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function findImages(dir) {
    const images = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
            images.push(...await findImages(fullPath));
        } else if (entry.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(entry.name)) {
            images.push(fullPath);
        }
    }
    
    return images;
}

async function optimizeImage(inputPath, outputDir) {
    const fileName = path.basename(inputPath, path.extname(inputPath));
    const ext = path.extname(inputPath).toLowerCase();
    
    console.log(`📸 Optimizing: ${path.basename(inputPath)}`);
    
    const results = [];
    
    try {
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        // Original format optimization
        let originalOutput;
        if (ext === '.jpg' || ext === '.jpeg') {
            originalOutput = await image
                .jpeg(OPTIMIZATION_CONFIG.jpeg)
                .toBuffer();
        } else if (ext === '.png') {
            originalOutput = await image
                .png(OPTIMIZATION_CONFIG.png)
                .toBuffer();
        }
        
        if (originalOutput) {
            const originalPath = path.join(outputDir, `${fileName}${ext}`);
            await fs.writeFile(originalPath, originalOutput);
            results.push({
                format: ext.slice(1),
                path: originalPath,
                size: originalOutput.length
            });
        }
        
        // Generate modern formats
        for (const format of FORMATS) {
            let output;
            
            if (format === 'webp') {
                output = await image.webp(OPTIMIZATION_CONFIG.webp).toBuffer();
            } else if (format === 'avif') {
                output = await image.avif(OPTIMIZATION_CONFIG.avif).toBuffer();
            }
            
            if (output) {
                const outputPath = path.join(outputDir, `${fileName}.${format}`);
                await fs.writeFile(outputPath, output);
                results.push({
                    format,
                    path: outputPath,
                    size: output.length
                });
            }
        }
        
        // Generate responsive sizes for critical images
        if (fileName.includes('hero') || fileName.includes('poster') || fileName.includes('preview')) {
            const sizes = [
                { suffix: '@2x', width: metadata.width },
                { suffix: '', width: Math.floor(metadata.width * 0.75) },
                { suffix: '@0.5x', width: Math.floor(metadata.width * 0.5) }
            ];
            
            for (const size of sizes) {
                for (const format of ['webp', 'avif']) {
                    const resized = await image
                        .resize(size.width)
                        [format](OPTIMIZATION_CONFIG[format])
                        .toBuffer();
                    
                    const resizedPath = path.join(outputDir, `${fileName}${size.suffix}.${format}`);
                    await fs.writeFile(resizedPath, resized);
                    results.push({
                        format: `${format}_${size.suffix}`,
                        path: resizedPath,
                        size: resized.length
                    });
                }
            }
        }
        
        return results;
        
    } catch (error) {
        console.error(`❌ Error optimizing ${inputPath}:`, error.message);
        return [];
    }
}

async function generatePictureElements() {
    const pictureElements = `
<!-- Picture element examples for optimized images -->

<!-- Hero Image with responsive formats -->
<picture>
    <source media="(min-width: 1024px)" 
            srcset="video-poster@2x.avif 2x, video-poster.avif 1x" 
            type="image/avif">
    <source media="(min-width: 1024px)" 
            srcset="video-poster@2x.webp 2x, video-poster.webp 1x" 
            type="image/webp">
    <source media="(max-width: 768px)" 
            srcset="video-poster@0.5x.avif 1x" 
            type="image/avif">
    <source media="(max-width: 768px)" 
            srcset="video-poster@0.5x.webp 1x" 
            type="image/webp">
    <img src="video-poster.jpg" 
         alt="FacePay Demo" 
         loading="lazy"
         decoding="async"
         width="800" 
         height="450">
</picture>

<!-- Preview Image -->
<picture>
    <source srcset="preview.avif" type="image/avif">
    <source srcset="preview.webp" type="image/webp">
    <img src="preview.jpg" 
         alt="FacePay Preview" 
         loading="lazy"
         decoding="async">
</picture>

<!-- Icon optimized -->
<picture>
    <source srcset="icon-192.avif" type="image/avif">
    <source srcset="icon-192.webp" type="image/webp">
    <img src="icon-192.png" 
         alt="FacePay Icon" 
         loading="lazy"
         decoding="async"
         width="192" 
         height="192">
</picture>
    `;
    
    await fs.writeFile(
        path.join(__dirname, '..', 'picture-elements.html'), 
        pictureElements
    );
}

async function main() {
    console.log('🚀 Starting image optimization...');
    
    await ensureDir(OUTPUT_DIR);
    
    const images = await findImages(INPUT_DIR);
    console.log(`📁 Found ${images.length} images to optimize`);
    
    const allResults = [];
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    
    for (const imagePath of images) {
        try {
            const stat = await fs.stat(imagePath);
            totalOriginalSize += stat.size;
            
            const results = await optimizeImage(imagePath, OUTPUT_DIR);
            allResults.push(...results);
            
            results.forEach(result => {
                totalOptimizedSize += result.size;
            });
            
        } catch (error) {
            console.error(`❌ Failed to process ${imagePath}:`, error.message);
        }
    }
    
    // Generate picture elements
    await generatePictureElements();
    
    // Generate size report
    const savings = totalOriginalSize - totalOptimizedSize;
    const savingsPercent = ((savings / totalOriginalSize) * 100).toFixed(1);
    
    const report = {
        timestamp: new Date().toISOString(),
        original_size: totalOriginalSize,
        optimized_size: totalOptimizedSize,
        savings: savings,
        savings_percent: savingsPercent + '%',
        formats_generated: allResults.reduce((acc, result) => {
            acc[result.format] = (acc[result.format] || 0) + 1;
            return acc;
        }, {})
    };
    
    await fs.writeFile(
        path.join(OUTPUT_DIR, 'optimization-report.json'),
        JSON.stringify(report, null, 2)
    );
    
    console.log(`✅ Optimization complete!`);
    console.log(`📊 Original size: ${(totalOriginalSize / 1024).toFixed(1)} KB`);
    console.log(`📊 Optimized size: ${(totalOptimizedSize / 1024).toFixed(1)} KB`);
    console.log(`💾 Savings: ${(savings / 1024).toFixed(1)} KB (${savingsPercent}%)`);
    console.log(`🖼️  Formats generated:`, report.formats_generated);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { optimizeImage, main };