import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { API_CONSTANTS } from "../lib/constants";

export const Route = createFileRoute("/api/proxy/$")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				return handleProxyRequest(request);
			},
			POST: async ({ request }) => {
				return handleProxyRequest(request);
			},
			PUT: async ({ request }) => {
				return handleProxyRequest(request);
			},
			PATCH: async ({ request }) => {
				return handleProxyRequest(request);
			},
			DELETE: async ({ request }) => {
				return handleProxyRequest(request);
			},
			OPTIONS: async ({ request }) => {
				return handleProxyRequest(request);
			},
			HEAD: async ({ request }) => {
				return handleProxyRequest(request);
			},
		},
	},
});

async function handleProxyRequest(request: Request) {
	try {
		// Extract the path from the request URL
		const url = new URL(request.url);
		const path = url.pathname.replace("/api/proxy/", "");

		// Construct the target URL
		const targetUrl = `${API_CONSTANTS.BASE_URL}/${path}`;
		const queryString = url.search;

		// Add query parameters to target URL
		const finalTargetUrl = queryString
			? `${targetUrl}${queryString}`
			: targetUrl;

		// Prepare headers
		const headers = new Headers(request.headers);

		// Remove host header to avoid conflicts
		headers.delete("host");

		// Add custom headers
		Object.entries(API_CONSTANTS.CUSTOM_HEADERS).forEach(([key, value]) => {
			headers.set(key, value);
		});

		// Create the proxy request
		const proxyRequest = new Request(finalTargetUrl, {
			method: request.method,
			headers,
			body:
				request.method !== "GET" && request.method !== "HEAD"
					? request.body
					: undefined,
			// Don't set duplex for now as it might cause issues
		});

		// Make the request to the actual API
		const response = await fetch(proxyRequest);

		// Create a new response with the proxied data
		const responseBody = await response.arrayBuffer();
		const responseHeaders = new Headers(response.headers);

		// Add CORS headers if needed
		responseHeaders.set("Access-Control-Allow-Origin", "*");
		responseHeaders.set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD",
		);
		responseHeaders.set("Access-Control-Allow-Headers", "*");

		return new Response(responseBody, {
			status: response.status,
			statusText: response.statusText,
			headers: responseHeaders,
		});
	} catch (error) {
		console.error("Proxy error:", error);

		return json(
			{
				error: "Proxy request failed",
				message: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
