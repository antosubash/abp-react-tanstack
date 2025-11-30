export const OIDC_CONSTANTS = {
	ISSUER: process.env.VITE_OIDC_ISSUER || "",
	CLIENT_ID: process.env.VITE_OIDC_CLIENT_ID || "",
	CLIENT_SECRET: process.env.VITE_OIDC_CLIENT_SECRET || "",
	REDIRECT_URI: process.env.VITE_OIDC_REDIRECT_URI || "",
	BASE_URL: process.env.VITE_BASE_URL || "",
	SESSION_COOKIE_NAME: "abp-session",
	SESSION_SECRET: process.env.VITE_SESSION_SECRET || "",
	SCOPES: "openid profile email",
	RESPONSE_TYPE: "code",
};
