/**
 * Handles communication with LLM for document Q&A
 */
class LLMService {
    constructor() {
        this.config = CONFIG.llm;
        this.apiBaseUrl = CONFIG.apiBaseUrl;
        this.documentContext = null;
        this.conversationHistory = [];
    }

    /**
     * Set the document context for the LLM
     * @param {Object} documentData - Analyzed document data
     */
    setDocumentContext(documentData) {
        this.documentContext = documentData;
        this.conversationHistory = []; // Reset conversation when new document is loaded
    }

    /**
     * Send a question to the LLM about the document
     * @param {string} question - User's question
     * @returns {Promise<string>} LLM response
     */
    async askQuestion(question) {
        console.log('Sending question to LLM:', question);
        
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: question
            });

            const response = await fetch(`${this.apiBaseUrl}${this.config.chatEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question,
                    documentContext: this.documentContext,
                    conversationHistory: this.conversationHistory,
                    settings: {
                        maxTokens: this.config.maxTokens,
                        temperature: this.config.temperature
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `LLM request failed: ${response.statusText}`);
            }

            const result = await response.json();
            const answer = result.answer || result.response || result.message;

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: answer
            });

            console.log('LLM response received');
            return answer;
        } catch (error) {
            console.error('LLM error:', error);
            throw error;
        }
    }

    /**
     * Send a streaming question to the LLM
     * @param {string} question - User's question
     * @param {Function} onChunk - Callback for each chunk of response
     * @returns {Promise<string>} Complete LLM response
     */
    async askQuestionStream(question, onChunk) {
        console.log('Sending streaming question to LLM:', question);
        
        try {
            this.conversationHistory.push({
                role: 'user',
                content: question
            });

            const response = await fetch(`${this.apiBaseUrl}${this.config.chatEndpoint}/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question,
                    documentContext: this.documentContext,
                    conversationHistory: this.conversationHistory,
                    settings: {
                        maxTokens: this.config.maxTokens,
                        temperature: this.config.temperature
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `LLM request failed: ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                fullResponse += chunk;
                
                if (onChunk) {
                    onChunk(chunk);
                }
            }

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: fullResponse
            });

            console.log('LLM streaming response completed');
            return fullResponse;
        } catch (error) {
            console.error('LLM streaming error:', error);
            throw error;
        }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get conversation history
     * @returns {Array} Conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }
}
