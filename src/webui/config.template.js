const CONFIG = {
    // Azure Storage Configuration
    storage: {
        accountName: 'YOUR_STORAGE_ACCOUNT_NAME',
        containerName: 'documents',
        // Option 1: Use SAS token (not recommended for production)
        sasToken: 'YOUR_SAS_TOKEN',
        // Option 2: Use backend proxy endpoint
        uploadEndpoint: 'https://your-backend.azurewebsites.net/api/upload'
    },

    // Document Intelligence Configuration
    documentIntelligence: {
        endpoint: 'https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/',
        // Don't put API key here in production! Use backend proxy
        apiKey: 'YOUR_API_KEY',
        apiVersion: '2023-07-31',
        modelId: 'prebuilt-document' // or 'prebuilt-invoice', 'prebuilt-receipt', etc.
    },

    // Content Understanding Configuration
    contentUnderstanding: {
        endpoint: 'https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/',
        // Don't put API key here in production! Use backend proxy
        apiKey: 'YOUR_API_KEY',
        apiVersion: '2024-02-01',
        modelId: 'general-document'
    },

    // Azure OpenAI Configuration
    openai: {
        endpoint: 'https://YOUR_RESOURCE_NAME.openai.azure.com/',
        // Don't put API key here in production! Use backend proxy
        apiKey: 'YOUR_API_KEY',
        apiVersion: '2024-02-01',
        deploymentName: 'gpt-4', // or 'gpt-35-turbo'
        maxTokens: 500,
        temperature: 0.7
    },

    // Application Settings
    app: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['.pdf', '.jpg', '.jpeg', '.png'],
        uploadTimeout: 30000, // 30 seconds
        analysisTimeout: 60000 // 60 seconds
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
