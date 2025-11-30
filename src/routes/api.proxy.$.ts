import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { APP_CONSTANTS } from "../constants";
import { performApiProxy } from "../infrastructure/auth/auth-server";

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
		// Extract path from request URL
		const url = new URL(request.url);
		const path = url.pathname.replace("/api/proxy/", "");

		// Only allow proxy to API endpoints
		const targetUrl = `${APP_CONSTANTS.API_BASE_URL}/${path}`;

		// Add query parameters to target URL
		const queryString = url.search;

		// Add query parameters to target URL
		const finalTargetUrl = queryString
			? `${targetUrl}${queryString}`
			: targetUrl;

		// Prepare headers
		const headers = new Headers();
		headers.set("Content-Type", "application/json");
		headers.set("__tenant", "");

		// Add access token if available
		try {
			const session = await performApiProxy(request);
			if (session?.accessToken) {
				headers.set("Authorization", `Bearer ${session.accessToken}`);
			}
		} catch (sessionError) {
			console.warn(
				"Failed to retrieve session for proxy request:",
				sessionError,
			);
			// Continue without authorization header
		}
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
		const responseHeaders = new Headers(response.headers);

		// Add CORS headers if needed
		responseHeaders.set("Access-Control-Allow-Origin", "*");
		responseHeaders.set(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD",
		);
		responseHeaders.set("Access-Control-Allow-Headers", "*");

		// Handle 204 No Content responses which should not have a body
		if (response.status === 204) {
			return new Response(null, {
				status: 204,
				statusText: response.statusText,
				headers: responseHeaders,
			});
		}

		// For other responses, include the body
		const responseBody = await response.arrayBuffer();

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
