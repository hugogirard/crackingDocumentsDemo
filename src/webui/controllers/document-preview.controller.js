/**
 * Manages document preview panel with annotation overlay
 */
class DocumentPreviewController {
    constructor() {
        this.previewContainer = document.getElementById('documentPreview');
        this.panel = document.getElementById('previewPanel');
        this.collapseBtn = document.getElementById('collapsePreviewBtn');
        this.zoomInBtn = document.getElementById('zoomInBtn');
        this.zoomOutBtn = document.getElementById('zoomOutBtn');
        this.zoomResetBtn = document.getElementById('zoomResetBtn');
        this.openInWindowBtn = document.getElementById('openInWindowBtn');
        this.zoomLevelText = document.getElementById('zoomLevel');
        this.currentFile = null;
        this.documentDataUrl = null;
        this.analysisData = null;
        this.imageElement = null;
        this.canvasElement = null;
        this.overlayContainer = null;
        this.zoomLevel = 1.0;
        this.minZoom = 0.25;
        this.maxZoom = 3.0;
        this.zoomStep = 0.25;

        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.collapseBtn.addEventListener('click', () => this._handleCollapse());
        this.zoomInBtn.addEventListener('click', () => this._zoomIn());
        this.zoomOutBtn.addEventListener('click', () => this._zoomOut());
        this.zoomResetBtn.addEventListener('click', () => this._zoomReset());
        this.openInWindowBtn.addEventListener('click', () => this._openInNewWindow());
        
        // Add click handler to collapsed label to reopen panel
        const collapsedLabel = this.panel.querySelector('.collapsed-label-right');
        if (collapsedLabel) {
            collapsedLabel.addEventListener('click', () => {
                if (this.panel.classList.contains('collapsed')) {
                    this._handleCollapse();
                }
            });
        }
    }

    setDocument(file) {
        this.currentFile = file;
        this.analysisData = null; // Reset analysis data
        this.zoomLevel = 1.0; // Reset zoom
        this._updateZoomDisplay();
        
        // Hide the empty state placeholder
        const placeholder = this.previewContainer.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Clear any existing preview content
        this._clearPreview();

        const reader = new FileReader();
        reader.onload = (e) => {
            this.documentDataUrl = e.target.result; // Store for opening in new window
            
            if (file.type === 'application/pdf') {
                this._createPdfPreview(e.target.result);
                // Enable zoom for PDFs
                this._enableZoomControls();
            } else if (file.type.startsWith('image/')) {
                this._createImagePreview(e.target.result);
                // Enable zoom for images
                this._enableZoomControls();
            }
            
            // Enable open in window button
            this.openInWindowBtn?.removeAttribute('disabled');
        };

        reader.readAsDataURL(file);
    }

    /**
     * Create PDF preview with zoom support
     * @param {string} pdfDataUrl - PDF data URL
     */
    _createPdfPreview(pdfDataUrl) {
        // Create container for zoom support
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.className = 'preview-overlay-container pdf-container clickable-preview';
        this.overlayContainer.title = 'Click to open in new window for better quality';
        
        // Create iframe element
        const iframe = document.createElement('iframe');
        iframe.src = pdfDataUrl;
        iframe.className = 'preview-pdf';
        
        // Add click handler to open in new window
        this.overlayContainer.addEventListener('click', () => this._openInNewWindow());
        
        this.overlayContainer.appendChild(iframe);
        this.previewContainer.appendChild(this.overlayContainer);
    }

    /**
     * Create image preview with overlay container
     * @param {string} imageDataUrl - Image data URL
     */
    _createImagePreview(imageDataUrl) {
        // Create container for image and overlay
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.className = 'preview-overlay-container clickable-preview';
        this.overlayContainer.title = 'Click to open in new window for better quality';
        
        // Create image element
        this.imageElement = document.createElement('img');
        this.imageElement.src = imageDataUrl;
        this.imageElement.alt = 'Document preview';
        this.imageElement.className = 'preview-image';
        
        // Create canvas for annotations
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.className = 'preview-canvas';
        
        // Add click handler to open in new window (on image, not canvas)
        this.imageElement.addEventListener('click', () => this._openInNewWindow());
        
        // Wait for image to load before setting canvas dimensions
        this.imageElement.onload = () => {
            this._updateCanvasSize();
            if (this.analysisData) {
                this._drawAnnotations();
            }
        };

        // Add resize observer to handle window resizing
        const resizeObserver = new ResizeObserver(() => {
            if (this.imageElement?.complete) {
                this._updateCanvasSize();
                if (this.analysisData) {
                    this._drawAnnotations();
                }
            }
        });
        resizeObserver.observe(this.imageElement);
        
        this.overlayContainer.appendChild(this.imageElement);
        this.overlayContainer.appendChild(this.canvasElement);
        this.previewContainer.appendChild(this.overlayContainer);
    }

    /**
     * Update canvas size to match image dimensions
     */
    _updateCanvasSize() {
        if (!this.imageElement || !this.canvasElement) return;
        
        // Set canvas to exact image size
        this.canvasElement.width = this.imageElement.naturalWidth || this.imageElement.width;
        this.canvasElement.height = this.imageElement.naturalHeight || this.imageElement.height;
        
        // Match the displayed size
        this.canvasElement.style.width = this.imageElement.width + 'px';
        this.canvasElement.style.height = this.imageElement.height + 'px';
    }

    /**
     * Zoom in
     */
    _zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
            this._applyZoom();
        }
    }

    /**
     * Zoom out
     */
    _zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
            this._applyZoom();
        }
    }

    /**
     * Reset zoom to 100%
     */
    _zoomReset() {
        this.zoomLevel = 1.0;
        this._applyZoom();
    }

    /**
     * Apply zoom to the preview container
     */
    _applyZoom() {
        if (this.overlayContainer) {
            this.overlayContainer.style.transform = `scale(${this.zoomLevel})`;
            this._updateCanvasSize();
            if (this.analysisData) {
                this._drawAnnotations();
            }
        }
        this._updateZoomDisplay();
    }

    /**
     * Update zoom display and button states
     */
    _updateZoomDisplay() {
        if (this.zoomLevelText) {
            this.zoomLevelText.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }
        
        // Update button states
        if (this.zoomOutBtn) {
            if (this.zoomLevel <= this.minZoom) {
                this.zoomOutBtn.setAttribute('disabled', '');
            } else {
                this.zoomOutBtn.removeAttribute('disabled');
            }
        }
        
        if (this.zoomInBtn) {
            if (this.zoomLevel >= this.maxZoom) {
                this.zoomInBtn.setAttribute('disabled', '');
            } else {
                this.zoomInBtn.removeAttribute('disabled');
            }
        }
    }

    /**
     * Enable zoom controls
     */
    _enableZoomControls() {
        this.zoomInBtn?.removeAttribute('disabled');
        this.zoomOutBtn?.removeAttribute('disabled');
        this.zoomResetBtn?.removeAttribute('disabled');
        this._updateZoomDisplay();
    }

    /**
     * Disable zoom controls
     */
    _disableZoomControls() {
        this.zoomInBtn?.setAttribute('disabled', '');
        this.zoomOutBtn?.setAttribute('disabled', '');
        this.zoomResetBtn?.setAttribute('disabled', '');
        this.openInWindowBtn?.setAttribute('disabled', '');
    }

    /**
     * Open document in a new window with better quality
     */
    _openInNewWindow() {
        if (!this.documentDataUrl || !this.currentFile) return;

        const fileName = this.currentFile.name;
        const fileType = this.currentFile.type;
        
        // Calculate window size (80% of screen)
        const width = Math.floor(window.screen.width * 0.8);
        const height = Math.floor(window.screen.height * 0.8);
        const left = Math.floor((window.screen.width - width) / 2);
        const top = Math.floor((window.screen.height - height) / 2);
        
        // Open new window
        const newWindow = window.open(
            '',
            '_blank',
            `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,status=yes`
        );
        
        if (newWindow) {
            // Write HTML content to new window
            newWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${fileName}</title>
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background: #2b2b2b;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            min-height: 100vh;
                            font-family: 'Segoe UI', sans-serif;
                        }
                        .container {
                            width: 100%;
                            height: 100vh;
                            display: flex;
                            flex-direction: column;
                        }
                        .header {
                            background: #1e1e1e;
                            color: #fff;
                            padding: 1rem;
                            border-bottom: 2px solid #0078d4;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        }
                        .filename {
                            font-size: 1rem;
                            font-weight: 600;
                        }
                        .content {
                            flex: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            overflow: auto;
                            padding: 20px;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                            border-radius: 4px;
                            background: white;
                        }
                        iframe {
                            width: 100%;
                            height: 100%;
                            border: none;
                            background: white;
                            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="filename">${fileName}</div>
                        </div>
                        <div class="content">
                            ${fileType.startsWith('image/') ? 
                                `<img src="${this.documentDataUrl}" alt="${fileName}">` :
                                `<iframe src="${this.documentDataUrl}"></iframe>`
                            }
                        </div>
                    </div>
                </body>
                </html>
            `);
            newWindow.document.close();
        } else {
            NotificationService.show('Please allow pop-ups to open the document in a new window', 'warning');
        }
    }

    /**
     * Set analysis data and draw annotations
     * @param {Object} data - Analysis result with fields and bounding regions
     */
    setAnalysisData(data) {
        this.analysisData = data;
        if (this.imageElement?.complete && this.canvasElement) {
            this._drawAnnotations();
        }
    }

    /**
     * Set analysis data and draw annotations
     * @param {Object} data - Analysis result with fields and bounding regions
     */
    setAnalysisData(data) {
        this.analysisData = data;
        if (this.imageElement?.complete && this.canvasElement) {
            this._drawAnnotations();
        }
    }

    /**
     * Draw annotations on the canvas
     */
    _drawAnnotations() {
        if (!this.analysisData?.fields || !this.canvasElement) return;

        const ctx = this.canvasElement.getContext('2d');
        ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        // Assume standard page dimensions (8.5" x 11" for US Letter)
        const pageWidthInches = 8.5;
        const pageHeightInches = 11;

        // Calculate scale factors
        const scaleX = this.canvasElement.width / pageWidthInches;
        const scaleY = this.canvasElement.height / pageHeightInches;

        // Array of colors for different fields
        const colors = [
            '#0078d4', '#8764b8', '#00a4ef', '#00cc6a', '#ffb900',
            '#d83b01', '#e3008c', '#00b7c3', '#498205', '#ea4300'
        ];
        let colorIndex = 0;

        // Draw each field
        Object.entries(this.analysisData.fields).forEach(([fieldName, fieldData]) => {
            if (!fieldData.bounding_regions || fieldData.bounding_regions.length === 0) return;

            const color = colors[colorIndex % colors.length];
            colorIndex++;

            // Draw each bounding region for this field
            fieldData.bounding_regions.forEach(region => {
                if (!region.polygon || region.polygon.length < 6) return;

                // Convert polygon coordinates to pixels
                const points = [];
                for (let i = 0; i < region.polygon.length; i += 2) {
                    points.push({
                        x: region.polygon[i] * scaleX,
                        y: region.polygon[i + 1] * scaleY
                    });
                }

                // Draw polygon
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.closePath();

                // Fill with semi-transparent color
                ctx.fillStyle = color + '20';
                ctx.fill();

                // Stroke with solid color
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Draw label with field name and confidence
                const labelX = points[0].x;
                const labelY = points[0].y - 5;
                const label = `${fieldName} (${Math.round(fieldData.confidence * 100)}%)`;

                // Measure text for background
                ctx.font = 'bold 12px Segoe UI, sans-serif';
                const textMetrics = ctx.measureText(label);
                const padding = 4;
                const labelWidth = textMetrics.width + padding * 2;
                const labelHeight = 18;

                // Draw label background
                ctx.fillStyle = color;
                ctx.fillRect(
                    labelX - padding,
                    labelY - labelHeight + padding,
                    labelWidth,
                    labelHeight
                );

                // Draw label text
                ctx.fillStyle = '#ffffff';
                ctx.textBaseline = 'top';
                ctx.fillText(label, labelX, labelY - labelHeight + padding + 2);
            });
        });
    }

    /**
     * Clear all preview content
     */
    _clearPreview() {
        const existingContent = this.previewContainer.querySelectorAll('iframe, img, .preview-overlay-container, .pdf-container');
        existingContent.forEach(el => el.remove());
        this.imageElement = null;
        this.canvasElement = null;
        this.overlayContainer = null;
    }

    _handleCollapse() {
        this.panel.classList.toggle('collapsed');
    }

    reset() {
        this.currentFile = null;
        this.documentDataUrl = null;
        this.analysisData = null;
        this.zoomLevel = 1.0;
        this._clearPreview();
        this._disableZoomControls();
        this._updateZoomDisplay();
        
        // Show the empty state placeholder
        const placeholder = this.previewContainer.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}
