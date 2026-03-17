# 📸 Screenshots Guide

This guide helps you capture screenshots of the application for documentation purposes.

## Quick Start (Automated Helper)

Use the interactive screenshot capture helper:

```bash
# Make sure services are running
make up

# Run the screenshot helper (opens URLs and guides you step-by-step)
make capture-screenshots
```

The helper script will:
- Check if services are running (starts them if needed)
- Open each page in your browser automatically
- Guide you through capturing each screenshot with prompts
- Tell you exactly what to capture and where to save it

## Required Screenshots

To enhance the documentation, capture the following screenshots:

### 1. Main Interface (Home Page)
**Filename:** `home-interface.png`
- Open http://localhost:8080
- Show the clean interface with upload area
- Capture the full browser window

### 2. Document Upload (Drag & Drop)
**Filename:** `upload-dragdrop.png`
- Hover a document over the upload area
- Show the drop zone highlight effect
- Capture the moment before dropping

### 3. Service Selection
**Filename:** `service-selection.png`
- Show the radio buttons for selecting service:
  - Document Intelligence
  - Content Understanding
- Highlight the selection UI

### 4. Analysis in Progress
**Filename:** `analysis-progress.png`
- After clicking "Analyze Document"
- Show loading state/spinner
- Show "Analyzing..." message

### 5. Results View (Split Panel)
**Filename:** `results-view.png`
- Show complete results page with:
  - Left panel: Original document preview
  - Right panel: JSON results viewer
- Use a real document with interesting results

### 6. JSON Results Detail
**Filename:** `json-results-detail.png`
- Zoom into the JSON viewer panel
- Show structured data extraction
- Highlight key-value pairs, tables, or extracted content

### 7. Document Preview
**Filename:** `document-preview.png`
- Zoom into the document preview panel
- Show a clear document rendering
- Demonstrate the preview quality

### 8. API Documentation (Swagger UI)
**Filename:** `api-docs.png`
- Open http://localhost:8800/docs
- Show the FastAPI Swagger interface
- Expand at least one endpoint

## How to Capture Screenshots

### On Linux/macOS
```bash
# Using screenshot tool
gnome-screenshot -w  # Screenshot current window
gnome-screenshot -a  # Screenshot selected area

# Or using browser DevTools
# F12 → Cmd/Ctrl+Shift+P → "Capture screenshot"
```

### On Windows
```bash
# Using Snipping Tool
Win + Shift + S

# Or browser DevTools
# F12 → Ctrl+Shift+P → "Capture screenshot"
```

### On WSL with Browser
- Use Windows Snipping Tool (Win + Shift + S)
- Browser is running on Windows, so use Windows screenshot tools

## Screenshot Specifications

- **Format:** PNG (recommended) or JPEG
- **Resolution:** At least 1920x1080 for full-window shots
- **Browser:** Use Chrome or Edge for consistent rendering
- **Zoom Level:** 100% (default browser zoom)
- **Dark Mode:** Use light mode for better visibility in documentation
- **Clean State:** Remove personal data, use example documents only

## Test Documents

Use test documents from:
- `samples/test/` - Test documents for screenshots
- `samples/training/docIntelligence/` - Sample forms

**Recommended test document:**
- PDF invoice or receipt
- Form with tables and key-value pairs
- Multi-page document showing pagination

## After Capturing

1. Save screenshots to `docs/images/` directory
2. Use descriptive filenames (see list above)
3. Optimize file size if needed:
   ```bash
   # Using ImageMagick (optional)
   convert original.png -quality 85 optimized.png
   ```
4. Git add and commit images:
   ```bash
   git add docs/images/*.png
   git commit -m "docs: Add application screenshots"
   ```

## Usage in Documentation

Reference screenshots in markdown:
```markdown
![Home Interface](docs/images/home-interface.png)
![Results View](docs/images/results-view.png)
```

## Running the App for Screenshots

```bash
# 1. Start services
make up

# 2. Wait for services to be ready
make ps

# 3. Open browser
open http://localhost:8080  # macOS
xdg-open http://localhost:8080  # Linux

# 4. Upload a test document and capture screenshots

# 5. Stop services when done
make down
```

## Tips for Best Screenshots

✅ **Do:**
- Use real analysis results for authenticity
- Keep the interface clean and uncluttered
- Show successful states (green checkmarks, completed analysis)
- Capture at high resolution
- Use consistent browser window size

❌ **Don't:**
- Include personal information or real documents
- Show error states in main screenshots (use separate troubleshooting docs)
- Crop too tightly - show context
- Use busy backgrounds behind the browser

## Example Screenshot Workflow

```bash
# Complete workflow for getting good screenshots:

# 1. Deploy Azure infrastructure
make deploy-infra

# 2. Setup local environment
make setup
make setup-local

# 3. Start services
make up

# 4. Wait for ready state
sleep 10

# 5. Open in browser
# Navigate to http://localhost:8080

# 6. Test the upload flow:
#    a. Initial interface → Screenshot #1
#    b. Hover document → Screenshot #2
#    c. After upload, select service → Screenshot #3
#    d. Click analyze → Screenshot #4
#    e. View results → Screenshot #5
#    f. Explore JSON details → Screenshot #6

# 7. Open API docs
# Navigate to http://localhost:8800/docs → Screenshot #8

# 8. Stop services
make down
```

---

**Once you have the screenshots, they'll automatically be displayed in the README!** 🎉
