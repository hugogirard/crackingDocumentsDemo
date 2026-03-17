#!/bin/sh
set -e

# Generate config.js from environment variables at runtime
# This allows us to use different configs for local vs Azure without modifying the source file
cat > /usr/share/nginx/html/config.js <<EOF
const CONFIG = {
    // Valet API Base URL (SAS token service)
    valetApiBaseUrl: '${VALET_API_URL:-http://localhost:8000/api}',

    // Document API Base URL (Document Intelligence & Content Understanding)
    documentApiBaseUrl: '${DOCUMENT_API_URL:-http://localhost:8800}',

    // Azure Storage Configuration
    storage: {
        containerName: '${STORAGE_CONTAINER_NAME:-documents}'
    },

    // Document Intelligence Configuration
    documentIntelligence: {
        analyzeEndpoint: '/api/chat/analyze',
        modelsEndpoint: '/api/chat/models',
        processorType: 'doc',
        modelId: 'prebuilt-document'
    },

    // Content Understanding Configuration
    contentUnderstanding: {
        analyzeEndpoint: '/api/chat/analyze',
        modelsEndpoint: '/api/chat/models',
        processorType: 'content',
        modelId: 'general-document'
    },

    // Application Settings
    app: {
        uploadTimeout: 30000,
        analysisTimeout: 60000
    }
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
EOF

echo "✓ Generated config.js with runtime environment variables"

# Start nginx
exec nginx -g "daemon off;"
