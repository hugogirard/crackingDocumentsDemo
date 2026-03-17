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
        this.viewToggleBtn = document.getElementById('viewToggleBtn');
        this.structuredView = document.getElementById('structuredView');
        this.currentData = null;
        this.currentView = 'json'; // 'json' or 'structured'

        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.copyBtn.addEventListener('click', () => this._handleCopy());
        this.collapseBtn.addEventListener('click', () => this._handleCollapse());
        if (this.viewToggleBtn) {
            this.viewToggleBtn.addEventListener('click', () => this._handleViewToggle());
        }
        
        // Add click handler to collapsed label to reopen panel
        const collapsedLabel = this.panel.querySelector('.collapsed-label');
        if (collapsedLabel) {
            collapsedLabel.addEventListener('click', () => {
                if (this.panel.classList.contains('collapsed')) {
                    this._handleCollapse();
                }
            });
        }
    }

    setData(data) {
        this.currentData = data;
        this.jsonContent.textContent = JSON.stringify(data, null, 2);
        
        // Show the code block, hide the empty state
        const emptyState = this.jsonViewer.querySelector('.empty-state');
        const preElement = this.jsonViewer.querySelector('pre');
        if (emptyState) emptyState.style.display = 'none';
        if (preElement) preElement.style.display = 'block';
        
        // Build structured view
        this._buildStructuredView(data);
        
        // Set current view
        this._updateView();
    }

    clear() {
        this.currentData = null;
        this.jsonContent.textContent = 'No document analyzed yet...';
        
        // Show empty state, hide content
        const emptyState = this.jsonViewer.querySelector('.empty-state');
        const preElement = this.jsonViewer.querySelector('pre');
        if (emptyState) emptyState.style.display = 'flex';
        if (preElement) preElement.style.display = 'none';
        
        // Clear structured view
        if (this.structuredView) {
            this.structuredView.innerHTML = '';
            this.structuredView.style.display = 'none';
        }
        
        // Hide view toggle button
        if (this.viewToggleBtn) {
            this.viewToggleBtn.style.display = 'none';
        }
    }

    _buildStructuredView(data) {
        if (!this.structuredView || !data) return;
        
        this.structuredView.innerHTML = '';
        
        // Check if data has fields property (document model)
        if (data.fields) {
            const fieldsContainer = document.createElement('div');
            fieldsContainer.className = 'structured-fields';
            
            // Add doc_type if available
            if (data.doc_type) {
                const typeCard = this._createFieldCard('Document Type', data.doc_type, data.confidence);
                fieldsContainer.appendChild(typeCard);
            }
            
            // Add all fields
            Object.entries(data.fields).forEach(([key, value]) => {
                const fieldCard = this._createFieldCard(
                    this._formatFieldName(key),
                    value.content || 'N/A',
                    value.confidence
                );
                fieldsContainer.appendChild(fieldCard);
            });
            
            // Add order details if available
            if (data.order_details && data.order_details.items && data.order_details.items.length > 0) {
                const orderSection = document.createElement('div');
                orderSection.className = 'order-details-section';
                orderSection.innerHTML = '<h3 class="section-title">Order Details</h3>';
                
                data.order_details.items.forEach((item, index) => {
                    const itemCard = document.createElement('div');
                    itemCard.className = 'order-item-card';
                    itemCard.innerHTML = `
                        <div class="order-item-header">Item ${index + 1}</div>
                        <div class="field-row"><span class="field-label">Details:</span> <span>${item.details || 'N/A'}</span></div>
                        <div class="field-row"><span class="field-label">Quantity:</span> <span>${item.quantity || 'N/A'}</span></div>
                        <div class="field-row"><span class="field-label">Unit Price:</span> <span>${item.unit_price || 'N/A'}</span></div>
                        <div class="field-row"><span class="field-label">Total:</span> <span>${item.total || 'N/A'}</span></div>
                    `;
                    orderSection.appendChild(itemCard);
                });
                
                fieldsContainer.appendChild(orderSection);
            }
            
            this.structuredView.appendChild(fieldsContainer);
        } else {
            // Fallback for non-structured data
            const message = document.createElement('div');
            message.className = 'no-structure-message';
            message.textContent = 'No structured fields available. Switch to JSON view.';
            this.structuredView.appendChild(message);
        }
        
        // Show view toggle button
        if (this.viewToggleBtn) {
            this.viewToggleBtn.style.display = 'flex';
        }
    }

    _createFieldCard(label, value, confidence) {
        const card = document.createElement('div');
        card.className = 'field-card';
        
        const labelEl = document.createElement('div');
        labelEl.className = 'field-label';
        labelEl.textContent = label;
        
        const valueEl = document.createElement('div');
        valueEl.className = 'field-value';
        valueEl.textContent = value;
        
        card.appendChild(labelEl);
        card.appendChild(valueEl);
        
        if (confidence !== undefined && confidence !== null) {
            const confidenceEl = document.createElement('div');
            confidenceEl.className = 'field-confidence';
            const percentage = (confidence * 100).toFixed(1);
            confidenceEl.textContent = `${percentage}% confidence`;
            
            // Add color based on confidence level
            if (confidence >= 0.9) confidenceEl.style.color = '#107c10';
            else if (confidence >= 0.7) confidenceEl.style.color = '#ffa500';
            else confidenceEl.style.color = '#d13438';
            
            card.appendChild(confidenceEl);
        }
        
        return card;
    }

    _formatFieldName(name) {
        // Convert snake_case or camelCase to Title Case
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    _handleViewToggle() {
        this.currentView = this.currentView === 'json' ? 'structured' : 'json';
        this._updateView();
    }

    _updateView() {
        if (!this.currentData) return;
        
        const preElement = this.jsonViewer.querySelector('pre');
        
        if (this.currentView === 'json') {
            if (preElement) preElement.style.display = 'block';
            if (this.structuredView) this.structuredView.style.display = 'none';
            if (this.viewToggleBtn) {
                this.viewToggleBtn.innerHTML = `
                    <svg slot="start" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 3H14V5H2V3ZM2 7H10V9H2V7ZM2 11H14V13H2V11Z" fill="currentColor" />
                    </svg>
                    Structured View
                `;
            }
        } else {
            if (preElement) preElement.style.display = 'none';
            if (this.structuredView) this.structuredView.style.display = 'block';
            if (this.viewToggleBtn) {
                this.viewToggleBtn.innerHTML = `
                    <svg slot="start" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M4 2L4 14M8 2L8 14M12 2L12 14M2 4H14M2 8H14M2 12H14" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                    JSON View
                `;
            }
        }
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
