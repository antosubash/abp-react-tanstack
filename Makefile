# Makefile for abp-react-tanstack project

.PHONY: help install dev build serve test lint format check type-check generate-api clean kill

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

# Installation
install: ## Install dependencies
	pnpm install

# Development
dev: ## Start development server
	pnpm dev

# Build
build: ## Build for production
	pnpm build

# Serve
serve: ## Serve production build
	pnpm serve

# Testing
test: ## Run tests
	pnpm test

# Code quality
lint: ## Run linter
	pnpm lint

lint-fix: ## Run linter and fix issues
	pnpm run lint:fix

format: ## Format code
	pnpm format

check: ## Check code quality (lint + format)
	pnpm check

check-file-size: ## Check file sizes
	pnpm check-file-size

type-check: ## Run TypeScript type checking
	pnpm typecheck

# API generation
generate-api: ## Generate API client
	pnpm generate-api

# Clean
clean: ## Clean build artifacts
	rm -rf dist
	rm -rf node_modules
	rm -rf .output
	rm -rf .tanstack

# Kill processes
kill: ## Kill Vite development server
	pkill -f vite || true

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
