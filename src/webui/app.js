// ============================================================================
// SERVICE LAYER - These should be moved to separate Angular services
// ============================================================================

/**
 * ANGULAR SERVICE: azure-storage.service.ts
 * Handles file uploads to Azure Blob Storage
 */
class AzureStorageService {
    constructor() {
        this.storageAccountName = 'your-storage-account';
        this.containerName = 'documents';
    }

    /**
     * Upload file to Azure Blob Storage (Mock implementation)
     * @param {File} file - The file to upload
     * @returns {Promise<Object>} Upload result with URL
     */
    async uploadFile(file) {
        console.log('Uploading file to Azure Storage:', file.name);
        
        // Simulate upload delay
        await this._simulateDelay(1500);
        
        // Mock response
        return {
            success: true,
            url: `https://${this.storageAccountName}.blob.core.windows.net/${this.containerName}/${file.name}`,
            blobName: file.name,
            uploadedAt: new Date().toISOString()
        };
    }

    /**
     * Delete file from Azure Blob Storage (Mock implementation)
     * @param {string} blobName - Name of the blob to delete
     * @returns {Promise<boolean>} Success status
     */
    async deleteFile(blobName) {
        console.log('Deleting file from Azure Storage:', blobName);
        await this._simulateDelay(500);
        return true;
    }

    _simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * ANGULAR SERVICE: document-intelligence.service.ts
 * Handles document analysis using Azure Document Intelligence
 */
class DocumentIntelligenceService {
    constructor() {
        this.endpoint = 'https://your-doc-intelligence.cognitiveservices.azure.com/';
        this.apiVersion = '2023-07-31';
    }

    /**
     * Analyze document using Document Intelligence (Mock implementation)
     * @param {string} documentUrl - URL of the document to analyze
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeDocument(documentUrl) {
        console.log('Analyzing document with Document Intelligence:', documentUrl);
        
        await this._simulateDelay(2000);
        
        // Mock response with realistic structure
        return {
            apiVersion: this.apiVersion,
            modelId: 'prebuilt-document',
            stringIndexType: 'textElements',
            content: 'Sample document content extracted from the PDF...',
            pages: [
                {
                    pageNumber: 1,
                    angle: 0,
                    width: 8.5,
                    height: 11,
                    unit: 'inch',
                    words: [
                        { content: 'Invoice', boundingBox: [1.0, 1.0, 2.5, 1.0, 2.5, 1.5, 1.0, 1.5], confidence: 0.99 },
                        { content: 'Number:', boundingBox: [1.0, 1.6, 2.0, 1.6, 2.0, 1.9, 1.0, 1.9], confidence: 0.98 }
                    ],
                    lines: [
                        { content: 'Invoice Number: INV-12345', boundingBox: [1.0, 1.0, 4.0, 1.0, 4.0, 1.9, 1.0, 1.9] }
                    ]
                }
            ],
            tables: [
                {
                    rowCount: 3,
                    columnCount: 3,
                    cells: [
                        { rowIndex: 0, columnIndex: 0, content: 'Item', kind: 'columnHeader' },
                        { rowIndex: 0, columnIndex: 1, content: 'Quantity', kind: 'columnHeader' },
                        { rowIndex: 0, columnIndex: 2, content: 'Price', kind: 'columnHeader' },
                        { rowIndex: 1, columnIndex: 0, content: 'Product A' },
                        { rowIndex: 1, columnIndex: 1, content: '2' },
                        { rowIndex: 1, columnIndex: 2, content: '$50.00' }
                    ]
                }
            ],
            keyValuePairs: [
                { key: { content: 'Invoice Number' }, value: { content: 'INV-12345' }, confidence: 0.95 },
                { key: { content: 'Date' }, value: { content: '2024-02-24' }, confidence: 0.93 },
                { key: { content: 'Total Amount' }, value: { content: '$150.00' }, confidence: 0.97 }
            ],
            documents: [
                {
                    docType: 'invoice',
                    boundingRegions: [{ pageNumber: 1, boundingBox: [0, 0, 8.5, 0, 8.5, 11, 0, 11] }],
                    fields: {
                        'InvoiceId': { type: 'string', valueString: 'INV-12345', confidence: 0.95 },
                        'InvoiceDate': { type: 'date', valueDate: '2024-02-24', confidence: 0.93 },
                        'CustomerName': { type: 'string', valueString: 'Acme Corporation', confidence: 0.91 },
                        'InvoiceTotal': { type: 'number', valueNumber: 150.00, confidence: 0.97 }
                    }
                }
            ]
        };
    }

    _simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * ANGULAR SERVICE: content-understanding.service.ts
 * Handles document analysis using Azure Content Understanding
 */
class ContentUnderstandingService {
    constructor() {
        this.endpoint = 'https://your-content-understanding.cognitiveservices.azure.com/';
        this.apiVersion = '2024-02-01';
    }

    /**
     * Analyze document using Content Understanding (Mock implementation)
     * @param {string} documentUrl - URL of the document to analyze
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeDocument(documentUrl) {
        console.log('Analyzing document with Content Understanding:', documentUrl);
        
        await this._simulateDelay(2500);
        
        // Mock response with Content Understanding structure
        return {
            apiVersion: this.apiVersion,
            modelId: 'general-document',
            status: 'succeeded',
            createdDateTime: new Date().toISOString(),
            lastUpdatedDateTime: new Date().toISOString(),
            analyzeResult: {
                version: '4.0',
                content: 'Sample document content with enhanced understanding...',
                languages: [
                    { locale: 'en-US', confidence: 0.99 }
                ],
                pages: [
                    {
                        pageNumber: 1,
                        width: 8.5,
                        height: 11,
                        unit: 'inch',
                        spans: [{ offset: 0, length: 500 }]
                    }
                ],
                paragraphs: [
                    {
                        role: 'title',
                        content: 'Invoice',
                        boundingRegions: [{ pageNumber: 1, polygon: [1.0, 1.0, 3.0, 1.0, 3.0, 1.5, 1.0, 1.5] }]
                    },
                    {
                        role: 'body',
                        content: 'This invoice is for services rendered during February 2024.',
                        boundingRegions: [{ pageNumber: 1, polygon: [1.0, 2.0, 7.0, 2.0, 7.0, 3.0, 1.0, 3.0] }]
                    }
                ],
                tables: [
                    {
                        rowCount: 3,
                        columnCount: 3,
                        cells: [
                            { rowIndex: 0, columnIndex: 0, content: 'Item', kind: 'columnHeader' },
                            { rowIndex: 0, columnIndex: 1, content: 'Quantity', kind: 'columnHeader' },
                            { rowIndex: 0, columnIndex: 2, content: 'Price', kind: 'columnHeader' }
                        ]
                    }
                ],
                entities: [
                    {
                        category: 'Organization',
                        content: 'Acme Corporation',
                        confidence: 0.95,
                        spans: [{ offset: 50, length: 16 }]
                    },
                    {
                        category: 'DateTime',
                        content: 'February 2024',
                        confidence: 0.92,
                        spans: [{ offset: 100, length: 13 }]
                    }
                ],
                keyValuePairs: [
                    {
                        key: { content: 'Invoice Number', spans: [{ offset: 0, length: 14 }] },
                        value: { content: 'INV-12345', spans: [{ offset: 16, length: 9 }] },
                        confidence: 0.96
                    }
                ],
                documents: [
                    {
                        docType: 'invoice',
                        fields: {
                            'InvoiceId': { type: 'string', content: 'INV-12345', confidence: 0.96 },
                            'CustomerName': { type: 'string', content: 'Acme Corporation', confidence: 0.95 },
                            'InvoiceTotal': { type: 'currency', content: '$150.00', confidence: 0.97 }
                        }
                    }
                ]
            }
        };
    }

    _simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * ANGULAR SERVICE: llm.service.ts
 * Handles communication with LLM for document Q&A
 */
class LLMService {
    constructor() {
        this.endpoint = 'https://your-openai.openai.azure.com/';
        this.deploymentName = 'gpt-4';
        this.documentContext = null;
    }

    /**
     * Set the document context for the LLM
     * @param {Object} documentData - Analyzed document data
     */
    setDocumentContext(documentData) {
        this.documentContext = documentData;
    }

    /**
     * Send a question to the LLM about the document (Mock implementation)
     * @param {string} question - User's question
     * @returns {Promise<string>} LLM response
     */
    async askQuestion(question) {
        console.log('Sending question to LLM:', question);
        
        await this._simulateDelay(1500);
        
        // Mock intelligent responses based on common questions
        const responses = {
            'invoice': 'Based on the analyzed document, this is an invoice (INV-12345) dated February 24, 2024, for Acme Corporation with a total amount of $150.00.',
            'total': 'The total amount on this invoice is $150.00.',
            'date': 'The invoice date is February 24, 2024.',
            'customer': 'The customer name is Acme Corporation.',
            'items': 'The document contains a table with items, quantities, and prices. The main item listed is Product A with a quantity of 2 at $50.00.',
            'number': 'The invoice number is INV-12345.'
        };
        
        // Simple keyword matching for demo
        const lowerQuestion = question.toLowerCase();
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerQuestion.includes(keyword)) {
                return response;
            }
        }
        
        // Default response
        return `Based on the document analysis, I can help you with information about this invoice. The document contains key details such as invoice number (INV-12345), customer information (Acme Corporation), date (February 24, 2024), and a total amount of $150.00. What specific information would you like to know?`;
    }

    _simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================================================
// UI CONTROLLERS - These should be moved to Angular components
// ============================================================================

/**
 * ANGULAR COMPONENT: upload.component.ts
 * Manages file upload UI and interactions
 */
class UploadController {
    constructor(storageService, onUploadComplete) {
        this.storageService = storageService;
        this.onUploadComplete = onUploadComplete;
        this.currentFile = null;
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.removeFileBtn = document.getElementById('removeFileBtn');
        
        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        // Click to upload
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        
        // File selection
        this.fileInput.addEventListener('change', (e) => this._handleFileSelect(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this._handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this._handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this._handleDrop(e));
        
        // Remove file
        this.removeFileBtn.addEventListener('click', (e) => this._handleRemoveFile(e));
        
        // Analyze button
        this.analyzeBtn.addEventListener('click', () => this._handleAnalyze());
    }

    _handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this._setFile(file);
        }
    }

    _handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    _handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    _handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const file = event.dataTransfer.files[0];
        if (file) {
            this._setFile(file);
        }
    }

    _setFile(file) {
        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            NotificationService.show('Please select a PDF, JPEG, or PNG file', 'error');
            return;
        }

        this.currentFile = file;
        this.fileName.textContent = file.name;
        this.fileInfo.style.display = 'flex';
        // For Fluent UI button, remove disabled attribute
        this.analyzeBtn.removeAttribute('disabled');
    }

    _handleRemoveFile(event) {
        event.stopPropagation();
        this.currentFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        // For Fluent UI button, set disabled attribute
        this.analyzeBtn.setAttribute('disabled', '');
    }

    async _handleAnalyze() {
        if (!this.currentFile) return;

        try {
            const result = await this.storageService.uploadFile(this.currentFile);
            this.onUploadComplete(result, this.currentFile);
        } catch (error) {
            console.error('Upload error:', error);
            NotificationService.show('Failed to upload file', 'error');
        }
    }

    reset() {
        this._handleRemoveFile({ stopPropagation: () => {} });
    }
}

/**
 * ANGULAR COMPONENT: chat.component.ts
 * Manages chat interface and message handling
 */
class ChatController {
    constructor(llmService) {
        this.llmService = llmService;
        this.messagesContainer = document.getElementById('messagesContainer');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        
        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.sendBtn.addEventListener('click', () => this._handleSendMessage());
        
        // For Fluent UI text-area, listen to 'input' event
        this.chatInput.addEventListener('input', (e) => {
            const value = this.chatInput.value || '';
            if (value.trim()) {
                this.sendBtn.removeAttribute('disabled');
            } else {
                this.sendBtn.setAttribute('disabled', '');
            }
        });
        
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._handleSendMessage();
            }
        });
    }

    async _handleSendMessage() {
        const message = (this.chatInput.value || '').trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        // Disable send button for Fluent UI
        this.sendBtn.setAttribute('disabled', '');

        try {
            // Get LLM response
            const response = await this.llmService.askQuestion(message);
            this.addMessage(response, 'assistant');
        } catch (error) {
            console.error('LLM error:', error);
            this.addMessage('Sorry, I encountered an error processing your question.', 'assistant');
        }
    }

    addMessage(text, type = 'assistant') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? '👤' : type === 'system' ? 'ℹ️' : '🤖';

        const content = document.createElement('div');
        content.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;

        content.appendChild(textDiv);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    show() {
        document.getElementById('chatSection').style.display = 'flex';
        document.getElementById('uploadSection').style.display = 'none';
        this.chatInput.focus();
    }

    reset() {
        this.messagesContainer.innerHTML = '';
        document.getElementById('chatSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'flex';
    }
}

/**
 * ANGULAR COMPONENT: json-viewer.component.ts
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

/**
 * ANGULAR COMPONENT: document-preview.component.ts
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

/**
 * UTILITY SERVICE: notification.service.ts
 * Handles toast notifications
 */
class NotificationService {
    static show(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }
}

/**
 * UTILITY SERVICE: loading.service.ts
 * Handles loading overlay
 */
class LoadingService {
    static show(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('.loading-text');
        text.textContent = message;
        overlay.style.display = 'flex';
    }

    static hide() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.display = 'none';
    }
}

// ============================================================================
// MAIN APPLICATION - This should be the main app.component.ts
// ============================================================================

/**
 * ANGULAR COMPONENT: app.component.ts
 * Main application controller
 */
class Application {
    constructor() {
        // Initialize services
        this.storageService = new AzureStorageService();
        this.docIntelligenceService = new DocumentIntelligenceService();
        this.contentUnderstandingService = new ContentUnderstandingService();
        this.llmService = new LLMService();

        // Initialize UI controllers
        this.uploadController = new UploadController(
            this.storageService,
            (uploadResult, file) => this._handleDocumentUpload(uploadResult, file)
        );
        this.chatController = new ChatController(this.llmService);
        this.jsonViewer = new JsonViewerController();
        this.previewController = new DocumentPreviewController();

        // Get service selector
        this.serviceSelector = document.getElementById('serviceType');

        console.log('Application initialized');
        NotificationService.show('Application ready. Upload a document to begin.', 'success');
    }

    async _handleDocumentUpload(uploadResult, file) {
        try {
            LoadingService.show('Analyzing document...');

            // Show preview
            this.previewController.setDocument(file);

            // Get selected service
            const serviceType = this.serviceSelector.value;

            // Analyze document with selected service
            let analysisResult;
            if (serviceType === 'document-intelligence') {
                analysisResult = await this.docIntelligenceService.analyzeDocument(uploadResult.url);
                NotificationService.show('Document analyzed with Document Intelligence', 'success');
            } else {
                analysisResult = await this.contentUnderstandingService.analyzeDocument(uploadResult.url);
                NotificationService.show('Document analyzed with Content Understanding', 'success');
            }

            // Display JSON
            this.jsonViewer.setData(analysisResult);

            // Set LLM context
            this.llmService.setDocumentContext(analysisResult);

            // Show chat interface
            this.chatController.show();
            this.chatController.addMessage(
                `Document "${file.name}" has been uploaded and analyzed using ${serviceType === 'document-intelligence' ? 'Document Intelligence' : 'Content Understanding'}. You can now ask questions about the document.`,
                'system'
            );

            LoadingService.hide();
        } catch (error) {
            console.error('Analysis error:', error);
            LoadingService.hide();
            NotificationService.show('Failed to analyze document', 'error');
        }
    }

    reset() {
        this.uploadController.reset();
        this.chatController.reset();
        this.previewController.reset();
        this.jsonViewer.setData(null);
        this.llmService.setDocumentContext(null);
    }
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Application();
});
