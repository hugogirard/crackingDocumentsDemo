# API Integration Guide

This document explains how the WebUI integrates with the backend APIs.

## Architecture Overview

```
┌─────────────┐
│   Web UI    │
│  (port 8080)│
└──────┬──────┘
       │
       ├──────────────────┬──────────────────┐
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌──────────────┐   ┌──────────────┐
│  Valet API  │    │Document API  │   │Document API  │
│ (port 8000) │    │(port 8800)   │   │(port 8800)   │
│             │    │processor_type│   │processor_type│
│  SAS Token  │    │   = doc      │   │  = content   │
└─────────────┘    └──────────────┘   └──────────────┘
```

## API Endpoints

### 1. Valet API (Port 8000) - Azure Storage SAS Token Service

**Base URL**: `http://localhost:8000/api`

#### Get SAS Token
- **Endpoint**: `GET /api/sas`
- **Query Parameters**:
  - `blob_name` (string, required) - Name of the blob to generate SAS for
- **Returns**: SAS URL string for uploading/accessing the blob
- **Example**:
  ```javascript
  GET http://localhost:8000/api/sas?blob_name=invoice.pdf
  // Returns: "https://yourstorage.blob.core.windows.net/upload/invoice.pdf?sv=2021-06-08&..."
  ```

### 2. Document API (Port 8800) - Document Intelligence & Content Understanding

**Base URL**: `http://localhost:8800`

#### Analyze Document
- **Endpoint**: `POST /api/chat/analyze`
- **Query Parameters**:
  - `processor_type` (string, required) - Either `"doc"` (Document Intelligence) or `"content"` (Content Understanding)
- **Request Body**:
  ```json
  {
    "url": "https://storage.blob.core.windows.net/container/document.pdf?sas-token"
  }
  ```
- **Returns**: Analysis result object
- **Examples**:
  ```javascript
  // Document Intelligence
  POST http://localhost:8800/api/chat/analyze?processor_type=doc
  Body: { "url": "https://..." }

  // Content Understanding
  POST http://localhost:8800/api/chat/analyze?processor_type=content
  Body: { "url": "https://..." }
  ```

#### Get Available Models
- **Endpoint**: `GET /api/chat/models`
- **Query Parameters**:
  - `processor_type` (string, required) - Either `"doc"` or `"content"`
- **Returns**: Array of available models
- **Example**:
  ```javascript
  GET http://localhost:8800/api/chat/models?processor_type=doc
  ```

## WebUI Service Integration

### Azure Storage Service
**File**: `services/azure-storage.service.js`

**Purpose**: Handles file upload to Azure Storage via Valet API

**Flow**:
1. Get SAS URL from Valet API: `GET /api/sas?blob_name=filename`
2. Upload file directly to Azure Storage using returned SAS URL
3. Store the SAS URL in state for document analysis

**Config**:
```javascript
CONFIG.valetApiBaseUrl = 'http://localhost:8000/api'
```

### Document Intelligence Service
**File**: `services/document-intelligence.service.js`

**Purpose**: Analyzes documents using Azure Document Intelligence

**Flow**:
1. Get document URL (SAS URL from storage upload)
2. Call Document API with `processor_type=doc`
3. Return analysis results

**Config**:
```javascript
CONFIG.documentApiBaseUrl = 'http://localhost:8800'
CONFIG.documentIntelligence = {
  analyzeEndpoint: '/api/chat/analyze',
  modelsEndpoint: '/api/chat/models',
  processorType: 'doc'
}
```

### Content Understanding Service
**File**: `services/content-understanding.service.js`

**Purpose**: Analyzes documents using Azure Content Understanding

**Flow**:
1. Get document URL (SAS URL from storage upload)
2. Call Document API with `processor_type=content`
3. Return analysis results

**Config**:
```javascript
CONFIG.documentApiBaseUrl = 'http://localhost:8800'
CONFIG.contentUnderstanding = {
  analyzeEndpoint: '/api/chat/analyze',
  modelsEndpoint: '/api/chat/models',
  processorType: 'content'
}
```

## Complete Document Processing Flow

```
1. User uploads file
   └─> azure-storage.service.js
       ├─> GET /api/sas?blob_name=file.pdf (Valet API)
       │   └─> Returns: SAS URL
       └─> PUT <SAS URL> with file content (Azure Storage)
           └─> File stored in blob storage

2. User selects "Document Intelligence" and clicks "Analyze"
   └─> document-intelligence.service.js
       └─> POST /api/chat/analyze?processor_type=doc (Document API)
           └─> Body: { url: "<SAS URL>" }
           └─> Returns: Analysis results

3. OR User selects "Content Understanding" and clicks "Analyze"
   └─> content-understanding.service.js
       └─> POST /api/chat/analyze?processor_type=content (Document API)
           └─> Body: { url: "<SAS URL>" }
           └─> Returns: Analysis results
```

## Configuration Requirements

### config.js
```javascript
const CONFIG = {
    // Valet API (SAS tokens)
    valetApiBaseUrl: 'http://localhost:8000/api',
    
    // Document API (analysis)
    documentApiBaseUrl: 'http://localhost:8800',
    
    storage: {
        containerName: 'documents'
    },
    
    documentIntelligence: {
        analyzeEndpoint: '/api/chat/analyze',
        modelsEndpoint: '/api/chat/models',
        processorType: 'doc'
    },
    
    contentUnderstanding: {
        analyzeEndpoint: '/api/chat/analyze',
        modelsEndpoint: '/api/chat/models',
        processorType: 'content'
    },
    
    app: {
        uploadTimeout: 30000,    // 30 seconds
        analysisTimeout: 60000   // 60 seconds
    }
};
```

## Error Handling

All services include try-catch blocks and proper error propagation:

```javascript
try {
    const result = await service.method();
    return result;
} catch (error) {
    console.error('Service error:', error);
    throw error; // Re-throw for controller to handle
}
```

## CORS Configuration

Both backend APIs are configured with CORS to allow requests from the frontend:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing the Integration

1. **Test Valet API**:
   ```bash
   curl "http://localhost:8000/api/sas?blob_name=test.pdf"
   ```

2. **Test Document Intelligence**:
   ```bash
   curl -X POST "http://localhost:8800/api/chat/analyze?processor_type=doc" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-storage.blob.core.windows.net/container/doc.pdf?sas"}'
   ```

3. **Test Content Understanding**:
   ```bash
   curl -X POST "http://localhost:8800/api/chat/analyze?processor_type=content" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://your-storage.blob.core.windows.net/container/doc.pdf?sas"}'
   ```

## Troubleshooting

### Issue: "Failed to get SAS URL"
- **Cause**: Valet API not running or wrong URL
- **Solution**: Check `CONFIG.valetApiBaseUrl` and ensure Valet API is running on port 8000

### Issue: "Analysis failed"
- **Cause**: Document API not running or wrong processor_type
- **Solution**: 
  - Check `CONFIG.documentApiBaseUrl` and ensure Document API is running on port 8800
  - Verify `processor_type` is either "doc" or "content"

### Issue: "Upload failed"
- **Cause**: Invalid SAS URL or expired token
- **Solution**: Check Azure Storage configuration in Valet API's environment variables

### Issue: "CORS error"
- **Cause**: Backend APIs not configured for CORS
- **Solution**: Verify CORS middleware is enabled in both APIs (it should be by default)
