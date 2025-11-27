# Makefile for abp-react-tanstack project

# Project directories
SRC_DIR := src

.PHONY: help install dev build serve test lint format check generate-api clean

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

# Installation
install: ## Install dependencies
	cd $(SRC_DIR) && pnpm install

# Development
dev: ## Start development server
	cd $(SRC_DIR) && pnpm dev

# Build
build: ## Build for production
	cd $(SRC_DIR) && pnpm build

# Serve
serve: ## Serve production build
	cd $(SRC_DIR) && pnpm serve

# Testing
test: ## Run tests
	cd $(SRC_DIR) && pnpm test

# Code quality
lint: ## Run linter
	cd $(SRC_DIR) && pnpm lint

lint-fix: ## Run linter and fix issues
	cd $(SRC_DIR) && pnpm run lint:fix

format: ## Format code
	cd $(SRC_DIR) && pnpm format

check: ## Check code quality (lint + format)
	cd $(SRC_DIR) && pnpm check

# API generation
generate-api: ## Generate API client
	cd $(SRC_DIR) && pnpm generate-api

# Clean
clean: ## Clean build artifacts
	rm -rf $(SRC_DIR)/dist
	rm -rf $(SRC_DIR)/node_modules

# Combined tasks
setup: install ## Install dependencies and setup project
	@echo "Project setup complete!"

build-all: clean install generate-api build ## Clean, install, generate API, and build

dev-full: generate-api dev ## Generate API and start dev server

# Docker (if needed in future)
# docker-build: ## Build Docker image
#	docker build -t abp-react-tanstack .

# docker-run: ## Run Docker container
#	docker run -p 3000:3000 abp-react-tanstack
