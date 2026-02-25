/**
 * Manages document preview panel
 */
class DocumentPreviewController {
    constructor() {
        this.previewContainer = document.getElementById('documentPreview');
        this.panel = document.getElementById('previewPanel');
        this.collapseBtn = document.getElementById('collapsePreviewBtn');

        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.collapseBtn.addEventListener('click', () => this._handleCollapse());
    }

    setDocument(file) {
        // Hide the empty state placeholder
        const placeholder = this.previewContainer.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Clear any existing preview content
        const existingContent = this.previewContainer.querySelectorAll('iframe, img');
        existingContent.forEach(el => el.remove());

        const reader = new FileReader();
        reader.onload = (e) => {
            if (file.type === 'application/pdf') {
                const iframe = document.createElement('iframe');
                iframe.src = e.target.result;
                iframe.style.width = '100%';
                iframe.style.height = 'calc(100vh - 120px)';
                this.previewContainer.appendChild(iframe);
            } else if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Document preview';
                this.previewContainer.appendChild(img);
            }
        };

        reader.readAsDataURL(file);
    }

    _handleCollapse() {
        this.panel.classList.toggle('collapsed');
    }

    reset() {
        // Clear any existing content
        const existingContent = this.previewContainer.querySelectorAll('iframe, img');
        existingContent.forEach(el => el.remove());
        
        // Show the empty state placeholder
        const placeholder = this.previewContainer.querySelector('.preview-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
}
