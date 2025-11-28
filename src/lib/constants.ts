// API Configuration Constants
export const API_CONSTANTS = {
	// Base URL for the actual API
	BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://abp.antosubash.com",

	// Custom headers to add to all proxied requests
	CUSTOM_HEADERS: {
		"X-Proxy-Source": import.meta.env.VITE_APP_NAME || "abp-react-tanstack",
		"X-Requested-With": "XMLHttpRequest",
		"X-API-Version": import.meta.env.VITE_APP_VERSION || "v1",
		// Add any other custom headers you need
	},

	// Proxy endpoint path
	PROXY_PATH: import.meta.env.VITE_API_PROXY_PATH || "/api/proxy",

	// OpenAPI Specification URL (used for API client generation)
	OPENAPI_SPEC_URL:
		import.meta.env.VITE_OPENAPI_SPEC_URL ||
		"https://abp.antosubash.com/swagger/v1/swagger.json",
} as const;

// OpenID Connect Configuration Constants
export const OIDC_CONSTANTS = {
	// OIDC Provider Configuration
	ISSUER: import.meta.env.VITE_OIDC_ISSUER || "https://your-oidc-provider.com",
	CLIENT_ID: import.meta.env.VITE_OIDC_CLIENT_ID || "your-client-id",
	CLIENT_SECRET:
		import.meta.env.VITE_OIDC_CLIENT_SECRET || "your-client-secret",
	// Application URLs
	BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000",
	REDIRECT_URI:
		import.meta.env.VITE_OIDC_REDIRECT_URI ||
		"http://localhost:3000/auth/callback",

	// Session Configuration
	SESSION_SECRET:
		import.meta.env.VITE_SESSION_SECRET ||
		"your-super-secret-key-change-this-in-production",
	SESSION_COOKIE_NAME: "tanstack-oidc-session",

	// Scopes
	SCOPES: ["openid", "profile", "email"],

	// Additional OIDC parameters
	RESPONSE_TYPE: "code",
	GRANT_TYPE: "authorization_code",
} as const;
