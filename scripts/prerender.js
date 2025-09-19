#!/usr/bin/env node
/**
 * PRERENDERING SCRIPT
 * Static site generation for optimal performance and SEO
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const DIST_DIR = path.join(__dirname, '..', 'dist');
const PRERENDER_CONFIG = {
    routes: [
        { path: '/', output: 'index.html' },
        { path: '/privacy.html', output: 'privacy.html' },
        { path: '/terms.html', output: 'terms.html' },
        { path: '/support.html', output: 'support.html' }
    ],
    viewport: {
        width: 1200,
        height: 800,
        deviceScaleFactor: 1
    },
    userAgent: 'Mozilla/5.0 (compatible; FacePayBot/1.0; +https://facepay.com.mx/bot)',
    waitOptions: {
        timeout: 30000,
        waitUntil: 'networkidle0'
    }
};

async function ensureDir(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function prerenderRoute(page, route) {
    console.log(`🔄 Prerendering: ${route.path}`);
    
    try {
        await page.goto(`http://localhost:8000${route.path}`, PRERENDER_CONFIG.waitOptions);
        
        // Wait for critical resources to load
        await page.waitForFunction(() => {
            return document.readyState === 'complete' && 
                   !document.querySelector('.loading') &&
                   window.PerformanceManager?.isLoaded;
        }, { timeout: 10000 });
        
        // Inject prerender optimizations
        await page.evaluate(() => {
            // Remove non-essential elements for static version
            document.querySelectorAll('.countdown-timer').forEach(el => {
                el.textContent = '23:45:12';
            });
            
            // Set static values for dynamic counters
            document.querySelectorAll('#spotsLeft, #spotsLeftMain').forEach(el => {
                el.textContent = '127';
            });
            
            // Remove loading states
            document.querySelectorAll('.lazy-placeholder').forEach(el => {
                el.classList.add('loaded');
            });
            
            // Add prerendered flag
            document.documentElement.setAttribute('data-prerendered', 'true');
            
            // Optimize images for static version
            document.querySelectorAll('img[data-src]').forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
            
            // Optimize videos for static version
            document.querySelectorAll('video[data-src]').forEach(video => {
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                    video.removeAttribute('data-src');
                }
            });
        });
        
        // Get the prerendered HTML
        const html = await page.content();
        
        // Optimize the HTML
        const optimizedHtml = await optimizeHTML(html);
        
        // Save prerendered version
        const outputPath = path.join(DIST_DIR, route.output);
        await fs.writeFile(outputPath, optimizedHtml);
        
        console.log(`✅ Prerendered: ${route.path} -> ${route.output}`);
        
        return {
            route: route.path,
            output: route.output,
            size: optimizedHtml.length,
            success: true
        };
        
    } catch (error) {
        console.error(`❌ Failed to prerender ${route.path}:`, error.message);
        return {
            route: route.path,
            output: route.output,
            error: error.message,
            success: false
        };
    }
}

async function optimizeHTML(html) {
    let optimized = html;
    
    // Remove development scripts and comments
    optimized = optimized.replace(/<!--[\s\S]*?-->/g, '');
    
    // Inline critical CSS if not already done
    if (!optimized.includes('<style>')) {
        try {
            const criticalCSS = await fs.readFile(
                path.join(__dirname, '..', 'critical.css'), 
                'utf-8'
            );
            optimized = optimized.replace(
                '</head>',
                `<style>${criticalCSS}</style></head>`
            );
        } catch (error) {
            console.warn('Could not inline critical CSS:', error.message);
        }
    }
    
    // Add structured data for better SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "FacePay - Revolutionary Crypto Payments",
        "url": "https://facepay.com.mx",
        "description": "Revolutionary crypto payments with Face ID. Zero gas fees on StarkNet L2.",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "iOS, Android",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1247"
        },
        "author": {
            "@type": "Organization",
            "name": "FacePay Team"
        }
    };
    
    optimized = optimized.replace(
        '</head>',
        `<script type="application/ld+json">${JSON.stringify(structuredData)}</script></head>`
    );
    
    // Add prerendered optimization hints
    optimized = optimized.replace(
        '<html',
        '<html data-prerendered="true"'
    );
    
    // Optimize whitespace while preserving readability
    optimized = optimized.replace(/\s+/g, ' ')
                      .replace(/> </g, '><')
                      .trim();
    
    return optimized;
}

async function generateSitemap() {
    const baseURL = 'https://facepay.com.mx';
    const routes = PRERENDER_CONFIG.routes;
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${routes.map(route => `    <url>
        <loc>${baseURL}${route.path === '/' ? '' : route.path}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route.path === '/' ? '1.0' : '0.8'}</priority>
        <mobile:mobile/>
    </url>`).join('\n')}
</urlset>`;

    await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
    console.log('📄 Generated sitemap.xml');
}

async function generateRobotsTxt() {
    const robots = `User-agent: *
Allow: /

# Performance optimized pages
Allow: /index.html
Allow: /privacy.html
Allow: /terms.html
Allow: /support.html

# Assets
Allow: /css/
Allow: /js/
Allow: /images/
Allow: /videos/
Allow: /fonts/

# Sitemaps
Sitemap: https://facepay.com.mx/sitemap.xml

# Crawl-delay for better server performance
Crawl-delay: 1

# Block development files
Disallow: /scripts/
Disallow: /chunks/
Disallow: *.map
Disallow: /webpack.config.js
Disallow: /package.json
`;

    await fs.writeFile(path.join(DIST_DIR, 'robots.txt'), robots);
    console.log('🤖 Generated robots.txt');
}

async function generateManifest() {
    const manifest = {
        name: "FacePay - Revolutionary Crypto Payments",
        short_name: "FacePay",
        description: "Crypto payments as easy as Instagram with Face ID security",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#10b981",
        orientation: "portrait-primary",
        categories: ["finance", "productivity", "business"],
        lang: "es-MX",
        dir: "ltr",
        icons: [
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any maskable"
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable"
            }
        ],
        shortcuts: [
            {
                name: "Join Beta",
                short_name: "Beta",
                description: "Join the exclusive beta program",
                url: "/?action=join",
                icons: [{ src: "/icon-192.png", sizes: "192x192" }]
            }
        ],
        screenshots: [
            {
                src: "/screenshot-wide.png",
                sizes: "1280x720",
                type: "image/png",
                form_factor: "wide"
            },
            {
                src: "/screenshot-narrow.png",
                sizes: "640x1136",
                type: "image/png",
                form_factor: "narrow"
            }
        ]
    };

    await fs.writeFile(
        path.join(DIST_DIR, 'manifest.json'), 
        JSON.stringify(manifest, null, 2)
    );
    console.log('📱 Generated manifest.json');
}

async function startLocalServer() {
    const { spawn } = require('child_process');
    
    console.log('🚀 Starting local server...');
    
    const server = spawn('npx', ['http-server', DIST_DIR, '-p', '8000', '--silent'], {
        stdio: 'pipe'
    });
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return server;
}

async function main() {
    console.log('🏗️  Starting prerendering process...');
    
    await ensureDir(DIST_DIR);
    
    // Start local server
    const server = await startLocalServer();
    
    let browser;
    const results = [];
    
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-zygote',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        });
        
        const page = await browser.newPage();
        
        // Configure page
        await page.setViewport(PRERENDER_CONFIG.viewport);
        await page.setUserAgent(PRERENDER_CONFIG.userAgent);
        
        // Enable JavaScript but disable images for faster processing
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image') {
                req.abort();
            } else {
                req.continue();
            }
        });
        
        // Prerender all routes
        for (const route of PRERENDER_CONFIG.routes) {
            const result = await prerenderRoute(page, route);
            results.push(result);
        }
        
        await browser.close();
        
    } catch (error) {
        console.error('❌ Prerendering failed:', error);
        if (browser) await browser.close();
    } finally {
        // Kill server
        server.kill();
    }
    
    // Generate additional files
    await Promise.all([
        generateSitemap(),
        generateRobotsTxt(),
        generateManifest()
    ]);
    
    // Generate report
    const report = {
        timestamp: new Date().toISOString(),
        routes: results,
        total_routes: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        total_size: results.reduce((acc, r) => acc + (r.size || 0), 0)
    };
    
    await fs.writeFile(
        path.join(DIST_DIR, 'prerender-report.json'),
        JSON.stringify(report, null, 2)
    );
    
    console.log(`✅ Prerendering complete!`);
    console.log(`📊 Routes processed: ${report.total_routes}`);
    console.log(`✅ Successful: ${report.successful}`);
    console.log(`❌ Failed: ${report.failed}`);
    console.log(`📦 Total size: ${(report.total_size / 1024).toFixed(1)} KB`);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { prerenderRoute, main };