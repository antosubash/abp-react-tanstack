export const DEMO_CONSTANTS = {
	CLIENT: {
		TITLE: "Generated API Client Demo",
		DESCRIPTION:
			"Generated API client from ABP OpenAPI specification with full TypeScript support.",
		USER_FORM: {
			USER_NAME_LABEL: "User Name",
			USER_NAME_PLACEHOLDER: "Enter user name",
			USER_NAME_DEFAULT: "Demo User",
			EMAIL_LABEL: "Email",
			EMAIL_PLACEHOLDER: "Enter email",
			EMAIL_DEFAULT: "demo@example.com",
			CREATE_BUTTON: "Create User",
			CREATING_BUTTON: "Creating...",
		},
		USERS: {
			TITLE: "Users",
			DESCRIPTION: (count: number) => `${count} users found`,
			TABLE: {
				ID: "ID",
				NAME: "Name",
				EMAIL: "Email",
			},
		},
		API_CLIENT_INFO: {
			TITLE: "API Client Info",
			GENERATED_FROM: "Generated from:",
			OPENAPI_URL: "https://abp.antosubash.com/swagger/v1/swagger.json",
			TYPESCRIPT_TYPES: "TypeScript types:",
			TYPESCRIPT_DESCRIPTION: "Generated with full type safety",
			TANSTACK_QUERY: "TanStack Query hooks:",
			TANSTACK_QUERY_DESCRIPTION: "Auto-generated for all API endpoints",
			ZOD_VALIDATION: "Zod validation:",
			ZOD_DESCRIPTION: "Runtime type validation for API responses",
		},
		APP_CONFIG: {
			TITLE: "Application Configuration",
			DESCRIPTION: "ABP application configuration from the backend",
			LOADING: "Loading application configuration...",
			ERROR: "Failed to load application configuration",
			SECTIONS: {
				CURRENT_USER: "Current User",
				AUTH: "Authentication",
				MULTI_TENANCY: "Multi-Tenancy",
				CURRENT_TENANT: "Current Tenant",
				FEATURES: "Features",
				GLOBAL_FEATURES: "Global Features",
				TIMING: "Timing",
				CLOCK: "Clock",
				SETTINGS: "Settings",
				LOCALIZATION: "Localization",
			},
		},
		ERROR: {
			TITLE: "Error",
			MESSAGE: "Failed to load users",
		},
		LOADING: {
			TITLE: "Loading",
			MESSAGE: "Loading users...",
		},
	},
} as const;
