# Document Intelligence & Content Understanding Demo

A pure HTML/CSS/JavaScript web application built with **Microsoft Fluent UI** for demonstrating Azure Document Intelligence and Content Understanding capabilities.

## ✨ Design System

This application uses [**Fluent UI Web Components**](https://developer.microsoft.com/en-us/fluentui) - Microsoft's official design system. Fluent UI provides:

- 🎨 **Modern Microsoft design language**: Consistent with Microsoft 365, Windows 11, and Azure Portal
- ♿ **Accessibility built-in**: WCAG 2.1 compliant components with ARIA support
- 🌙 **Theming support**: Light and dark mode ready
- 🎯 **Web Components standard**: Framework-agnostic, works with any JavaScript framework
- 📱 **Responsive**: Mobile-first design principles

### Fluent UI Components Used

- **fluent-button**: Primary, accent, and stealth button variants
- **fluent-card**: Elevated surfaces for upload area and file info
- **fluent-select**: Dropdown for service selection
- **fluent-text**: Typography with size and weight variants
- **fluent-progress-ring**: Loading indicator

## Features

- 📄 **Document Upload**: Drag-and-drop or click to upload PDF, JPEG, or PNG files
- 🔍 **Dual Analysis**: Choose between Document Intelligence or Content Understanding
- 📊 **JSON Viewer**: View and copy the complete analysis response
- 👁️ **Document Preview**: Side-by-side document viewing
- 📱 **Responsive Design**: Works on desktop and mobile devices with Fluent UI components
- 🎨 **Collapsible Panels**: Maximize workspace with collapsible side panels
- 🌐 **No Build Step**: Pure HTML/CSS/JS with CDN-hosted Fluent UI

## Project Structure

```
src/webui/
├── index.html              # Main HTML structure
├── styles.css              # Complete styling with CSS variables
├── app.js                  # Application initialization
├── config.js               # Configuration (API endpoints, settings)
├── config.template.js      # Configuration template for setup
├── API_INTEGRATION.md      # Backend API integration documentation
├── services/               # Service layer (API calls)
│   ├── azure-storage.service.js
│   ├── document-intelligence.service.js
│   ├── content-understanding.service.js
│   ├── notification.service.js
│   └── loading.service.js
├── controllers/            # UI Controllers
│   ├── upload.controller.js
│   ├── chat.controller.js
│   ├── json-viewer.controller.js
│   ├── document-preview.controller.js
│   └── application.controller.js
└── README.md              # This file
```

## Setup

### 1. Configure the Application

Copy the configuration template and update with your backend API URL:

```bash
cp config.template.js config.js
```

Edit `config.js` and update the `apiBaseUrl`:

```javascript
const CONFIG = {
    apiBaseUrl: 'http://localhost:8000/api', // Your backend API URL
    // ... rest of config
};
```

### 2. Backend API Requirements

The frontend expects a backend API with the following endpoints. See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API specifications:

- `POST /api/storage/get-sas-url` - Get SAS URL for file upload
- `DELETE /api/storage/delete` - Delete file from storage
- `POST /api/document-intelligence/analyze` - Analyze with Document Intelligence
- `POST /api/content-understanding/analyze` - Analyze with Content Understanding
- `POST /api/llm/chat` - Chat with LLM about document

### 3. Upload Flow

The application uses a two-step upload process:

1. **Get SAS URL**: Frontend calls your backend API to get a SAS URL
2. **Direct Upload**: Frontend uploads file directly to Azure Blob Storage using native browser fetch
3. **Analysis**: Backend analyzes the uploaded file

This approach:
- ✅ Keeps API keys secure on the backend
- ✅ Reduces backend bandwidth (direct upload to Azure)
- ✅ Provides upload progress tracking
- ✅ Scales better for large files

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

The application follows a clean separation of concerns with a service-oriented architecture:

### Configuration Layer

**config.js**
- Central configuration for all API endpoints
- Application settings (file size limits, timeouts)
- Easy environment switching (dev/staging/prod)

### Service Layer

All services make API calls to a backend server. No direct Azure API calls from the frontend.

#### `AzureStorageService` → `services/azure-storage.service.js`
- **Purpose**: Handle file uploads to Azure Blob Storage via backend API
- **Key Methods**:
  - `getSasUrl(fileName)`: Get SAS URL from backend
  - `uploadFile(file)`: Upload using native browser fetch to SAS URL
  - `uploadFileWithProgress(file, onProgress)`: Upload with progress tracking
  - `deleteFile(blobName)`: Delete file via backend API
- **Flow**:
  1. Call backend API to get SAS URL
  2. Upload file directly to Azure Storage using native browser fetch/XMLHttpRequest
  3. Return blob URL for analysis

#### `DocumentIntelligenceService` → `services/document-intelligence.service.js`
- **Purpose**: Analyze documents with Azure Document Intelligence via backend API
- **Key Methods**:
  - `analyzeDocument(documentUrl, modelId)`: Analyze via URL
  - `analyzeDocumentFromFile(file, modelId)`: Analyze via direct file upload
  - `getModels()`: Get available models
- **API Call**: POST to `/document-intelligence/analyze`

#### `ContentUnderstandingService` → `services/content-understanding.service.js`
- **Purpose**: Analyze documents with Azure Content Understanding via backend API
- **Key Methods**:
  - `analyzeDocument(documentUrl, modelId)`: Analyze via URL
  - `analyzeDocumentFromFile(file, modelId)`: Analyze via direct file upload
  - `getModels()`: Get available models
- **API Call**: POST to `/content-understanding/analyze`

#### `LLMService` → `services/llm.service.js`
- **Purpose**: Handle document Q&A with LLM via backend API
- **Key Methods**:
  - `setDocumentContext(data)`: Set analyzed document as context
  - `askQuestion(question)`: Send question to LLM
  - `askQuestionStream(question, onChunk)`: Stream LLM responses
  - `clearHistory()`: Reset conversation
  - `getHistory()`: Get conversation history
- **Features**:
  - Maintains conversation history
  - Supports streaming responses
  - Includes document context in queries
- **API Call**: POST to `/llm/chat`

#### `NotificationService` → `services/notification.service.js`
- **Purpose**: Display toast notifications
- **Methods**: `show(message, type)`

#### `LoadingService` → `services/loading.service.js`
- **Purpose**: Control loading overlay
- **Methods**: `show(message)`, `hide()`

### Controller Layer

UI controllers manage DOM interactions and user events:

#### `UploadController` → `controllers/upload.controller.js`
- File upload UI (drag-drop, file selection)
- File validation
- Upload triggering

#### `ChatController` → `controllers/chat.controller.js`
- Chat message display
- User input handling
- Message history management

#### `JsonViewerController` → `controllers/json-viewer.controller.js`
- JSON response display
- Copy to clipboard functionality
- Panel collapse/expand

#### `DocumentPreviewController` → `controllers/document-preview.controller.js`
- Document preview rendering (PDF/images)
- Panel collapse/expand

#### `Application` → `controllers/application.controller.js`
- Main application orchestration
- Service initialization
- Workflow coordination

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

### Fluent UI Theming

Fluent UI components can be customized using CSS custom properties (design tokens):

```css
/* In styles.css */
:root {
    /* Fluent UI Design Tokens */
    --accent-base-color: #0078d4;
    --neutral-base-color: #f3f2f1;
}

/* Customize specific components using ::part() */
fluent-button::part(control) {
    border-radius: 8px;
}

fluent-card::part(control) {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

For comprehensive theming options, see the [Fluent UI Design Tokens documentation](https://docs.microsoft.com/en-us/fluent-ui/web-components/design-system/design-tokens).

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

### Dark Mode Support

Fluent UI components automatically support dark mode. To enable dark mode, wrap your app in a design system provider:

```html
<fluent-design-system-provider use-defaults theme="dark">
    <!-- Your app content -->
</fluent-design-system-provider>
```

## Browser Support

Fluent UI Web Components require modern browsers with Web Components support:

- **Chrome/Edge**: ✅ Full support (recommended)
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (14.1+)
- **IE11**: ❌ Not supported (no Web Components support)

For older browser support, you may need polyfills for:
- Custom Elements v1
- Shadow DOM v1
- ES6+ features

See [Fluent UI browser compatibility](https://github.com/microsoft/fluentui/tree/master/packages/web-components#browser-support) for details.

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
