/**
 * Handles document analysis using Azure Document Intelligence
 */
class DocumentIntelligenceService {
    constructor() {
        this.config = CONFIG.documentIntelligence;
        this.apiBaseUrl = CONFIG.documentApiBaseUrl;
        this.timeout = CONFIG.app.analysisTimeout;
    }

    /**
     * Analyze document using Document Intelligence
     * @param {string} documentUrl - URL of the document to analyze (can be base URL or SAS URL)
     * @param {string} modelId - Optional model ID (default: prebuilt-document)
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeDocument(documentUrl, modelId = null) {
        // Use the full SAS URL from state service if available
        const sasUrl = stateService.getSasUrl();
        const urlToAnalyze = sasUrl || documentUrl;
        
        console.log('Analyzing document with Document Intelligence:', urlToAnalyze);
        
        try {
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
            console.log('Document analysis completed');
            
            return result;
        } catch (error) {
            console.error('Document Intelligence error:', error);
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
