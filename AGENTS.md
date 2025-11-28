# AGENTS.md - ABP React TanStack Application

## 🤖 AI Agent Documentation

This document serves as a comprehensive guide for AI agents working with the ABP React TanStack application. It provides context, architecture details, and operational guidance for maintaining and extending this full-stack project.

## 📋 Project Overview

**Project Name**: `abp-react-tanstack`
**Purpose**: A modern full-stack web application built with React, TanStack Router, and integrated with ABP (ASP.NET Boilerplate Platform) backend.

**Key Features**:
- 🔐 **OIDC Authentication**: Secure authentication via OpenID Connect
- 📊 **Project Management Dashboard**: Task tracking, metrics, and analytics
- 🛠️ **API Client Generation**: Auto-generated TypeScript clients from OpenAPI specs
- 🎨 **Modern UI**: Shadcn/ui components with Tailwind CSS
- 🚀 **SSR Support**: Server-side rendering with TanStack Start
- 🐳 **Docker Ready**: Containerized deployment

## 🏗️ Architecture & Tech Stack

### Frontend Framework
- **React 19.2.0**: Latest React with concurrent features
- **TanStack Router**: File-based routing with type-safe navigation
- **TanStack Start**: Full-stack framework with server functions and SSR
- **Vite**: Fast development build tool

### State Management & Data Fetching
- **TanStack Query**: Powerful data fetching and caching
- **TanStack Store**: Reactive state management (optional)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library

### Authentication & Security
- **OpenID Connect**: Industry-standard authentication
- **PKCE**: Enhanced security for public clients
- **Session Management**: Server-side session handling

### Backend Integration
- **ABP Framework**: ASP.NET Boilerplate Platform backend
- **Hey API**: Automated API client generation from OpenAPI specs
- **Zod**: Runtime type validation for API responses

### Development Tools
- **TypeScript**: Full type safety throughout
- **Biome**: Fast linting and formatting
- **Vitest**: Unit testing framework
- **Docker**: Containerization for deployment

## 📁 Project Structure

```
src/
├── app/dashboard/
│   └── data.json                    # Sample project management data
├── client/                          # Generated API client
│   ├── @tanstack/
│   ├── client/                      # Fetch client utilities
│   ├── core/                        # Core API utilities
│   ├── index.ts                     # Main API exports
│   ├── sdk.gen.ts                   # Generated SDK
│   └── types.gen.ts                 # Generated TypeScript types
├── components/
│   ├── ui/                          # Shadcn/ui components
│   ├── app-sidebar.tsx             # Application sidebar
│   ├── data-table.tsx              # Data table component
│   ├── Header.tsx                  # Application header
│   ├── nav-*.tsx                   # Navigation components
│   ├── ProtectedRoute.tsx          # Route protection wrapper
│   ├── section-cards.tsx           # UI card components
│   └── SidebarLayout.tsx           # Sidebar layout wrapper
├── data/
│   └── demo.punk-songs.ts          # Demo data
├── hooks/
│   ├── use-auth.tsx                # Authentication hooks
│   └── use-mobile.ts               # Mobile detection hook
├── lib/
│   ├── auth-server.ts              # Server-side auth utilities
│   ├── constants.ts                # Application constants
│   ├── oidc.ts                     # OIDC client utilities
│   ├── session.ts                  # Session management
│   └── utils.ts                    # Utility functions
├── routes/
│   ├── __root.tsx                  # Root route with providers
│   ├── index.tsx                   # Landing page
│   ├── dashboard.tsx               # Main dashboard
│   ├── auth.*.ts                   # Authentication routes
│   ├── api.*.ts                    # API routes
│   └── demo/                       # Demo feature routes
└── hey-api.ts                      # API client configuration
```

## 🔧 Key Configuration Files

### `hey-api.config.ts`
- **Purpose**: Configures automated API client generation
- **Input**: OpenAPI spec from ABP backend (`https://abp.antosubash.com/swagger/v1/swagger.json`)
- **Output**: TypeScript client in `src/client/`
- **Plugins**:
  - `@hey-api/client-fetch`: HTTP client
  - `zod`: Runtime validation schemas
  - `@tanstack/react-query`: Query hooks

### `vite.config.ts`
- **Purpose**: Vite configuration for development and build
- **Plugins**:
  - `tanstackStart()`: Full-stack framework integration
  - `viteReact()`: React plugin
  - `tailwindcss()`: CSS framework
  - `viteTsConfigPaths()`: Path alias resolution

### `package.json`
- **Scripts**:
  - `pnpm generate-api`: Regenerate API client from OpenAPI spec
  - `pnpm dev`: Start development server
  - `pnpm build`: Production build
  - `pnpm test`: Run tests with Vitest
  - `pnpm lint`: Code linting with Biome
  - `pnpm format`: Code formatting with Biome

## 🔐 Authentication System

### OIDC Configuration
```typescript
// Environment variables needed:
VITE_OIDC_ISSUER=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_CLIENT_SECRET=your-client-secret
VITE_BASE_URL=http://localhost:3000
VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_SESSION_SECRET=your-super-secret-key
```

### Authentication Flow
1. **Login Initiation**: User clicks login → redirect to OIDC provider
2. **Callback Handling**: `/auth/callback` processes authorization code
3. **Token Storage**: Access/ID tokens stored server-side in session
4. **Route Protection**: `ProtectedRoute` component wraps authenticated routes
5. **Token Refresh**: Automatic refresh when tokens expire

### Key Components
- **`useAuth()`**: Authentication hooks for login/logout
- **`ProtectedRoute`**: Route guard component
- **`AuthProvider`**: Context provider for auth state
- **Session Management**: Server-side session storage

## 📊 Dashboard Features

### Project Management Dashboard
- **Data Source**: `src/app/dashboard/data.json` (615 sample tasks)
- **Features**:
  - Task status tracking (Done/In Process)
  - Metrics calculation (completion rates, reviewer stats)
  - Interactive charts (pie/bar charts using Recharts)
  - Data table with sorting/filtering
  - Recent activity timeline
  - Team member avatars and stats

### Dashboard Components
- **Metrics Cards**: Total tasks, completed, in-progress, completion rate
- **Charts**: Status distribution (pie), type distribution (bar)
- **Activity Feed**: Recent task updates with user avatars
- **Data Table**: Comprehensive task overview with filtering

## 🚀 Development Workflow

### Getting Started
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Generate API client (after backend changes)
pnpm generate-api

# Run tests
pnpm test

# Lint and format code
pnpm lint
pnpm format
```

### API Client Generation
1. **Trigger**: Run `pnpm generate-api`
2. **Process**:
   - Fetches OpenAPI spec from ABP backend
   - Generates TypeScript types and functions
   - Creates TanStack Query hooks
   - Adds Zod validation schemas
3. **Output**: Updated files in `src/client/`

### Adding New Routes
1. Create new file in `src/routes/` following file-based routing
2. TanStack Router auto-generates route configuration
3. Use `createFileRoute()` for route definition
4. Import and use `Link` component for navigation

### Component Development
- Use Shadcn/ui components from `src/components/ui/`
- Follow existing patterns for consistency
- Implement responsive design with Tailwind
- Use TypeScript for type safety

## 🐳 Deployment & Docker

### Docker Configuration
```dockerfile
# Multi-stage build
FROM node:24-alpine AS builder
# Build stage with dependencies

FROM node:24-alpine AS production
# Production stage with optimized runtime
```

### Build & Run
```bash
# Build Docker image
pnpm docker:build

# Run locally
pnpm docker:run

# Docker Compose (full stack)
pnpm docker:compose:up
```

### Production Considerations
- **Security**: Use strong session secrets in production
- **HTTPS**: Required for OIDC in production
- **Environment**: Configure production OIDC provider URLs
- **Health Checks**: Built-in health check endpoint at `/api/health`

## 🧪 Demo Features

### Available Demo Routes
- `/demo/api-client`: Generated API client demonstration
- `/demo/start/api-request`: API request examples
- `/demo/start/server-funcs`: Server functions showcase
- `/demo/start/ssr/*`: SSR mode demonstrations

### Demo Data
- **Project Tasks**: 615 sample tasks in JSON format
- **Punk Songs**: Demo data for music-related features
- **Mock API Responses**: Simulated backend responses

## 🔍 Common Tasks for AI Agents

### 1. Adding New Features
- Create route file in `src/routes/`
- Implement component with TypeScript
- Add API integration if needed
- Update navigation components
- Add tests for new functionality

### 2. API Integration
- Run `pnpm generate-api` after backend changes
- Use generated hooks: `useQuery`, `useMutation`
- Apply Zod schemas for validation
- Handle loading/error states

### 3. UI Component Development
- Use existing Shadcn/ui components
- Follow design system patterns
- Implement responsive design
- Add proper TypeScript types

### 4. Authentication Updates
- Modify OIDC configuration in `src/lib/oidc.ts`
- Update route protection logic
- Handle token refresh scenarios
- Update error handling

### 5. Performance Optimization
- Implement proper loading states
- Use TanStack Query caching effectively
- Optimize bundle size
- Implement code splitting

### 6. Testing
- Write unit tests with Vitest
- Test authentication flows
- Test API integration
- Test component interactions

## 🚨 Troubleshooting Guide

### Common Issues

1. **API Client Generation Fails**
   - Check backend OpenAPI spec URL availability
   - Verify network connectivity
   - Check Hey API configuration

2. **Authentication Issues**
   - Verify OIDC provider configuration
   - Check environment variables
   - Validate redirect URIs
   - Check session secret strength

3. **Build Issues**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify Vite configuration
   - Check dependency versions

4. **Runtime Errors**
   - Check browser console for errors
   - Verify environment variables loaded
   - Check API endpoints accessibility
   - Validate session storage

### Debug Mode
```bash
# Enable debug logging
DEBUG=oidc:* pnpm dev

# Check build output
pnpm build --debug

# Run tests in watch mode
pnpm test --watch
```

## 📚 Resources & Documentation

- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query
- **TanStack Start**: https://tanstack.com/start
- **ABP Framework**: https://abp.io/
- **Shadcn/ui**: https://ui.shadcn.com/
- **Hey API**: https://heyapi.dev/
- **OIDC Setup**: See `OIDC_SETUP.md`

## 🤝 Contributing Guidelines

1. **Code Style**: Follow Biome configuration
2. **TypeScript**: Use strict typing throughout
3. **Testing**: Add tests for new features
4. **Documentation**: Update this AGENTS.md for significant changes
5. **Commits**: Use conventional commit messages
6. **PR Reviews**: Required for all changes

---

**Last Updated**: November 2025
**Version**: 0.0.1
**Maintainer**: AI Development Team
