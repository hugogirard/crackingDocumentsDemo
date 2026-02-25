/**
 * Handles communication with LLM for document Q&A
 */
class LLMService {
    constructor() {
        this.endpoint = 'https://your-openai.openai.azure.com/';
        this.deploymentName = 'gpt-4';
        this.documentContext = null;
    }

    /**
     * Set the document context for the LLM
     * @param {Object} documentData - Analyzed document data
     */
    setDocumentContext(documentData) {
        this.documentContext = documentData;
    }

    /**
     * Send a question to the LLM about the document (Mock implementation)
     * @param {string} question - User's question
     * @returns {Promise<string>} LLM response
     */
    async askQuestion(question) {
        console.log('Sending question to LLM:', question);
        
        await this._simulateDelay(1500);
        
        // Mock intelligent responses based on common questions
        const responses = {
            'invoice': 'Based on the analyzed document, this is an invoice (INV-12345) dated February 24, 2024, for Acme Corporation with a total amount of $150.00.',
            'total': 'The total amount on this invoice is $150.00.',
            'date': 'The invoice date is February 24, 2024.',
            'customer': 'The customer name is Acme Corporation.',
            'items': 'The document contains a table with items, quantities, and prices. The main item listed is Product A with a quantity of 2 at $50.00.',
            'number': 'The invoice number is INV-12345.'
        };
        
        // Simple keyword matching for demo
        const lowerQuestion = question.toLowerCase();
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerQuestion.includes(keyword)) {
                return response;
            }
        }
        
        // Default response
        return `Based on the document analysis, I can help you with information about this invoice. The document contains key details such as invoice number (INV-12345), customer information (Acme Corporation), date (February 24, 2024), and a total amount of $150.00. What specific information would you like to know?`;
    }

    _simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
