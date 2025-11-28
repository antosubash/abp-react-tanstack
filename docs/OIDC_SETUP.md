# OpenID Connect Setup for TanStack Start

This implementation provides OpenID Connect authentication for your TanStack Start application, adapted from the Next.js 15 implementation.

## Configuration

### Environment Variables

Set the following environment variables in your `.env` file:

```bash
# OIDC Provider Configuration
VITE_OIDC_ISSUER=https://your-oidc-provider.com
VITE_OIDC_CLIENT_ID=your-client-id
VITE_OIDC_CLIENT_SECRET=your-client-secret

# Application URLs
VITE_BASE_URL=http://localhost:3000
VITE_OIDC_REDIRECT_URI=http://localhost:3000/auth/callback

# Session Configuration
VITE_SESSION_SECRET=your-super-secret-key-change-this-in-production
```

### OIDC Provider Setup

Configure your OIDC provider (e.g., Auth0, Keycloak, Azure AD, etc.) with:

- **Client ID**: Your application's client identifier
- **Client Secret**: Your application's client secret
- **Redirect URI**: `http://localhost:3000/auth/callback`
- **Scopes**: `openid profile email`
- **Grant Types**: `authorization_code refresh_token`

## Usage

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

### Using Authentication Hooks

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

## API Routes

The implementation provides the following API routes:

- `GET /api/auth/login` - Initiates OIDC login flow
- `POST /api/auth/callback` - Handles OIDC callback
- `POST /api/auth/logout` - Logs out the user
- `GET /api/auth/me` - Returns current user information

## Components

### AuthProvider

Wraps your application to provide authentication context. Already included in the root route.

### ProtectedRoute

Wraps components that require authentication. Shows a login prompt if the user is not authenticated.

### Header Component

Updated with login/logout buttons and user information display.

## Routes

### /auth/callback

Handles the OIDC callback after authentication. Users are redirected here after logging in with the OIDC provider.

### /dashboard

A sample protected route demonstrating the authentication system.

## Session Management

- Sessions are managed server-side using TanStack Start's built-in session handling
- Automatic token refresh when tokens expire
- Secure session storage with configurable secrets

## Security Features

- State parameter validation to prevent CSRF attacks
- PKCE (Proof Key for Code Exchange) for enhanced security
- Automatic token refresh
- Secure session management
- Proper error handling and validation

## Development

1. Set up your OIDC provider with the required configuration
2. Update the environment variables in `.env`
3. Start the development server: `pnpm dev`
4. Navigate to the dashboard to test authentication

## Production Deployment

1. Ensure all environment variables are set securely
2. Use a strong, randomly generated session secret
3. Configure HTTPS in production
4. Update redirect URIs in your OIDC provider to use production URLs

## Troubleshooting

### Common Issues

1. **"OIDC client initialization failed"**: Check your OIDC issuer URL and network connectivity
2. **"State mismatch"**: Ensure the callback route is handling the state parameter correctly
3. **"Token refresh failed"**: Check if your OIDC provider supports refresh tokens

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=oidc:*
```

## File Structure

```
src/
├── components/
│   ├── Header.tsx              # Updated with auth UI
│   └── ProtectedRoute.tsx      # Route protection component
├── hooks/
│   └── use-auth.tsx            # Authentication hooks and context
├── lib/
│   ├── auth-server.ts          # Server-side auth utilities
│   ├── constants.ts            # Configuration constants
│   └── oidc.ts                 # OIDC client utilities
├── routes/
│   ├── __root.tsx              # Root route with AuthProvider
│   ├── auth/
│   │   └── callback.tsx        # OIDC callback handler
│   ├── auth.callback.ts        # API callback route
│   ├── auth.login.ts           # API login route
│   ├── auth.logout.ts          # API logout route
│   ├── auth.me.ts              # API user info route
│   └── dashboard.tsx           # Sample protected route
```
