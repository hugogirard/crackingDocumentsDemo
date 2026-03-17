/**
 * Handles document analysis using Azure Content Understanding
 */
class ContentUnderstandingService {
    constructor() {
        this.config = CONFIG.contentUnderstanding;
        this.apiBaseUrl = CONFIG.documentApiBaseUrl;
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
            // Use SAS URL from state if available
            const sasUrl = stateService.getSasUrl();
            const urlToAnalyze = sasUrl || documentUrl;
            
            const response = await fetch(`${this.apiBaseUrl}${this.config.analyzeEndpoint}?processor_type=${this.config.processorType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: urlToAnalyze
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
     * Get list of available models
     * @returns {Promise<Array>} List of available models
     */
    async getModels() {
        try {
            const response = await fetch(`${this.apiBaseUrl}${this.config.modelsEndpoint}?processor_type=${this.config.processorType}`);

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
