/**
 * Handles document analysis using Azure Content Understanding
 */
class ContentUnderstandingService {
    constructor() {
        this.config = CONFIG.contentUnderstanding;
        this.apiBaseUrl = CONFIG.apiBaseUrl;
        this.timeout = CONFIG.app.analysisTimeout;
    }

    /**
     * Analyze document using Content Understanding
     * @param {string} documentUrl - URL of the document to analyze
     * @param {string} modelId - Optional model ID (default: general-document)
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeDocument(documentUrl, modelId = null) {
        console.log('Analyzing document with Content Understanding:', documentUrl);
        
        try {
            const response = await fetch(`${this.apiBaseUrl}${this.config.analyzeEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    documentUrl: documentUrl,
                    modelId: modelId || this.config.modelId
                }),
                signal: AbortSignal.timeout(this.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Analysis failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Content Understanding analysis completed');
            
            return result;
        } catch (error) {
            console.error('Content Understanding error:', error);
            throw error;
        }
    }

    /**
     * Analyze document from file directly
     * @param {File} file - The file to analyze
     * @param {string} modelId - Optional model ID
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeDocumentFromFile(file, modelId = null) {
        console.log('Analyzing document file with Content Understanding:', file.name);
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('modelId', modelId || this.config.modelId);

            const response = await fetch(`${this.apiBaseUrl}${this.config.analyzeEndpoint}/file`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(this.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Analysis failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Content Understanding analysis completed');
            
            return result;
        } catch (error) {
            console.error('Content Understanding error:', error);
            throw error;
        }
    }

    /**
     * Get list of available models
     * @returns {Promise<Array>} List of available models
     */
    async getModels() {
        try {
            const response = await fetch(`${this.apiBaseUrl}${this.config.analyzeEndpoint}/models`);

            if (!response.ok) {
                throw new Error(`Failed to get models: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting models:', error);
            throw error;
        }
    }
}
