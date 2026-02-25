# API Documentation

This document describes the API endpoints expected by the frontend application.

## Base URL

Configure the base URL in `config.js`:
```javascript
apiBaseUrl: 'http://localhost:8000/api'
```

## Endpoints

### 1. Storage - Get SAS URL

**POST** `/storage/get-sas-url`

Get a SAS (Shared Access Signature) URL for uploading a file to Azure Blob Storage.

**Request Body:**
```json
{
  "fileName": "document.pdf",
  "containerName": "documents"
}
```

**Response:**
```json
{
  "sasUrl": "https://storageaccount.blob.core.windows.net/documents/document.pdf?sv=2021-06-08&ss=b&srt=sco&sp=rwdlac&se=...",
  "blobUrl": "https://storageaccount.blob.core.windows.net/documents/document.pdf",
  "blobName": "document.pdf"
}
```

**Frontend Usage:**
The frontend will:
1. Call this endpoint to get the SAS URL
2. Use native browser `fetch()` to PUT the file directly to Azure Storage using the SAS URL
3. Use the `blobUrl` for subsequent analysis operations

---

### 2. Storage - Delete File

**DELETE** `/storage/delete`

Delete a file from Azure Blob Storage.

**Request Body:**
```json
{
  "blobName": "document.pdf",
  "containerName": "documents"
}
```

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

### 3. Document Intelligence - Analyze

**POST** `/document-intelligence/analyze`

Analyze a document using Azure Document Intelligence.

**Request Body:**
```json
{
  "documentUrl": "https://storageaccount.blob.core.windows.net/documents/document.pdf",
  "modelId": "prebuilt-document"
}
```

**Response:**
Returns the full Azure Document Intelligence API response with analyzed content.

```json
{
  "apiVersion": "2023-07-31",
  "modelId": "prebuilt-document",
  "content": "...",
  "pages": [...],
  "tables": [...],
  "keyValuePairs": [...],
  "documents": [...]
}
```

**Alternative Endpoint** (if uploading file directly):

**POST** `/document-intelligence/analyze/file`

**Request:** FormData with `file` and `modelId`

---

### 4. Document Intelligence - Get Models

**GET** `/document-intelligence/analyze/models`

Get list of available Document Intelligence models.

**Response:**
```json
[
  {
    "modelId": "prebuilt-document",
    "description": "General document analysis"
  },
  {
    "modelId": "prebuilt-invoice",
    "description": "Invoice analysis"
  }
]
```

---

### 5. Content Understanding - Analyze

**POST** `/content-understanding/analyze`

Analyze a document using Azure Content Understanding.

**Request Body:**
```json
{
  "documentUrl": "https://storageaccount.blob.core.windows.net/documents/document.pdf",
  "modelId": "general-document"
}
```

**Response:**
Returns the full Azure Content Understanding API response.

```json
{
  "apiVersion": "2024-02-01",
  "modelId": "general-document",
  "status": "succeeded",
  "analyzeResult": {
    "content": "...",
    "pages": [...],
    "paragraphs": [...],
    "tables": [...],
    "entities": [...],
    "keyValuePairs": [...]
  }
}
```

**Alternative Endpoint** (if uploading file directly):

**POST** `/content-understanding/analyze/file`

**Request:** FormData with `file` and `modelId`

---

### 6. Content Understanding - Get Models

**GET** `/content-understanding/analyze/models`

Get list of available Content Understanding models.

---

### 7. LLM - Chat

**POST** `/llm/chat`

Send a question to the LLM about the analyzed document.

**Request Body:**
```json
{
  "question": "What is the invoice total?",
  "documentContext": {
    // Full document analysis result from Document Intelligence or Content Understanding
  },
  "conversationHistory": [
    {
      "role": "user",
      "content": "What is the invoice number?"
    },
    {
      "role": "assistant",
      "content": "The invoice number is INV-12345."
    }
  ],
  "settings": {
    "maxTokens": 500,
    "temperature": 0.7
  }
}
```

**Response:**
```json
{
  "answer": "The invoice total is $150.00.",
  "usage": {
    "promptTokens": 1234,
    "completionTokens": 56,
    "totalTokens": 1290
  }
}
```

**Alternative Endpoint** (for streaming responses):

**POST** `/llm/chat/stream`

Returns a streaming response using Server-Sent Events or chunked transfer encoding.

---

## Error Handling

All endpoints should return appropriate HTTP status codes and error messages:

**Error Response Format:**
```json
{
  "error": true,
  "message": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized
- `404`: Not Found
- `413`: Payload Too Large (file size exceeded)
- `500`: Internal Server Error
- `503`: Service Unavailable

---

## Upload Flow

1. User selects a file in the frontend
2. Frontend calls `POST /storage/get-sas-url` to get a SAS URL
3. Frontend uploads file directly to Azure Blob Storage using the SAS URL with native browser `fetch()`:
   ```javascript
   fetch(sasUrl, {
     method: 'PUT',
     headers: {
       'x-ms-blob-type': 'BlockBlob',
       'Content-Type': file.type
     },
     body: file
   })
   ```
4. Frontend calls `POST /document-intelligence/analyze` or `POST /content-understanding/analyze` with the blob URL
5. Frontend receives analysis results and displays them
6. User can ask questions via `POST /llm/chat`

---

## Security Considerations

- Never expose API keys in the frontend
- All sensitive operations should go through your backend
- Implement proper authentication/authorization
- Validate file types and sizes on the backend
- Use short-lived SAS tokens (e.g., 15 minutes expiry)
- Implement rate limiting
- Sanitize user inputs

---

## CORS Configuration

Ensure your backend API has CORS properly configured to allow requests from your frontend domain.

Example headers:
```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```
