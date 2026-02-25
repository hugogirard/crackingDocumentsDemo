/**
 * Manages application state using browser session storage
 */
class StateService {
    constructor() {
        this.KEYS = {
            SAS_URL: 'document_sas_url',
            BLOB_URL: 'document_blob_url',
            BLOB_NAME: 'document_blob_name',
            ANALYSIS_RESULT: 'analysis_result',
            EXTRACTED_FIELDS: 'extracted_fields',
            CURRENT_FILE_NAME: 'current_file_name'
        };
    }

    /**
     * Store SAS URL in session storage
     * @param {string} sasUrl - The full SAS URL with token
     * @param {string} blobName - The blob name
     */
    setSasUrl(sasUrl, blobName) {
        try {
            sessionStorage.setItem(this.KEYS.SAS_URL, sasUrl);
            sessionStorage.setItem(this.KEYS.BLOB_NAME, blobName);
            
            // Also store the base blob URL (without SAS token)
            const blobUrl = sasUrl.split('?')[0];
            sessionStorage.setItem(this.KEYS.BLOB_URL, blobUrl);
            
            console.log('SAS URL stored in session storage');
        } catch (error) {
            console.error('Error storing SAS URL:', error);
        }
    }

    /**
     * Get SAS URL from session storage
     * @returns {string|null} The full SAS URL with token
     */
    getSasUrl() {
        try {
            return sessionStorage.getItem(this.KEYS.SAS_URL);
        } catch (error) {
            console.error('Error retrieving SAS URL:', error);
            return null;
        }
    }

    /**
     * Get blob URL (without token) from session storage
     * @returns {string|null} The blob URL
     */
    getBlobUrl() {
        try {
            return sessionStorage.getItem(this.KEYS.BLOB_URL);
        } catch (error) {
            console.error('Error retrieving blob URL:', error);
            return null;
        }
    }

    /**
     * Get blob name from session storage
     * @returns {string|null} The blob name
     */
    getBlobName() {
        try {
            return sessionStorage.getItem(this.KEYS.BLOB_NAME);
        } catch (error) {
            console.error('Error retrieving blob name:', error);
            return null;
        }
    }

    /**
     * Store analysis result in session storage
     * @param {Object} analysisResult - The analysis result from Document Intelligence or Content Understanding
     */
    setAnalysisResult(analysisResult) {
        try {
            // Store original result
            sessionStorage.setItem(this.KEYS.ANALYSIS_RESULT, JSON.stringify(analysisResult));
            
            // Transform and store simplified extracted fields
            const extractedFields = this.transformToExtractedFields(analysisResult);
            sessionStorage.setItem(this.KEYS.EXTRACTED_FIELDS, JSON.stringify(extractedFields));
            
            console.log('Analysis result and extracted fields stored in session storage');
        } catch (error) {
            console.error('Error storing analysis result:', error);
        }
    }

    /**
     * Get analysis result from session storage
     * @returns {Object|null} The parsed analysis result or null
     */
    getAnalysisResult() {
        try {
            const data = sessionStorage.getItem(this.KEYS.ANALYSIS_RESULT);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error retrieving analysis result:', error);
            return null;
        }
    }

    /**
     * Store current file name
     * @param {string} fileName - The file name
     */
    setCurrentFileName(fileName) {
        try {
            sessionStorage.setItem(this.KEYS.CURRENT_FILE_NAME, fileName);
        } catch (error) {
            console.error('Error storing file name:', error);
        }
    }

    /**
     * Get current file name
     * @returns {string|null} The file name
     */
    getCurrentFileName() {
        try {
            return sessionStorage.getItem(this.KEYS.CURRENT_FILE_NAME);
        } catch (error) {
            console.error('Error retrieving file name:', error);
            return null;
        }
    }

    /**
     * Transform analysis result to simplified extracted fields structure
     * @param {Object} analysisResult - The analysis result from Document Intelligence
     * @returns {Object} Simplified structure with field, value, confidence
     */
    transformToExtractedFields(analysisResult) {
        if (!analysisResult || !analysisResult.fields) {
            return {
                doc_type: analysisResult?.doc_type || null,
                overall_confidence: analysisResult?.confidence || null,
                extracted_fields: []
            };
        }

        const extractedFields = [];

        // Transform each field
        Object.entries(analysisResult.fields).forEach(([fieldName, fieldData]) => {
            extractedFields.push({
                field: fieldName,
                value: fieldData.content || null,
                confidence: fieldData.confidence || 0
            });
        });

        // Sort by confidence descending
        extractedFields.sort((a, b) => b.confidence - a.confidence);

        return {
            doc_type: analysisResult.doc_type,
            overall_confidence: analysisResult.confidence,
            extracted_fields: extractedFields,
            total_fields: extractedFields.length,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get extracted fields in simplified format
     * @returns {Object|null} The extracted fields or null
     */
    getExtractedFields() {
        try {
            const data = sessionStorage.getItem(this.KEYS.EXTRACTED_FIELDS);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error retrieving extracted fields:', error);
            return null;
        }
    }

    /**
     * Clear all stored state
     */
    clearAll() {
        try {
            Object.values(this.KEYS).forEach(key => {
                sessionStorage.removeItem(key);
            });
            console.log('All state cleared from session storage');
        } catch (error) {
            console.error('Error clearing state:', error);
        }
    }

    /**
     * Check if there is stored state
     * @returns {boolean} True if state exists
     */
    hasStoredState() {
        return this.getSasUrl() !== null || this.getAnalysisResult() !== null;
    }

    /**
     * Get simplified extracted fields as JSON string (ready to send to another service)
     * @returns {string|null} JSON string of extracted fields
     */
    getExtractedFieldsAsJson() {
        const fields = this.getExtractedFields();
        return fields ? JSON.stringify(fields, null, 2) : null;
    }
}

// Create singleton instance
const stateService = new StateService();
