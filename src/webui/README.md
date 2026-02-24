# Document Intelligence & Content Understanding Demo

A pure HTML/CSS/JavaScript web application for demonstrating Azure Document Intelligence and Content Understanding capabilities with LLM-powered document Q&A.

## Features

- 📄 **Document Upload**: Drag-and-drop or click to upload PDF, JPEG, or PNG files
- 🔍 **Dual Analysis**: Choose between Document Intelligence or Content Understanding
- 💬 **AI Chat**: Ask questions about your documents using LLM integration
- 📊 **JSON Viewer**: View and copy the complete analysis response
- 👁️ **Document Preview**: Side-by-side document viewing
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Collapsible Panels**: Maximize workspace with collapsible side panels

## Project Structure

```
src/webui/
├── index.html          # Main HTML structure with Angular component markers
├── styles.css          # Complete styling with CSS variables
├── app.js             # Application logic with service layer architecture
└── README.md          # This file
```

## Running the Application

### Option 1: Simple HTTP Server (Python)

```bash
cd src/webui
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Option 2: Node.js HTTP Server

```bash
cd src/webui
npx http-server -p 8000
```

### Option 3: VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Architecture

### Service Layer (Ready for Angular Services)

Each service class is designed to be easily converted to an Angular service:

#### `AzureStorageService`
- **Purpose**: Upload/delete files to Azure Blob Storage
- **Angular Migration**: → `azure-storage.service.ts`
- **Methods**:
  - `uploadFile(file)`: Upload document to blob storage
  - `deleteFile(blobName)`: Remove document from storage

#### `DocumentIntelligenceService`
- **Purpose**: Analyze documents with Azure Document Intelligence
- **Angular Migration**: → `document-intelligence.service.ts`
- **Methods**:
  - `analyzeDocument(documentUrl)`: Extract data using Document Intelligence API

#### `ContentUnderstandingService`
- **Purpose**: Analyze documents with Azure Content Understanding
- **Angular Migration**: → `content-understanding.service.ts`
- **Methods**:
  - `analyzeDocument(documentUrl)`: Extract data using Content Understanding API

#### `LLMService`
- **Purpose**: Handle document Q&A with LLM
- **Angular Migration**: → `llm.service.ts`
- **Methods**:
  - `setDocumentContext(data)`: Set analyzed document as context
  - `askQuestion(question)`: Send question to LLM with document context

### UI Controllers (Ready for Angular Components)

Each controller is marked in the code and designed for component extraction:

#### `UploadController`
- **Angular Migration**: → `upload.component.ts`
- **Responsibilities**: File upload, drag-and-drop, validation

#### `ChatController`
- **Angular Migration**: → `chat.component.ts`
- **Responsibilities**: Message display, user input, auto-resize

#### `JsonViewerController`
- **Angular Migration**: → `json-viewer.component.ts`
- **Responsibilities**: JSON display, copy to clipboard, panel collapse

#### `DocumentPreviewController`
- **Angular Migration**: → `document-preview.component.ts`
- **Responsibilities**: PDF/image preview, panel collapse

### Utility Services

#### `NotificationService`
- **Angular Migration**: → `notification.service.ts`
- **Purpose**: Toast notifications for user feedback

#### `LoadingService`
- **Angular Migration**: → `loading.service.ts`
- **Purpose**: Loading overlay management

## Angular Migration Guide

### HTML Components Marked for Extraction

Look for comments in `index.html`:

```html
<!-- APP-ROOT: This entire body should become the app.component in Angular -->
<!-- HEADER-COMPONENT: Extract to header.component -->
<!-- SIDEBAR-COMPONENT: Extract to json-viewer.component -->
<!-- CHAT-COMPONENT: Extract to chat.component -->
<!-- UPLOAD-SECTION: Part of chat.component or separate upload.component -->
<!-- DOCUMENT-PREVIEW-COMPONENT: Extract to document-preview.component -->
<!-- TOAST-NOTIFICATION-COMPONENT: Extract to notification.component -->
<!-- LOADING-COMPONENT: Extract to loading-spinner.component -->
```

### JavaScript Classes Marked for Services

Look for comments in `app.js`:

```javascript
/**
 * ANGULAR SERVICE: azure-storage.service.ts
 * Handles file uploads to Azure Blob Storage
 */
class AzureStorageService { ... }

/**
 * ANGULAR COMPONENT: upload.component.ts
 * Manages file upload UI and interactions
 */
class UploadController { ... }
```

### Migration Steps

1. **Create Angular Project**
   ```bash
   ng new document-intelligence-demo
   cd document-intelligence-demo
   ```

2. **Generate Components**
   ```bash
   ng generate component components/header
   ng generate component components/chat
   ng generate component components/upload
   ng generate component components/json-viewer
   ng generate component components/document-preview
   ng generate component components/loading-spinner
   ```

3. **Generate Services**
   ```bash
   ng generate service services/azure-storage
   ng generate service services/document-intelligence
   ng generate service services/content-understanding
   ng generate service services/llm
   ng generate service services/notification
   ng generate service services/loading
   ```

4. **Copy HTML**: Extract marked sections from `index.html` to respective component templates

5. **Copy CSS**: Move relevant sections from `styles.css` to component-specific CSS files

6. **Copy Logic**: Convert class methods to component/service methods

7. **Add TypeScript Types**: Define interfaces for API responses and data models

8. **Install Dependencies**:
   ```bash
   npm install @azure/storage-blob @azure/ai-form-recognizer
   ```

## Mock Data

Currently, all API calls are mocked with realistic response structures:

- **Upload**: Simulates 1.5s delay, returns mock blob URL
- **Document Intelligence**: Simulates 2s delay, returns prebuilt-document model response
- **Content Understanding**: Simulates 2.5s delay, returns enhanced analysis response
- **LLM**: Simulates 1.5s delay, returns context-aware responses

## Real API Integration

To connect to real Azure services, update these sections in `app.js`:

### Azure Storage

```javascript
class AzureStorageService {
    constructor() {
        this.storageAccountName = 'YOUR_STORAGE_ACCOUNT';
        this.containerName = 'YOUR_CONTAINER';
        this.sasToken = 'YOUR_SAS_TOKEN'; // Or use Azure Identity
    }

    async uploadFile(file) {
        // Use @azure/storage-blob SDK
        const blobServiceClient = new BlobServiceClient(
            `https://${this.storageAccountName}.blob.core.windows.net?${this.sasToken}`
        );
        // ... implementation
    }
}
```

### Document Intelligence

```javascript
class DocumentIntelligenceService {
    constructor() {
        this.endpoint = 'YOUR_ENDPOINT';
        this.apiKey = 'YOUR_API_KEY';
    }

    async analyzeDocument(documentUrl) {
        const response = await fetch(
            `${this.endpoint}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2023-07-31`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': this.apiKey
                },
                body: JSON.stringify({ urlSource: documentUrl })
            }
        );
        // Poll for results
    }
}
```

### Content Understanding

```javascript
class ContentUnderstandingService {
    constructor() {
        this.endpoint = 'YOUR_ENDPOINT';
        this.apiKey = 'YOUR_API_KEY';
    }

    async analyzeDocument(documentUrl) {
        const response = await fetch(
            `${this.endpoint}/contentunderstanding/documentModels/general-document:analyze?api-version=2024-02-01`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': this.apiKey
                },
                body: JSON.stringify({ urlSource: documentUrl })
            }
        );
        // Poll for results
    }
}
```

### LLM Service

```javascript
class LLMService {
    constructor() {
        this.endpoint = 'YOUR_OPENAI_ENDPOINT';
        this.apiKey = 'YOUR_API_KEY';
        this.deploymentName = 'YOUR_DEPLOYMENT';
    }

    async askQuestion(question) {
        const response = await fetch(
            `${this.endpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=2024-02-01`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': this.apiKey
                },
                body: JSON.stringify({
                    messages: [
                        { 
                            role: 'system', 
                            content: `You are a helpful assistant analyzing a document. Here is the document data: ${JSON.stringify(this.documentContext)}` 
                        },
                        { role: 'user', content: question }
                    ],
                    max_tokens: 500
                })
            }
        );
        const data = await response.json();
        return data.choices[0].message.content;
    }
}
```

## UI Interactions

### Upload Flow
1. User drags/drops or selects a file
2. File validation (PDF, JPEG, PNG only)
3. File info displayed with remove option
4. "Analyze Document" button enabled
5. Click to upload and analyze

### Analysis Flow
1. File uploaded to Azure Storage
2. Document sent to selected service (Document Intelligence or Content Understanding)
3. JSON response displayed in left panel
4. Document preview shown in right panel
5. Chat interface activated

### Chat Flow
1. User types question about the document
2. Question sent to LLM with document context
3. Response displayed in chat
4. Conversation continues with maintained context

## Customization

### Colors (CSS Variables)

Edit `:root` in `styles.css`:

```css
:root {
    --primary-color: #0078d4;        /* Main brand color */
    --secondary-color: #50e6ff;      /* Accent color */
    --success-color: #107c10;        /* Success states */
    --error-color: #d13438;          /* Error states */
    /* ... more variables */
}
```

### Panel Widths

```css
:root {
    --sidebar-width: 350px;          /* Adjust panel width */
    --header-height: 60px;           /* Adjust header height */
}
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported (uses modern ES6+ features)

## Security Considerations

⚠️ **Important for Production**:

1. **Never expose API keys in client-side code**
   - Use backend proxy for API calls
   - Implement proper authentication

2. **SAS Token Security**
   - Generate time-limited SAS tokens on backend
   - Use minimal permissions (write-only for uploads)

3. **CORS Configuration**
   - Configure Azure Storage CORS properly
   - Whitelist only necessary origins

4. **Input Validation**
   - Validate file types server-side
   - Implement file size limits
   - Scan uploaded files for malware

## License

MIT License - Feel free to use for demos and production applications.

## Support

For Azure services documentation:
- [Document Intelligence](https://learn.microsoft.com/azure/ai-services/document-intelligence/)
- [Azure OpenAI](https://learn.microsoft.com/azure/ai-services/openai/)
- [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/)
