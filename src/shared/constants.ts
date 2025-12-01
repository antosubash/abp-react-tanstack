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

// React Query Key Constants
export const QUERY_KEYS = {
	// Authentication
	AUTH_ME: ["auth", "me"] as const,
	// Profile
	PROFILE: ["profile", "my-profile"] as const,
} as const;
