#!/bin/bash

# Screenshot Helper Script
# This script helps you capture screenshots by opening the right URLs and providing prompts

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Screenshot Capture Helper                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if services are running
echo -e "${YELLOW}Checking if services are running...${NC}"
if ! curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Services not running. Starting them now...${NC}"
    make up
    echo -e "${YELLOW}Waiting for services to start...${NC}"
    sleep 10
fi

echo -e "${GREEN}✓ Services are running!${NC}"
echo ""

# Detect OS and set open command
if [[ "$OSTYPE" == "darwin"* ]]; then
    OPEN_CMD="open"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OPEN_CMD="xdg-open"
else
    OPEN_CMD="start"
fi

# Screenshot capture workflow
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Screenshot Capture Workflow${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""

# Screenshot 1: Home Interface
echo -e "${YELLOW}[1/8] Home Interface${NC}"
echo "      Opening main application..."
$OPEN_CMD "http://localhost:8080" 2>/dev/null || echo "Open http://localhost:8080 manually"
echo ""
echo "      📸 Capture: Clean interface with upload area"
echo "      💾 Save as: docs/images/home-interface.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Screenshot 2: Upload drag-drop
echo -e "${YELLOW}[2/8] Document Upload (Drag & Drop)${NC}"
echo "      Hover a test document over the upload area"
echo ""
echo "      📸 Capture: Drop zone highlight effect"
echo "      💾 Save as: docs/images/upload-dragdrop.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Screenshot 3: Service Selection
echo -e "${YELLOW}[3/8] Service Selection${NC}"
echo "      Show the radio buttons for service selection"
echo ""
echo "      📸 Capture: Document Intelligence / Content Understanding selection"
echo "      💾 Save as: docs/images/service-selection.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Screenshot 4: Analysis Progress
echo -e "${YELLOW}[4/8] Analysis in Progress${NC}"
echo "      Click 'Analyze Document' button"
echo ""
echo "      📸 Capture: Loading state with spinner"
echo "      💾 Save as: docs/images/analysis-progress.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Screenshot 5: Results View
echo -e "${YELLOW}[5/8] Results View (Split Panel)${NC}"
echo "      Wait for analysis to complete"
echo ""
echo "      📸 Capture: Full results page with document preview + JSON"
echo "      💾 Save as: docs/images/results-view.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Screenshot 6: JSON Detail
echo -e "${YELLOW}[6/8] JSON Results Detail${NC}"
echo "      Zoom into the JSON viewer panel"
echo ""
echo "      📸 Capture: Close-up of structured data"
echo "      💾 Save as: docs/images/json-results-detail.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Screenshot 7: Document Preview
echo -e "${YELLOW}[7/8] Document Preview${NC}"
echo "      Zoom into the document preview panel"
echo ""
echo "      📸 Capture: Document rendering quality"
echo "      💾 Save as: docs/images/document-preview.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Screenshot 8: API Documentation
echo -e "${YELLOW}[8/8] API Documentation (Swagger UI)${NC}"
echo "      Opening API documentation..."
$OPEN_CMD "http://localhost:8800/docs" 2>/dev/null || echo "Open http://localhost:8800/docs manually"
echo ""
echo "      📸 Capture: FastAPI Swagger interface (expand one endpoint)"
echo "      💾 Save as: docs/images/api-docs.png"
echo ""
read -p "      Press ENTER when screenshot is captured..."
echo ""

# Complete
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      Screenshot Capture Complete!                         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Optimize images (optional):"
echo "     cd docs/images"
echo "     # Use an image optimizer if needed"
echo ""
echo "  2. Verify all screenshots are present:"
echo "     ls -lh docs/images/*.png"
echo ""
echo "  3. Add to git:"
echo "     git add docs/images/*.png"
echo "     git commit -m 'docs: Add application screenshots'"
echo ""
echo -e "${YELLOW}📝 See docs/SCREENSHOTS.md for more details${NC}"
echo ""
