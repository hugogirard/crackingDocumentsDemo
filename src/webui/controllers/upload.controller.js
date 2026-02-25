/**
 * Manages file upload UI and interactions
 */
class UploadController {
    constructor(storageService, onUploadComplete) {
        this.storageService = storageService;
        this.onUploadComplete = onUploadComplete;
        this.currentFile = null;
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.removeFileBtn = document.getElementById('removeFileBtn');
        
        this._initializeEventListeners();
    }

    _initializeEventListeners() {
        // Click to upload
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        
        // File selection
        this.fileInput.addEventListener('change', (e) => this._handleFileSelect(e));
        
        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this._handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this._handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this._handleDrop(e));
        
        // Remove file
        this.removeFileBtn.addEventListener('click', (e) => this._handleRemoveFile(e));
        
        // Analyze button
        this.analyzeBtn.addEventListener('click', () => this._handleAnalyze());
    }

    _handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this._setFile(file);
        }
    }

    _handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }

    _handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('drag-over');
    }

    _handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const file = event.dataTransfer.files[0];
        if (file) {
            this._setFile(file);
        }
    }

    _setFile(file) {
        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            NotificationService.show('Please select a PDF, JPEG, or PNG file', 'error');
            return;
        }

        this.currentFile = file;
        this.fileName.textContent = file.name;
        this.fileInfo.style.display = 'flex';
        // For Fluent UI button, remove disabled attribute
        this.analyzeBtn.removeAttribute('disabled');
    }

    _handleRemoveFile(event) {
        event.stopPropagation();
        this.currentFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        // For Fluent UI button, set disabled attribute
        this.analyzeBtn.setAttribute('disabled', '');
    }

    async _handleAnalyze() {
        if (!this.currentFile) return;

        try {
            LoadingService.show('Uploading document...');
            const result = await this.storageService.uploadFile(this.currentFile);
            LoadingService.hide();
            this.onUploadComplete(result, this.currentFile);
        } catch (error) {
            console.error('Upload error:', error);
            LoadingService.hide();
            NotificationService.show('Failed to upload file', 'error');
        }
    }

    reset() {
        this._handleRemoveFile({ stopPropagation: () => {} });
    }
}
