.PHONY: help build up down restart logs clean ps setup

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Create .env file from .env.example
	@if [ -f .env ]; then \
		echo "⚠️  .env already exists. Remove it first or edit manually."; \
	else \
		cp .env.example .env; \
		echo "✓ Created .env file. Please edit it with your Azure credentials."; \
		echo "  nano .env"; \
	fi

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Tail logs from all services
	docker-compose logs -f

logs-document: ## Tail logs from document-api
	docker-compose logs -f document-api

logs-valet: ## Tail logs from valet-api
	docker-compose logs -f valet-api

logs-webui: ## Tail logs from webui
	docker-compose logs -f webui

ps: ## Show running services
	docker-compose ps

clean: ## Remove all containers, networks, and volumes
	docker-compose down -v
	docker system prune -f

rebuild: ## Rebuild and restart all services
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

dev-up: ## Start services in development mode (with logs)
	docker-compose up

stop-document: ## Stop document-api
	docker-compose stop document-api

stop-valet: ## Stop valet-api
	docker-compose stop valet-api

stop-webui: ## Stop webui
	docker-compose stop webui

start-document: ## Start document-api
	docker-compose start document-api

start-valet: ## Start valet-api
	docker-compose start valet-api

start-webui: ## Start webui
	docker-compose start webui
