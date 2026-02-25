const CONFIG = {
    // API Base URL - Update this with your backend API URL
    apiBaseUrl: 'http://localhost:8000/api', // Change to your actual backend URL
    
    // Azure Storage Configuration
    storage: {
        accountName: 'YOUR_STORAGE_ACCOUNT_NAME',
        containerName: 'documents',
        // Backend endpoints for upload operations
        getSasUrlEndpoint: '/storage/get-sas-url', // POST: Returns { sasUrl, blobUrl, blobName }
        uploadEndpoint: '/storage/upload'
    },

    // Document Intelligence Configuration
    documentIntelligence: {
        analyzeEndpoint: '/document-intelligence/analyze', // POST: { documentUrl, modelId }
        apiVersion: '2023-07-31',
        modelId: 'prebuilt-document' // or 'prebuilt-invoice', 'prebuilt-receipt', etc.
    },

    // Content Understanding Configuration
    contentUnderstanding: {
        analyzeEndpoint: '/content-understanding/analyze', // POST: { documentUrl, modelId }
        apiVersion: '2024-02-01',
        modelId: 'general-document'
    },

    // LLM Configuration
    llm: {
        chatEndpoint: '/llm/chat', // POST: { question, documentContext, conversationHistory }
        apiVersion: '2024-02-01',
        maxTokens: 500,
        temperature: 0.7
    },

    // Application Settings
    app: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        uploadTimeout: 30000, // 30 seconds
        analysisTimeout: 60000 // 60 seconds
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
