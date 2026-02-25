/**
 * Manages JSON display panel
 */
class JsonViewerController {
    constructor() {
        this.jsonViewer = document.getElementById('jsonViewer');
        this.jsonContent = document.getElementById('jsonContent');
        this.copyBtn = document.getElementById('copyJsonBtn');
        this.panel = document.getElementById('jsonPanel');
        this.collapseBtn = document.getElementById('collapseJsonBtn');
        this.currentData = null;

        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.copyBtn.addEventListener('click', () => this._handleCopy());
        this.collapseBtn.addEventListener('click', () => this._handleCollapse());
    }

    setData(data) {
        this.currentData = data;
        this.jsonContent.textContent = JSON.stringify(data, null, 2);
        
        // Show the code block, hide the empty state
        const emptyState = this.jsonViewer.querySelector('.empty-state');
        const preElement = this.jsonViewer.querySelector('pre');
        if (emptyState) emptyState.style.display = 'none';
        if (preElement) preElement.style.display = 'block';
    }

    _handleCopy() {
        if (!this.currentData) return;

        navigator.clipboard.writeText(JSON.stringify(this.currentData, null, 2))
            .then(() => NotificationService.show('JSON copied to clipboard', 'success'))
            .catch(() => NotificationService.show('Failed to copy JSON', 'error'));
    }

    _handleCollapse() {
        this.panel.classList.toggle('collapsed');
    }
}
