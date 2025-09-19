#!/bin/bash

# FacePay Production Deployment Script - Bulletproof Launch
# Complete optimization and deployment pipeline

set -e  # Exit on any error

echo "🚀 FacePay Production Deployment Starting..."
echo "=================================================="

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="facepay-landing"
BUILD_DIR="dist"
NODE_MIN_VERSION="16"
LIGHTHOUSE_MIN_SCORE=90

# Utility functions
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Pre-flight checks
echo -e "\n${BLUE}🔍 Running pre-flight checks...${NC}"

# Check Node.js version
node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt "$NODE_MIN_VERSION" ]; then
    log_error "Node.js version $NODE_MIN_VERSION or higher required. Found: $(node --version)"
    exit 1
fi
log_success "Node.js version check passed: $(node --version)"

# Check npm availability
if ! command -v npm &> /dev/null; then
    log_error "npm is required but not installed"
    exit 1
fi
log_success "npm check passed"

# Check required files
required_files=("package.json" "webpack.config.js" "index.html" "vercel.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        log_error "Required file missing: $file"
        exit 1
    fi
done
log_success "Required files check passed"

# Environment setup
echo -e "\n${BLUE}🔧 Setting up environment...${NC}"

# Clean previous builds
if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    log_success "Cleaned previous build directory"
fi

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false
log_success "Dependencies installed"

# Run production optimizer
echo -e "\n${BLUE}⚡ Running production optimization...${NC}"
if [ -f "production-optimizer.js" ]; then
    node production-optimizer.js
    log_success "Production optimization completed"
else
    log_warning "Production optimizer not found, skipping"
fi

# Build for production
echo -e "\n${BLUE}🏗️  Building for production...${NC}"
export NODE_ENV=production
npm run build
log_success "Production build completed"

# Verify build
if [ ! -d "$BUILD_DIR" ]; then
    log_error "Build directory not found after build"
    exit 1
fi

build_size=$(du -sh "$BUILD_DIR" | cut -f1)
log_success "Build size: $build_size"

# Security checks
echo -e "\n${BLUE}🔒 Running security checks...${NC}"

# Check for security vulnerabilities
echo "Running npm audit..."
if npm audit --audit-level high; then
    log_success "No high-severity vulnerabilities found"
else
    log_warning "Security vulnerabilities detected, please review"
fi

# Check for sensitive files in build
sensitive_patterns=("\.env" "\.key" "password" "secret" "private")
for pattern in "${sensitive_patterns[@]}"; do
    if find "$BUILD_DIR" -name "*$pattern*" -type f | grep -q .; then
        log_error "Sensitive files found in build directory matching pattern: $pattern"
        exit 1
    fi
done
log_success "Sensitive files check passed"

# Performance testing
echo -e "\n${BLUE}📊 Running performance tests...${NC}"

# Start local server for testing
echo "Starting local server for testing..."
npm run serve &
SERVER_PID=$!
sleep 5

# Wait for server to be ready
for i in {1..10}; do
    if curl -s http://localhost:8000 > /dev/null; then
        break
    fi
    if [ $i -eq 10 ]; then
        log_error "Local server failed to start"
        kill $SERVER_PID
        exit 1
    fi
    sleep 2
done
log_success "Local server started"

# Run Lighthouse audit
if command -v lighthouse &> /dev/null; then
    echo "Running Lighthouse audit..."
    lighthouse http://localhost:8000 \
        --output=json \
        --output=html \
        --output-path=./lighthouse-results \
        --chrome-flags="--headless --no-sandbox" \
        --quiet
    
    # Parse Lighthouse results
    if [ -f "lighthouse-results.json" ]; then
        performance_score=$(node -e "console.log(JSON.parse(require('fs').readFileSync('lighthouse-results.json')).categories.performance.score * 100)")
        accessibility_score=$(node -e "console.log(JSON.parse(require('fs').readFileSync('lighthouse-results.json')).categories.accessibility.score * 100)")
        best_practices_score=$(node -e "console.log(JSON.parse(require('fs').readFileSync('lighthouse-results.json')).categories['best-practices'].score * 100)")
        seo_score=$(node -e "console.log(JSON.parse(require('fs').readFileSync('lighthouse-results.json')).categories.seo.score * 100)")
        pwa_score=$(node -e "console.log(JSON.parse(require('fs').readFileSync('lighthouse-results.json')).categories.pwa.score * 100)")
        
        echo "Lighthouse Scores:"
        echo "  Performance: $performance_score"
        echo "  Accessibility: $accessibility_score"
        echo "  Best Practices: $best_practices_score"
        echo "  SEO: $seo_score"
        echo "  PWA: $pwa_score"
        
        # Check minimum scores
        scores=($performance_score $accessibility_score $best_practices_score $seo_score)
        for score in "${scores[@]}"; do
            if (( $(echo "$score < $LIGHTHOUSE_MIN_SCORE" | bc -l) )); then
                log_warning "Lighthouse score below minimum ($LIGHTHOUSE_MIN_SCORE): $score"
            fi
        done
        
        log_success "Lighthouse audit completed"
    else
        log_warning "Lighthouse results not found"
    fi
else
    log_warning "Lighthouse not installed, skipping performance audit"
fi

# Stop local server
kill $SERVER_PID
log_success "Local server stopped"

# Bundle analysis
echo -e "\n${BLUE}📦 Analyzing bundle...${NC}"
if npm run build:analyze; then
    log_success "Bundle analysis completed"
else
    log_warning "Bundle analysis failed"
fi

# Compression verification
echo -e "\n${BLUE}🗜️  Verifying compression...${NC}"

# Check for compressed files
compressed_files=0
total_files=0

while IFS= read -r -d '' file; do
    total_files=$((total_files + 1))
    if [[ "$file" == *.br ]] || [[ "$file" == *.gz ]]; then
        compressed_files=$((compressed_files + 1))
    fi
done < <(find "$BUILD_DIR" -type f -print0)

compression_ratio=$((compressed_files * 100 / total_files))
echo "Compression ratio: $compression_ratio% ($compressed_files/$total_files files)"

if [ $compression_ratio -gt 50 ]; then
    log_success "Good compression ratio achieved"
else
    log_warning "Low compression ratio, consider optimizing more files"
fi

# PWA verification
echo -e "\n${BLUE}📱 Verifying PWA setup...${NC}"

# Check manifest.json
if [ -f "$BUILD_DIR/manifest.json" ]; then
    if node -e "JSON.parse(require('fs').readFileSync('$BUILD_DIR/manifest.json'))" 2>/dev/null; then
        log_success "Valid manifest.json found"
    else
        log_error "Invalid manifest.json"
        exit 1
    fi
else
    log_error "manifest.json not found"
    exit 1
fi

# Check service worker
if [ -f "$BUILD_DIR/service-worker.js" ] || [ -f "$BUILD_DIR/sw.js" ]; then
    log_success "Service worker found"
else
    log_warning "Service worker not found"
fi

# Check icons
icon_count=$(find "$BUILD_DIR" -name "*icon*" -type f | wc -l)
if [ $icon_count -gt 0 ]; then
    log_success "PWA icons found ($icon_count files)"
else
    log_warning "No PWA icons found"
fi

# SEO verification
echo -e "\n${BLUE}🎯 Verifying SEO setup...${NC}"

# Check sitemap
if [ -f "$BUILD_DIR/sitemap.xml" ]; then
    log_success "Sitemap found"
else
    log_warning "Sitemap not found"
fi

# Check robots.txt
if [ -f "$BUILD_DIR/robots.txt" ]; then
    log_success "Robots.txt found"
else
    log_warning "Robots.txt not found"
fi

# Security headers verification
echo -e "\n${BLUE}🛡️  Verifying security configuration...${NC}"

# Check Vercel configuration
if [ -f "vercel.json" ]; then
    if grep -q "Strict-Transport-Security" vercel.json; then
        log_success "HSTS header configured"
    else
        log_warning "HSTS header not found in vercel.json"
    fi
    
    if grep -q "Content-Security-Policy" vercel.json; then
        log_success "CSP header configured"
    else
        log_warning "CSP header not found in vercel.json"
    fi
    
    if grep -q "X-Frame-Options" vercel.json; then
        log_success "X-Frame-Options header configured"
    else
        log_warning "X-Frame-Options header not found in vercel.json"
    fi
else
    log_warning "vercel.json not found"
fi

# Deployment preparation
echo -e "\n${BLUE}🚀 Preparing for deployment...${NC}"

# Create deployment info
cat > "$BUILD_DIR/deployment-info.json" << EOF
{
    "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "version": "$(node -e "console.log(require('./package.json').version)")",
    "git_commit": "$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')",
    "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')",
    "build_size": "$build_size",
    "node_version": "$(node --version)",
    "npm_version": "$(npm --version)"
}
EOF
log_success "Deployment info created"

# Create performance budget report
cat > "$BUILD_DIR/performance-budget.json" << EOF
{
    "budget": {
        "maxAssetSize": "100kb",
        "maxEntrypointSize": "100kb",
        "maxBundleSize": "500kb"
    },
    "actual": {
        "buildSize": "$build_size",
        "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    }
}
EOF
log_success "Performance budget report created"

# Final checks
echo -e "\n${BLUE}🔍 Final verification...${NC}"

# Check critical files exist in build
critical_files=("index.html" "manifest.json")
for file in "${critical_files[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        log_error "Critical file missing from build: $file"
        exit 1
    fi
done
log_success "Critical files verification passed"

# Check HTML validity (basic)
if command -v tidy &> /dev/null; then
    if tidy -q -errors "$BUILD_DIR/index.html"; then
        log_success "HTML validation passed"
    else
        log_warning "HTML validation issues detected"
    fi
else
    log_warning "HTML validation skipped (tidy not available)"
fi

# Create deployment summary
echo -e "\n${GREEN}=================================================="
echo "🎉 DEPLOYMENT READY - BULLETPROOF PRODUCTION"
echo "==================================================${NC}"

echo -e "\n${BLUE}📊 Summary:${NC}"
echo "  Project: $PROJECT_NAME"
echo "  Build size: $build_size"
echo "  Build directory: $BUILD_DIR"
echo "  Compression ratio: $compression_ratio%"
echo "  Node version: $(node --version)"
echo "  Git commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"

if [ -f "lighthouse-results.json" ]; then
    echo -e "\n${BLUE}🏆 Lighthouse Scores:${NC}"
    echo "  Performance: ${performance_score:-'N/A'}"
    echo "  Accessibility: ${accessibility_score:-'N/A'}"
    echo "  Best Practices: ${best_practices_score:-'N/A'}"
    echo "  SEO: ${seo_score:-'N/A'}"
    echo "  PWA: ${pwa_score:-'N/A'}"
fi

echo -e "\n${BLUE}🚀 Deployment Commands:${NC}"
echo "  Vercel: vercel --prod"
echo "  Netlify: netlify deploy --prod --dir=$BUILD_DIR"
echo "  Firebase: firebase deploy"
echo "  Manual: Upload $BUILD_DIR contents to your web server"

echo -e "\n${GREEN}✅ FacePay is ready for bulletproof production deployment!${NC}"
echo -e "${GREEN}🎯 Optimized for maximum performance and security${NC}"

# Optional: Auto-deploy to Vercel if requested
if [ "$1" == "--deploy" ]; then
    echo -e "\n${BLUE}🚀 Deploying to Vercel...${NC}"
    if command -v vercel &> /dev/null; then
        vercel --prod
        log_success "Deployed to Vercel"
    else
        log_error "Vercel CLI not found. Install with: npm i -g vercel"
        exit 1
    fi
fi

echo -e "\n${BLUE}📝 Next steps:${NC}"
echo "1. Review lighthouse-results.html for detailed performance metrics"
echo "2. Deploy using your preferred method"
echo "3. Set up monitoring and analytics"
echo "4. Configure CDN and domain"
echo "5. Enable HTTPS and security headers"

exit 0