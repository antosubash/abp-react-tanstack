# ABP React TanStack Application

A modern full-stack web application built with React, TanStack Router, and integrated with ABP (ASP.NET Boilerplate Platform) backend.

## 🚀 Features

- 🔐 **OIDC Authentication**: Secure authentication via OpenID Connect with PKCE
- 🛠️ **API Client Generation**: Auto-generated TypeScript clients from OpenAPI specs
- 🎨 **Modern UI**: Shadcn/ui components with Tailwind CSS
- 🚀 **SSR Support**: Server-side rendering with TanStack Start
- 🐳 **Docker Ready**: Containerized deployment
- 👥 **User & Role Management**: Complete identity management system
- 🔒 **Permission System**: Granular permission management

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Access to an ABP backend API (default: https://abp.antosubash.com)
- OIDC provider (for authentication)

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd abp-react-tanstack

# Install dependencies
pnpm install

# Generate API client from OpenAPI spec
pnpm generate-api

# Start development server
pnpm dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_BASE_URL=https://abp.antosubash.com
VITE_OPENAPI_SPEC_URL=https://abp.antosubash.com/swagger/v1/swagger.json
VITE_API_PROXY_PATH=/api/proxy

# OIDC Configuration
VITE_OIDC_ISSUER=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_CLIENT_SECRET=your-client-secret
VITE_BASE_URL=http://localhost:3000
VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback

# Session Configuration
VITE_SESSION_SECRET=your-super-secret-key-change-this-in-production

# Application Configuration
VITE_APP_NAME=abp-react-tanstack
VITE_APP_VERSION=v1
```

## 🏗️ Architecture

### Tech Stack

- **Frontend Framework**: React 19.2.0 with TanStack Router
- **Full-stack Framework**: TanStack Start for SSR and server functions
- **State Management**: TanStack Query for data fetching
- **UI Framework**: Tailwind CSS with Shadcn/ui components
- **Authentication**: OpenID Connect with PKCE
- **API Integration**: Auto-generated TypeScript client from OpenAPI specs
- **Build Tool**: Vite
- **Testing**: Vitest
- **Code Quality**: Biome for linting and formatting

### Project Structure

```
src/
├── client/                              # Generated API client
│   ├── @tanstack/                       # TanStack Query hooks
│   ├── client/                          # Fetch client utilities
│   ├── core/                            # Core API utilities
│   ├── index.ts                         # Main API exports
│   ├── sdk.gen.ts                       # Generated SDK
│   └── types.gen.ts                     # Generated TypeScript types
├── components/
│   ├── ui/                              # Shadcn/ui components
│   ├── app-sidebar.tsx                  # Application sidebar
│   ├── data-table.tsx                   # Data table component
│   ├── Header.tsx                       # Application header
│   ├── nav-*.tsx                        # Navigation components
│   ├── ProtectedRoute.tsx               # Route protection wrapper
│   ├── section-cards.tsx                # UI card components
│   ├── SidebarLayout.tsx                # Sidebar layout wrapper
│   ├── RolesList.tsx                    # Roles management component
│   ├── UsersList.tsx                    # Users management component
│   └── PermissionGroup.tsx              # Permission management component
├── hooks/
│   ├── use-auth.tsx                     # Authentication hooks
│   └── use-mobile.ts                    # Mobile detection hook
├── lib/
│   ├── auth-server.ts                   # Server-side auth utilities
│   ├── constants.ts                     # Application constants
│   ├── oidc.ts                          # OIDC client utilities
│   ├── session.ts                       # Session management
│   ├── permission-store.ts              # Permission state management
│   └── utils.ts                         # Utility functions
├── routes/
│   ├── __root.tsx                       # Root route with providers
│   ├── index.tsx                        # Landing page
│   ├── auth.*.ts                        # Authentication routes
│   ├── api.*.ts                         # API routes
│   ├── roles.tsx                        # Roles management page
│   ├── users.tsx                        # Users management page
│   └── demo/                            # Demo feature routes
└── hey-api.ts                           # API client configuration
```

## 🔐 Authentication

### OIDC Setup

1. Configure your OIDC provider with the following settings:
   - Client ID: Your application's client identifier
   - Client Secret: Your application's client secret
   - Redirect URI: `http://localhost:3000/auth/callback`
   - Scopes: `openid profile email offline_access AbpTemplate`
   - Grant Types: `authorization_code refresh_token`

2. Update the environment variables in your `.env` file

3. The application will handle the OIDC flow automatically

### Protecting Routes

Use the `ProtectedRoute` component to protect routes that require authentication:

```tsx
import { ProtectedRoute } from "../components/ProtectedRoute";

export const Route = createFileRoute("/protected")({
  component: () => (
    <ProtectedRoute>
      <div>Protected content here</div>
    </ProtectedRoute>
  ),
});
```

### Using Authentication

```tsx
import { useAuth, useAuthState } from "../hooks/use-auth";

function MyComponent() {
  const { login, logout } = useAuth();
  const { user, isAuthenticated, isLoading } = useAuthState();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

## 👥 User & Role Management

### Users Management

- View, create, edit, and delete users
- Assign roles to users
- Manage user permissions
- Filter and search users

### Roles Management

- View, create, edit, and delete roles
- Assign permissions to roles
- Manage role hierarchy
- Filter and search roles

### Permission System

- Granular permission management
- Group permissions by category
- Assign permissions to roles
- Visual permission tree interface

## 🔌 API Integration

### Generated API Client

The project uses Hey API to generate a TypeScript client from the ABP backend OpenAPI specification:

```bash
# Regenerate API client
pnpm generate-api
```

### Using the API Client

```typescript
import { userGetListOptions, roleCreateMutation } from '@/client/@tanstack/react-query.gen';

// Query example
const { data: users, isLoading } = useQuery(userGetListOptions({
  query: {
    skipCount: 0,
    maxResultCount: 10
  }
}));

// Mutation example
const createRoleMutation = useMutation(roleCreateMutation());

const handleCreateRole = () => {
  createRoleMutation.mutate({
    body: {
      name: 'New Role',
      displayName: 'New Role Display',
      isActive: true
    }
  });
};
```

## 🎨 UI Components

The project uses Shadcn/ui components with Tailwind CSS for styling:

- Modern, accessible components
- Dark mode support
- Responsive design
- Consistent design system

### Adding New Components

```bash
# Add a new Shadcn/ui component
pnpx shadcn@latest add button
```

## 🚀 Deployment

### Docker

```bash
# Build Docker image
pnpm docker:build

# Run Docker container
pnpm docker:run

# Build and run in one command
pnpm docker:up

# Use Docker Compose
pnpm docker:compose:up
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## 🔧 Development

### Code Quality

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Check code quality
pnpm check

# Type check
pnpm typecheck
```

### Adding New Routes

1. Create a new file in `src/routes/` following the file-based routing pattern
2. TanStack Router will automatically generate the route configuration
3. Use `createFileRoute()` for route definition
4. Import and use `Link` component for navigation

### API Client Updates

When the backend API changes:

1. Update the OpenAPI spec URL in `hey-api.config.ts` if needed
2. Run `pnpm generate-api` to regenerate the client
3. Update your code to use any new endpoints or types

## 📚 Documentation

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Hey API Documentation](https://heyapi.dev/)
- [ABP Framework Documentation](https://abp.io/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

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
