.PHONY: help build up down restart logs clean ps setup setup-local setup-model-builder build-models deploy-infra deploy-containers deploy-all validate-infra

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Create .env file from .env.example or Azure deployment
	@bash ./scripts/setup-local-env.sh

setup-local: ## Copy .env to API directories for local development
	@if [ ! -f src/.env ]; then \
		echo "❌ Error: src/.env not found. Run 'make setup' first and configure it."; \
		exit 1; \
	fi
	@echo "📋 Copying environment configuration to API services..."
	@cp src/.env src/api/document-api/.env
	@echo "✓ Copied to src/api/document-api/.env"
	@cp src/.env src/api/valet-api/.env
	@echo "✓ Copied to src/api/valet-api/.env"
	@echo ""
	@echo "✅ Local environment setup complete!"
	@echo ""
	@echo "⚠️  Note: Azure resources (Document Intelligence, Storage, Content Understanding)"
	@echo "   must already be provisioned. If not, create them manually in Azure Portal."
	@echo ""
	@echo "Next step: make up"

build: ## Build all Docker images
	docker-compose -f src/docker-compose.yml build

up: ## Start all services
	docker-compose -f src/docker-compose.yml up -d

down: ## Stop all services
	docker-compose -f src/docker-compose.yml down

restart: ## Restart all services
	docker-compose -f src/docker-compose.yml restart

logs: ## Tail logs from all services
	docker-compose -f src/docker-compose.yml logs -f

logs-document: ## Tail logs from document-api
	docker-compose -f src/docker-compose.yml logs -f document-api

logs-valet: ## Tail logs from valet-api
	docker-compose -f src/docker-compose.yml logs -f valet-api

logs-webui: ## Tail logs from webui
	docker-compose -f src/docker-compose.yml logs -f webui

ps: ## Show running services
	docker-compose -f src/docker-compose.yml ps

clean: ## Remove all containers, networks, and volumes
	docker-compose -f src/docker-compose.yml down -v
	docker system prune -f

rebuild: ## Rebuild and restart all services
	docker-compose -f src/docker-compose.yml down
	docker-compose -f src/docker-compose.yml build --no-cache
	docker-compose -f src/docker-compose.yml up -d

dev-up: ## Start services in development mode (with logs)
	docker-compose -f src/docker-compose.yml up

stop-document: ## Stop document-api
	docker-compose -f src/docker-compose.yml stop document-api

stop-valet: ## Stop valet-api
	docker-compose -f src/docker-compose.yml stop valet-api

stop-webui: ## Stop webui
	docker-compose -f src/docker-compose.yml stop webui

start-document: ## Start document-api
	docker-compose -f src/docker-compose.yml start document-api

start-valet: ## Start valet-api
	docker-compose -f src/docker-compose.yml start valet-api

start-webui: ## Start webui
	docker-compose -f src/docker-compose.yml start webui

deploy-infra: ## Deploy Azure infrastructure using Bicep
	@echo "🚀 Deploying Azure infrastructure..."
	@bash ./scripts/deploy.sh

deploy-containers: ## Build and deploy all containers to Azure
	@echo "🐳 Building and deploying containers..."
	@bash ./scripts/deploy-containers.sh

deploy-all: deploy-infra deploy-containers ## Deploy infrastructure and containers

validate-infra: ## Validate Azure Bicep templates
	@echo "✓ Validating Azure Bicep templates..."
	@az deployment sub validate \
		--location canadacentral \
		--template-file ./infra/main.bicep \
		--parameters ./infra/main.bicepparam

setup-model-builder: ## Setup model builder environment from Azure deployment or local config
	@bash ./scripts/setup-model-builder.sh

build-models: ## Build custom Document Intelligence and Content Understanding models
	@echo "🔧 Building custom models..."
	@bash ./scripts/setup-model-builder.sh
	@cd src/utility/modelBuilder && \
		if [ ! -d .venv ]; then \
			echo "Creating virtual environment..."; \
			uv venv; \
		fi && \
		. .venv/bin/activate && \
		uv pip install -e . && \
		python main.py
