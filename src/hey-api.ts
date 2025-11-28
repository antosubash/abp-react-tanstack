import type { CreateClientConfig } from "./client/client.gen";
import { API_CONSTANTS } from "./lib/constants";

/**
 * Runtime configuration for the Hey API Fetch client.
 * This function is called on client initialization and allows
 * dynamic configuration using environment variables.
 *
 * The config parameter contains the default configuration from the OpenAPI spec,
 * and we override it with our runtime environment-based configuration.
 */
export const createClientConfig: CreateClientConfig = (config) => ({
	...config,
	baseUrl: API_CONSTANTS.PROXY_PATH,
	// You can add other runtime configurations here
	// headers: {
	//   ...config.headers,
	//   ...API_CONSTANTS.CUSTOM_HEADERS,
	// },
});
