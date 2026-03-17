/**
 * Main application controller
 */
class Application {
    constructor() {
        // Initialize services
        this.storageService = new AzureStorageService();
        this.docIntelligenceService = new DocumentIntelligenceService();
        this.contentUnderstandingService = new ContentUnderstandingService();

        // Initialize UI controllers
        this.uploadController = new UploadController(
            this.storageService,
            (uploadResult, file) => this._handleDocumentUpload(uploadResult, file)
        );
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

            // Store analysis result in state service
            stateService.setAnalysisResult(analysisResult);

            // Display JSON
            this.jsonViewer.setData(analysisResult);

            // Draw annotations on preview (if image)
            this.previewController.setAnalysisData(analysisResult);

            LoadingService.hide();
        } catch (error) {
            console.error('Analysis error:', error);
            LoadingService.hide();
            NotificationService.show('Failed to analyze document', 'error');
        }
    }

    reset() {
        this.uploadController.reset();
        this.previewController.reset();
        this.jsonViewer.setData(null);
        stateService.clearAll();
    }
}
