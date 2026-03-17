# Documentation Images

This directory contains screenshots and images used in the project documentation.

## Required Screenshots

To complete the documentation, capture and add the following screenshots:

- [ ] `home-interface.png` - Main application interface with upload area
- [ ] `upload-dragdrop.png` - Document drag-and-drop in action
- [ ] `service-selection.png` - Service selection UI (Document Intelligence vs Content Understanding)
- [ ] `analysis-progress.png` - Analysis in progress state
- [ ] `results-view.png` - Split view with document preview and JSON results
- [ ] `json-results-detail.png` - Close-up of JSON structured data
- [ ] `document-preview.png` - Document preview panel detail
- [ ] `api-docs.png` - FastAPI Swagger UI documentation

## How to Capture Screenshots

See [SCREENSHOTS.md](../SCREENSHOTS.md) for detailed instructions on:
- Running the application locally
- Capturing screenshots at the right moments
- Image specifications and requirements
- Optimizing and adding images to the repository

## Quick Start for Screenshots

```bash
# 1. Start the application
make deploy-infra  # Deploy Azure resources
make setup         # Auto-configure environment
make setup-local   # Copy to API services
make up            # Start services

# 2. Open browser to http://localhost:8080

# 3. Upload a test document from samples/test/

# 4. Capture screenshots at each step

# 5. Save images to this directory

# 6. Commit images
git add docs/images/*.png
git commit -m "docs: Add application screenshots"
```

## Image Guidelines

- **Format:** PNG (preferred) or high-quality JPEG
- **Resolution:** Minimum 1920x1080 for full-window captures
- **File Size:** Optimize to keep under 500KB per image
- **Naming:** Use descriptive kebab-case filenames
- **Content:** No personal data or real documents

## Current Status

🚧 **Screenshots needed** - Run the application and capture screenshots to complete the visual documentation!

Once added, these images will automatically appear in:
- Main README.md
- Documentation pages
- GitHub repository preview

---

📖 See [SCREENSHOTS.md](../SCREENSHOTS.md) for the complete guide.
