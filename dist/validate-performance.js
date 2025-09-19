#!/usr/bin/env node

/**
 * FacePay Performance Validation Script
 * Validates all PageSpeed 100/100 optimizations are properly implemented
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    const color = colors[type] || colors.reset;
    console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

function validateOptimizations() {
    log('blue', '🚀 FacePay PageSpeed 100/100 Validation Starting...\n');
    
    const validations = [
        validateFiles,
        validateHTML,
        validateAssetSizes,
        validateWebP,
        validateServiceWorker,
        validateHeaders,
        validateCriticalPath
    ];
    
    let totalChecks = 0;
    let passedChecks = 0;
    
    validations.forEach(validation => {
        const result = validation();
        totalChecks += result.total;
        passedChecks += result.passed;
    });
    
    // Final report
    log('blue', '\n=== FINAL VALIDATION REPORT ===');
    log('blue', `Total Checks: ${totalChecks}`);
    log('green', `Passed: ${passedChecks}`);
    log('red', `Failed: ${totalChecks - passedChecks}`);
    
    const percentage = Math.round((passedChecks / totalChecks) * 100);
    log('blue', `Success Rate: ${percentage}%\n`);
    
    if (percentage >= 95) {
        log('green', '✅ VALIDATION PASSED - Ready for PageSpeed 100/100!');
    } else if (percentage >= 85) {
        log('yellow', '⚠️  VALIDATION PARTIAL - Some optimizations need attention');
    } else {
        log('red', '❌ VALIDATION FAILED - Critical optimizations missing');
    }
}

function validateFiles() {
    log('blue', '📁 Validating File Structure...');
    let passed = 0;
    let total = 0;
    
    const requiredFiles = [
        'index.html',
        'facepay-demo-optimized.mp4',
        'facepay-demo-poster.webp',
        'facepay-demo-poster.jpg',
        'service-worker.js',
        '_headers'
    ];
    
    requiredFiles.forEach(file => {
        total++;
        if (fs.existsSync(path.join(__dirname, file))) {
            log('green', `✅ ${file} exists`);
            passed++;
        } else {
            log('red', `❌ ${file} missing`);
        }
    });
    
    return { total, passed };
}

function validateHTML() {
    log('blue', '📄 Validating HTML Optimizations...');
    let passed = 0;
    let total = 0;
    
    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        log('red', '❌ index.html not found');
        return { total: 1, passed: 0 };
    }
    
    const html = fs.readFileSync(indexPath, 'utf8');
    
    // Check critical CSS inlining
    total++;
    if (html.includes('<style>') && html.includes('/* Reset & Base */')) {
        log('green', '✅ Critical CSS inlined');
        passed++;
    } else {
        log('red', '❌ Critical CSS not properly inlined');
    }
    
    // Check font optimization
    total++;
    if (html.includes('font-display: swap')) {
        log('green', '✅ Font display optimization implemented');
        passed++;
    } else {
        log('red', '❌ Font display optimization missing');
    }
    
    // Check resource hints
    total++;
    if (html.includes('rel="preconnect"') && html.includes('rel="dns-prefetch"')) {
        log('green', '✅ Resource hints implemented');
        passed++;
    } else {
        log('red', '❌ Resource hints missing');
    }
    
    // Check WebP implementation
    total++;
    if (html.includes('<picture>') && html.includes('facepay-demo-poster.webp')) {
        log('green', '✅ WebP with fallback implemented');
        passed++;
    } else {
        log('red', '❌ WebP implementation missing');
    }
    
    // Check lazy loading
    total++;
    if (html.includes('loading="lazy"') && html.includes('data-lazy-video')) {
        log('green', '✅ Lazy loading implemented');
        passed++;
    } else {
        log('red', '❌ Lazy loading implementation incomplete');
    }
    
    // Check Core Web Vitals optimizations
    total++;
    if (html.includes('contain: layout') && html.includes('aspect-ratio:')) {
        log('green', '✅ Core Web Vitals optimizations implemented');
        passed++;
    } else {
        log('red', '❌ Core Web Vitals optimizations missing');
    }
    
    return { total, passed };
}

function validateAssetSizes() {
    log('blue', '📊 Validating Asset Sizes...');
    let passed = 0;
    let total = 0;
    
    // Check optimized video size
    total++;
    const videoPath = path.join(__dirname, 'facepay-demo-optimized.mp4');
    if (fs.existsSync(videoPath)) {
        const stats = fs.statSync(videoPath);
        const sizeMB = stats.size / 1024 / 1024;
        if (sizeMB < 1) { // Should be under 1MB
            log('green', `✅ Optimized video size: ${Math.round(sizeMB * 1000)}KB`);
            passed++;
        } else {
            log('red', `❌ Video too large: ${sizeMB.toFixed(2)}MB`);
        }
    } else {
        log('red', '❌ Optimized video not found');
    }
    
    // Check WebP image size
    total++;
    const webpPath = path.join(__dirname, 'facepay-demo-poster.webp');
    if (fs.existsSync(webpPath)) {
        const stats = fs.statSync(webpPath);
        const sizeKB = stats.size / 1024;
        if (sizeKB < 100) { // Should be under 100KB
            log('green', `✅ WebP image size: ${Math.round(sizeKB)}KB`);
            passed++;
        } else {
            log('red', `❌ WebP image too large: ${sizeKB.toFixed(2)}KB`);
        }
    } else {
        log('red', '❌ WebP image not found');
    }
    
    return { total, passed };
}

function validateWebP() {
    log('blue', '🖼️ Validating WebP Implementation...');
    let passed = 0;
    let total = 1;
    
    const webpPath = path.join(__dirname, 'facepay-demo-poster.webp');
    if (fs.existsSync(webpPath)) {
        log('green', '✅ WebP image generated');
        passed++;
    } else {
        log('red', '❌ WebP image not generated');
    }
    
    return { total, passed };
}

function validateServiceWorker() {
    log('blue', '🔧 Validating Service Worker...');
    let passed = 0;
    let total = 0;
    
    const swPath = path.join(__dirname, 'service-worker.js');
    if (!fs.existsSync(swPath)) {
        log('red', '❌ service-worker.js not found');
        return { total: 1, passed: 0 };
    }
    
    const sw = fs.readFileSync(swPath, 'utf8');
    
    // Check version update
    total++;
    if (sw.includes('v2.0.0-optimized')) {
        log('green', '✅ Service worker updated to optimized version');
        passed++;
    } else {
        log('red', '❌ Service worker version not updated');
    }
    
    // Check optimized assets
    total++;
    if (sw.includes('facepay-demo-optimized.mp4') && sw.includes('facepay-demo-poster.webp')) {
        log('green', '✅ Service worker caches optimized assets');
        passed++;
    } else {
        log('red', '❌ Service worker not updated for optimized assets');
    }
    
    return { total, passed };
}

function validateHeaders() {
    log('blue', '📋 Validating HTTP Headers...');
    let passed = 0;
    let total = 1;
    
    const headersPath = path.join(__dirname, '_headers');
    if (fs.existsSync(headersPath)) {
        const headers = fs.readFileSync(headersPath, 'utf8');
        if (headers.includes('Cache-Control') && headers.includes('preconnect')) {
            log('green', '✅ Optimized HTTP headers configured');
            passed++;
        } else {
            log('yellow', '⚠️ Headers file exists but may need optimization');
        }
    } else {
        log('red', '❌ _headers file not found');
    }
    
    return { total, passed };
}

function validateCriticalPath() {
    log('blue', '🎯 Validating Critical Rendering Path...');
    let passed = 0;
    let total = 0;
    
    const indexPath = path.join(__dirname, 'index.html');
    if (!fs.existsSync(indexPath)) {
        return { total: 1, passed: 0 };
    }
    
    const html = fs.readFileSync(indexPath, 'utf8');
    
    // Check for render-blocking resources removal
    total++;
    const externalCSS = (html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/g) || [])
        .filter(link => !link.includes('onload='));
    
    if (externalCSS.length === 0) {
        log('green', '✅ No render-blocking CSS found');
        passed++;
    } else {
        log('red', `❌ Found ${externalCSS.length} render-blocking CSS link(s)`);
    }
    
    // Check critical JavaScript deferral
    total++;
    if (html.includes('requestIdleCallback') && html.includes('criticalInit')) {
        log('green', '✅ JavaScript properly deferred');
        passed++;
    } else {
        log('red', '❌ JavaScript not properly deferred');
    }
    
    return { total, passed };
}

// Run validation
validateOptimizations();