const CONFIG = {
    // Valet API Base URL (SAS token service - port 8000)
    valetApiBaseUrl: 'http://localhost:8000/api',

    // Document API Base URL (Document Intelligence & Content Understanding - port 8800)
    documentApiBaseUrl: 'http://localhost:8800',

    // Azure Storage Configuration
    storage: {
        containerName: 'documents'
    },

    // Document Intelligence Configuration
    documentIntelligence: {
        analyzeEndpoint: '/api/chat/analyze',
        modelsEndpoint: '/api/chat/models',
        processorType: 'doc', // Query parameter value
        modelId: 'prebuilt-document'
    },

    // Content Understanding Configuration
    contentUnderstanding: {
        analyzeEndpoint: '/api/chat/analyze',
        modelsEndpoint: '/api/chat/models',
        processorType: 'content', // Query parameter value
        modelId: 'general-document'
    },

    // Application Settings
    app: {
        uploadTimeout: 30000, // 30 seconds
        analysisTimeout: 60000 // 60 seconds
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
