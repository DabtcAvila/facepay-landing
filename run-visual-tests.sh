#!/bin/bash

# FacePay Visual Testing Quick Start Script
# Run comprehensive visual testing automation for facepay.com.mx

set -e

echo "🎨 FacePay Visual Testing Automation"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default URL
URL=${1:-"http://localhost:8000"}
TEST_TYPE=${2:-"full"}

echo -e "${BLUE}Target URL:${NC} $URL"
echo -e "${BLUE}Test Type:${NC} $TEST_TYPE"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
fi

# Check if Playwright browsers are installed
if [ ! -d "node_modules/playwright/.local-browsers" ]; then
    echo -e "${YELLOW}Installing Playwright browsers...${NC}"
    npx playwright install
fi

# Function to check if URL is accessible
check_url() {
    echo -e "${BLUE}Checking if $1 is accessible...${NC}"
    if curl -s --head "$1" | head -n 1 | grep -q "200 OK"; then
        echo -e "${GREEN}✅ URL is accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ URL is not accessible${NC}"
        return 1
    fi
}

# Function to start local server if needed
start_local_server() {
    if [[ $URL == *"localhost"* ]] || [[ $URL == *"127.0.0.1"* ]]; then
        echo -e "${YELLOW}Starting local development server...${NC}"
        
        # Check if we need to build first
        if [ ! -d "dist" ]; then
            echo -e "${YELLOW}Building project...${NC}"
            npm run build
        fi
        
        # Start server in background
        npm run serve > server.log 2>&1 &
        SERVER_PID=$!
        echo -e "${GREEN}Server started (PID: $SERVER_PID)${NC}"
        
        # Wait for server to be ready
        echo -e "${YELLOW}Waiting for server to be ready...${NC}"
        sleep 3
        
        return $SERVER_PID
    fi
    return 0
}

# Function to stop local server
stop_local_server() {
    if [ ! -z "$SERVER_PID" ] && [ "$SERVER_PID" != "0" ]; then
        echo -e "${YELLOW}Stopping local server (PID: $SERVER_PID)...${NC}"
        kill $SERVER_PID 2>/dev/null || true
        # Also kill any http-server processes
        pkill -f http-server 2>/dev/null || true
    fi
}

# Cleanup on exit
cleanup() {
    stop_local_server
    echo -e "${BLUE}Cleanup completed${NC}"
}
trap cleanup EXIT

# Start server if needed
SERVER_PID=0
if [[ $URL == *"localhost"* ]] || [[ $URL == *"127.0.0.1"* ]]; then
    start_local_server
    SERVER_PID=$?
fi

# Check URL accessibility
if ! check_url "$URL"; then
    echo -e "${RED}Cannot proceed with inaccessible URL. Please check your server.${NC}"
    exit 1
fi

echo ""
echo -e "${PURPLE}🚀 Starting Visual Testing Automation...${NC}"
echo ""

# Run tests based on type
case $TEST_TYPE in
    "full")
        echo -e "${BLUE}Running comprehensive visual testing suite...${NC}"
        node tests/visual/visual-testing-orchestrator.js "$URL"
        ;;
    "quick")
        echo -e "${BLUE}Running quick visual tests...${NC}"
        node tests/visual/visual-testing-automation.js "$URL"
        node tests/visual/interactive-elements-testing.js "$URL"
        ;;
    "basic")
        echo -e "${BLUE}Running basic visual tests...${NC}"
        node tests/visual/visual-testing-automation.js "$URL"
        ;;
    "cross-browser")
        echo -e "${BLUE}Running cross-browser tests...${NC}"
        node tests/visual/cross-browser-visual-testing.js "$URL"
        ;;
    "interactive")
        echo -e "${BLUE}Running interactive elements tests...${NC}"
        node tests/visual/interactive-elements-testing.js "$URL"
        ;;
    "journeys")
        echo -e "${BLUE}Running user journey simulation...${NC}"
        node tests/visual/user-journey-simulation.js "$URL"
        ;;
    "regression")
        echo -e "${BLUE}Running visual regression detection...${NC}"
        node tests/visual/visual-regression-detection.js "$URL"
        ;;
    "performance")
        echo -e "${BLUE}Running performance-visual correlation...${NC}"
        node tests/visual/performance-visual-correlation.js "$URL"
        ;;
    *)
        echo -e "${RED}Unknown test type: $TEST_TYPE${NC}"
        echo "Available types: full, quick, basic, cross-browser, interactive, journeys, regression, performance"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Visual testing completed!${NC}"
echo ""

# Show results location
RESULTS_DIR=""
case $TEST_TYPE in
    "full")
        RESULTS_DIR="comprehensive-visual-results"
        ;;
    "basic"|"quick")
        RESULTS_DIR="visual-test-results"
        ;;
    "cross-browser")
        RESULTS_DIR="cross-browser-results"
        ;;
    "interactive")
        RESULTS_DIR="interactive-test-results"
        ;;
    "journeys")
        RESULTS_DIR="user-journey-results"
        ;;
    "regression")
        RESULTS_DIR="visual-regression-results"
        ;;
    "performance")
        RESULTS_DIR="performance-visual-results"
        ;;
esac

if [ ! -z "$RESULTS_DIR" ] && [ -d "$RESULTS_DIR" ]; then
    LATEST_RESULT=$(ls -t "$RESULTS_DIR" | head -n 1)
    if [ ! -z "$LATEST_RESULT" ]; then
        echo -e "${BLUE}📊 Results available in:${NC}"
        echo "   Directory: $RESULTS_DIR/$LATEST_RESULT/"
        
        # Check for HTML report
        HTML_REPORT=""
        if [ -f "$RESULTS_DIR/$LATEST_RESULT/comprehensive-visual-report.html" ]; then
            HTML_REPORT="$RESULTS_DIR/$LATEST_RESULT/comprehensive-visual-report.html"
        elif [ -f "$RESULTS_DIR/$LATEST_RESULT/visual-test-report.html" ]; then
            HTML_REPORT="$RESULTS_DIR/$LATEST_RESULT/visual-test-report.html"
        elif [ -f "$RESULTS_DIR/$LATEST_RESULT/cross-browser-report.html" ]; then
            HTML_REPORT="$RESULTS_DIR/$LATEST_RESULT/cross-browser-report.html"
        elif [ -f "$RESULTS_DIR/$LATEST_RESULT/interactive-test-report.html" ]; then
            HTML_REPORT="$RESULTS_DIR/$LATEST_RESULT/interactive-test-report.html"
        elif [ -f "$RESULTS_DIR/$LATEST_RESULT/user-journey-report.html" ]; then
            HTML_REPORT="$RESULTS_DIR/$LATEST_RESULT/user-journey-report.html"
        elif [ -f "$RESULTS_DIR/$LATEST_RESULT/regression-report.html" ]; then
            HTML_REPORT="$RESULTS_DIR/$LATEST_RESULT/regression-report.html"
        elif [ -f "$RESULTS_DIR/$LATEST_RESULT/performance-visual-report.html" ]; then
            HTML_REPORT="$RESULTS_DIR/$LATEST_RESULT/performance-visual-report.html"
        fi
        
        if [ ! -z "$HTML_REPORT" ]; then
            echo "   HTML Report: $HTML_REPORT"
            echo ""
            echo -e "${YELLOW}💡 Open the HTML report in your browser to view detailed results!${NC}"
            
            # Try to open in default browser (macOS)
            if command -v open &> /dev/null; then
                read -p "Open HTML report now? (y/N): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    open "$HTML_REPORT"
                fi
            fi
        fi
        
        # Check for summary
        if [ -f "$RESULTS_DIR/$LATEST_RESULT/VISUAL_TESTING_SUMMARY.md" ]; then
            echo ""
            echo -e "${BLUE}📝 Quick Summary:${NC}"
            head -20 "$RESULTS_DIR/$LATEST_RESULT/VISUAL_TESTING_SUMMARY.md"
        fi
    fi
fi

echo ""
echo -e "${GREEN}✨ FacePay Visual Testing Complete!${NC}"
echo -e "${BLUE}   You now have comprehensive visual validation for facepay.com.mx${NC}"
echo -e "${BLUE}   Run this script regularly to ensure perfect visual presentation${NC}"