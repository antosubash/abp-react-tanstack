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

	// Scopes (comma-separated string from env, or default)
	SCOPES: import.meta.env.VITE_OIDC_SCOPES
		? import.meta.env.VITE_OIDC_SCOPES.split(",").map((s: string) => s.trim())
		: ["openid", "profile", "email", "offline_access", "AbpTemplate"],

	// Additional OIDC parameters
	RESPONSE_TYPE: "code",
	GRANT_TYPE: "authorization_code",
} as const;
