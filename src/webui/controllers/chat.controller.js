/**
 * Manages chat interface and message handling
 */
class ChatController {
    constructor(llmService) {
        this.llmService = llmService;
        this.messagesContainer = document.getElementById('messagesContainer');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendBtn');
        
        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        this.sendBtn.addEventListener('click', () => this._handleSendMessage());
        
        // For Fluent UI text-area, listen to 'input' event
        this.chatInput.addEventListener('input', (e) => {
            const value = this.chatInput.value || '';
            if (value.trim()) {
                this.sendBtn.removeAttribute('disabled');
            } else {
                this.sendBtn.setAttribute('disabled', '');
            }
        });
        
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this._handleSendMessage();
            }
        });
    }

    async _handleSendMessage() {
        const message = (this.chatInput.value || '').trim();
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        // Disable send button for Fluent UI
        this.sendBtn.setAttribute('disabled', '');

        try {
            // Get LLM response
            const response = await this.llmService.askQuestion(message);
            this.addMessage(response, 'assistant');
        } catch (error) {
            console.error('LLM error:', error);
            this.addMessage('Sorry, I encountered an error processing your question.', 'assistant');
        }
    }

    addMessage(text, type = 'assistant') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = type === 'user' ? '👤' : type === 'system' ? 'ℹ️' : '🤖';

        const content = document.createElement('div');
        content.className = 'message-content';

        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.textContent = text;

        content.appendChild(textDiv);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    show() {
        document.getElementById('chatSection').style.display = 'flex';
        document.getElementById('uploadSection').style.display = 'none';
        this.chatInput.focus();
    }

    reset() {
        this.messagesContainer.innerHTML = '';
        document.getElementById('chatSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'flex';
    }
}
