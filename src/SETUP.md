# Setup Instructions

## Quick Start

1. **Copy the example .env file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your Azure credentials:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Set the required values:**
   - `DOCUMENT_INTELLIGENCE_ENDPOINT` - Your Azure Document Intelligence endpoint
   - `DOCUMENT_INTELLIGENCE_API_KEY` - Your Azure Document Intelligence API key
   - `CONTENT_UNDERSTANDING_ENDPOINT` - Your Azure Content Understanding endpoint
   - `CONTENT_UNDERSTANDING_API_KEY` - Your Azure Content Understanding API key
   - `STORAGE_CONNECTION_STRING` - Your Azure Storage connection string
   - `STORAGE_ACCOUNT_KEY` - Your Azure Storage account key

4. **Start all services:**
   ```bash
   docker-compose up -d
   ```

5. **View logs:**
   ```bash
   docker-compose logs -f
   ```

## How It Works

- The `.env` file at the root is automatically read by `docker-compose`
- Environment variables are passed to each container
- No `.env` files are copied into Docker images (excluded via `.dockerignore`)
- This keeps credentials secure and builds reproducible

## Accessing Services

- **Web UI**: http://localhost:8080
- **Document API**: http://localhost:8800/docs
- **Valet API**: http://localhost:8000/docs
