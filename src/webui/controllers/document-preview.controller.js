/**
 * Manages document preview panel with annotation overlay
 */
class DocumentPreviewController {
    constructor() {
        this.previewContainer = document.getElementById('documentPreview');
        this.panel = document.getElementById('previewPanel');
        this.collapseBtn = document.getElementById('collapsePreviewBtn');
        this.currentFile = null;
        this.analysisData = null;
        this.imageElement = null;
        this.canvasElement = null;
        this.overlayContainer = null;

        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.collapseBtn.addEventListener('click', () => this._handleCollapse());
    }

    setDocument(file) {
        this.currentFile = file;
        this.analysisData = null; // Reset analysis data
        
        // Hide the empty state placeholder
        const placeholder = this.previewContainer.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Clear any existing preview content
        this._clearPreview();

        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.type === 'application/pdf') {
                const iframe = document.createElement('iframe');
                iframe.src = e.target.result;
                iframe.style.width = '100%';
                iframe.style.height = 'calc(100vh - 120px)';
                this.previewContainer.appendChild(iframe);
            } else if (file.type.startsWith('image/')) {
                this._createImagePreview(e.target.result);
            }
        };

        reader.readAsDataURL(file);
    }

    /**
     * Create image preview with overlay container
     * @param {string} imageDataUrl - Image data URL
     */
    _createImagePreview(imageDataUrl) {
        // Create container for image and overlay
        this.overlayContainer = document.createElement('div');
        this.overlayContainer.className = 'preview-overlay-container';
        
        // Create image element
        this.imageElement = document.createElement('img');
        this.imageElement.src = imageDataUrl;
        this.imageElement.alt = 'Document preview';
        this.imageElement.className = 'preview-image';
        
        // Create canvas for annotations
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.className = 'preview-canvas';
        
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
        resizeObserver.observe(this.overlayContainer);
        
        this.overlayContainer.appendChild(this.imageElement);
        this.overlayContainer.appendChild(this.canvasElement);
        this.previewContainer.appendChild(this.overlayContainer);
    }

    /**
     * Update canvas size to match image dimensions
     */
    _updateCanvasSize() {
        if (!this.imageElement || !this.canvasElement) return;
        
        const rect = this.imageElement.getBoundingClientRect();
        this.canvasElement.width = rect.width;
        this.canvasElement.height = rect.height;
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
        const existingContent = this.previewContainer.querySelectorAll('iframe, img, .preview-overlay-container');
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
        this.analysisData = null;
        this._clearPreview();
        
        // Show the empty state placeholder
        const placeholder = this.previewContainer.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}
