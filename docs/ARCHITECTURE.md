# 🏗️ Architecture

## Overview

The application consists of three main components in a microservices architecture pattern, demonstrating clean separation of concerns between frontend, backend services, and cloud services.

## System Architecture

```
┌─────────────┐
│   Web UI    │ ← Microsoft Fluent UI (HTML/CSS/JS)
│  (Port 8080)│
└──────┬──────┘
       │
       ├──────────────────┬────────────────────┐
       │                  │                    │
       ▼                  ▼                    ▼
┌─────────────┐   ┌──────────────┐   ┌──────────────┐
│ Document API│   │  Valet API   │   │Azure Storage │
│ (Port 8800) │   │ (Port 8000)  │   │   (Blobs)    │
└──────┬──────┘   └──────┬───────┘   └──────────────┘
       │                 │
       ▼                 ▼
┌──────────────────────────────────────┐
│     Azure Cognitive Services         │
│  • Document Intelligence             │
│  • Content Understanding             │
└──────────────────────────────────────┘
```

## Components

### 1. Web UI (Frontend)

**Technology:** Pure JavaScript with Microsoft Fluent UI design principles

**Responsibilities:**
- Document upload interface (drag-and-drop or file browser)
- Service selection (Document Intelligence vs Content Understanding)
- Document preview rendering
- JSON result visualization
- Real-time status updates and notifications

**Port:** 8080

**Key Features:**
- Fluent UI design system for consistent Microsoft-style interface
- Responsive layout
- Split-panel view (document preview + results)
- Error handling and user feedback

> ⚠️ **Production Note**: This Web UI was created as a demonstration with Claude LLM and is **not recommended for production use**. For production applications, use modern frameworks like **Vue.js**, **React.js**, or **Angular** with proper component libraries, state management, testing infrastructure, and security hardening.

### 2. Document API

**Technology:** Python FastAPI

**Responsibilities:**
- Interface with Azure Document Intelligence service
- Interface with Azure Content Understanding service
- Document analysis orchestration
- Result formatting and response transformation
- Error handling and logging

**Port:** 8800

**API Endpoints:**
- `POST /api/analyze-document-intelligence` - Analyze document using Azure Document Intelligence
- `POST /api/analyze-content-understanding` - Analyze document using Azure Content Understanding
- `GET /docs` - Interactive API documentation (Swagger UI)

**Key Features:**
- RESTful API design
- Async/await for non-blocking I/O
- Automatic API documentation with OpenAPI/Swagger
- Health checks
- Structured logging

### 3. Valet API

**Technology:** Python FastAPI

**Responsibilities:**
- Generate secure SAS (Shared Access Signature) tokens
- Implement Valet Key pattern for secure blob access
- Time-limited access token generation
- Azure Storage SDK integration

**Port:** 8000

**API Endpoints:**
- `POST /api/generate-sas` - Generate time-limited SAS token for blob upload
- `GET /docs` - Interactive API documentation (Swagger UI)

**Key Features:**
- Valet Key pattern implementation
- Time-bound access (configurable expiration)
- Read/Write permissions management
- Security best practices

### 4. Azure Services

#### Azure Document Intelligence
- OCR (Optical Character Recognition)
- Layout analysis
- Form recognition
- Table extraction
- Key-value pair extraction

#### Azure Content Understanding
- Advanced document understanding
- Custom model support
- Content extraction
- Semantic understanding

#### Azure Storage (Blob Storage)
- Document storage
- Secure access via SAS tokens
- Blob lifecycle management

## Design Patterns

### 1. Valet Key Pattern

The application implements the **Valet Key pattern** for secure blob storage access:

1. Client requests SAS token from Valet API
2. Valet API generates time-limited SAS token with specific permissions
3. Client uses SAS token to upload directly to Azure Storage
4. Token expires after configured time period

**Benefits:**
- No storage credentials exposed to client
- Direct client-to-storage upload (no proxy overhead)
- Time-limited access for security
- Fine-grained permission control

### 2. API Gateway Pattern

The Document API acts as a gateway/facade for Azure AI services:
- Abstracts Azure service complexity from frontend
- Provides consistent API interface
- Handles authentication and error transformation
- Enables future service switching without frontend changes

### 3. Microservices Architecture

Each component is independently deployable and scalable:
- Separate concerns (UI, document processing, storage access)
- Independent scaling based on load
- Technology stack flexibility
- Easier maintenance and updates

## Data Flow

### Document Upload and Analysis Flow

```
1. User selects document in Web UI
   ↓
2. Web UI requests SAS token from Valet API
   ↓
3. Valet API generates SAS token and returns it
   ↓
4. Web UI uploads document directly to Azure Storage using SAS token
   ↓
5. Web UI sends analysis request to Document API with blob URL
   ↓
6. Document API calls Azure Document Intelligence/Content Understanding
   ↓
7. Azure service processes document and returns results
   ↓
8. Document API formats and returns results to Web UI
   ↓
9. Web UI displays results in JSON viewer
```

## Network Communication

### Local Development (Docker Compose)

All services communicate over a shared Docker network (`app-network`):
- Service discovery via container names
- Internal DNS resolution
- Isolated network for security

### Azure Deployment

Services deployed as Azure App Services:
- HTTPS-only communication
- Managed identities for service-to-service auth
- Azure Virtual Network integration (optional)
- Application Insights for distributed tracing

## Security Considerations

1. **No Direct Storage Credentials**: Frontend never receives storage account keys
2. **Time-Limited Access**: SAS tokens expire after configured period
3. **API Key Management**: Azure service keys stored in environment variables or Azure Key Vault
4. **HTTPS in Production**: All traffic encrypted in transit
5. **CORS Configuration**: Proper CORS headers for cross-origin requests
6. **Managed Identities**: Azure resources use managed identities (no hardcoded credentials)

## Scalability

### Horizontal Scaling
- Each service can be scaled independently
- Stateless design allows multiple instances
- Load balancer distributes traffic

### Azure App Service Scaling
- Auto-scaling rules based on CPU/Memory
- Scale out/in based on demand
- Multiple instances for high availability

### Performance Optimization
- Direct blob upload (no proxy bottleneck)
- Async API design for non-blocking I/O
- CDN for static frontend assets (production)
- Caching strategies for repeated analyses

## Monitoring and Observability

### Application Insights
- Distributed tracing across services
- Performance metrics
- Exception tracking
- Custom events and metrics

### Logging
- Structured logging in all services
- Correlation IDs for request tracking
- Log aggregation in Azure
- Alert rules for errors and anomalies

## Technology Stack Summary

| Component | Technology | Framework | Language |
|-----------|-----------|-----------|----------|
| Web UI | HTML/CSS/JavaScript | Fluent UI | JavaScript |
| Document API | FastAPI | Uvicorn | Python 3.11+ |
| Valet API | FastAPI | Uvicorn | Python 3.11+ |
| Infrastructure | Bicep | Azure IaC | Bicep |
| Container Runtime | Docker | Docker Compose | - |
| Cloud Platform | Azure | App Service | - |

## Future Enhancements

Potential architectural improvements:

1. **API Gateway**: Add Azure API Management for centralized API management
2. **Message Queue**: Add Azure Service Bus for async processing
3. **Caching**: Add Redis for result caching
4. **Database**: Add Cosmos DB for metadata and analysis history
5. **Authentication**: Add Azure AD B2C for user authentication
6. **CDN**: Add Azure CDN for frontend assets
7. **Event Grid**: Add event-driven architecture for webhooks
8. **Function Apps**: Move background processing to serverless functions
