import { createFileRoute } from "@tanstack/react-router";
import { getSession, clearSession } from "@tanstack/react-start/server";
import { exchangeCodeForTokens } from "../lib/oidc";
import { createSession } from "../lib/auth-server";
import { OIDC_CONSTANTS } from "../lib/constants";

export const Route = createFileRoute("/auth/callback")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const code = url.searchParams.get("code");
				const state = url.searchParams.get("state");
				const error = url.searchParams.get("error");

				if (error) {
					console.error("OIDC callback error:", error);
					return new Response(null, {
						status: 302,
						headers: { Location: "/?error=auth_failed" },
					})
				}

				if (!code || !state) {
					console.error("Missing code or state parameter");
					return new Response(null, {
						status: 302,
						headers: { Location: "/?error=missing_params" },
					})
				}

				try {
					// Retrieve stored state and codeVerifier from session
					const session = await getSession({
						password: OIDC_CONSTANTS.SESSION_SECRET,
					})

					if (!session || !(session.data as any).oidcState || !(session.data as any).codeVerifier) {
						console.error("Missing session data");
						return new Response(null, {
							status: 302,
							headers: { Location: "/?error=invalid_session" },
						})
					}

					if ((session.data as any).oidcState !== state) {
						console.error("State mismatch");
						return new Response(null, {
							status: 302,
							headers: { Location: "/?error=state_mismatch" },
						})
					}

					const tokenSet = await exchangeCodeForTokens(
						code,
						(session.data as any).codeVerifier,
						state,
					)

					// Create user session
					await createSession(tokenSet);

			// Clear the temporary OIDC session data
			await clearSession({
				password: OIDC_CONSTANTS.SESSION_SECRET,
			})

					// Redirect to dashboard or home page
					return new Response(null, {
						status: 302,
						headers: { Location: "/dashboard" },
					})
				} catch (error) {
					console.error("Callback processing failed:", error);
					return new Response(null, {
						status: 302,
						headers: { Location: "/?error=auth_failed" },
					})
				}
			},
		},
	},
});
