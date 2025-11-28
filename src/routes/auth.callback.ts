import { redirect } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getServerSession } from "@tanstack/react-start/server";
import { exchangeCodeForTokens } from "../lib/oidc";
import { createSession } from "../lib/auth-server";
import { OIDC_CONSTANTS } from "../lib/constants";

export const APIRoute = createAPIFileRoute("/api/auth/callback")({
	loader: async ({ request }) => {
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");
		const error = url.searchParams.get("error");

		if (error) {
			console.error("OIDC callback error:", error);
			throw redirect("/?error=auth_failed", 302);
		}

		if (!code || !state) {
			console.error("Missing code or state parameter");
			throw redirect("/?error=missing_params", 302);
		}

		try {
			// Retrieve stored state and codeVerifier from session
			const session = await getServerSession({
				request,
				password: OIDC_CONSTANTS.SESSION_SECRET,
			});

			if (!session || !session.oidcState || !session.codeVerifier) {
				console.error("Missing session data");
				throw redirect("/?error=invalid_session", 302);
			}

			if (session.oidcState !== state) {
				console.error("State mismatch");
				throw redirect("/?error=state_mismatch", 302);
			}

			const tokenSet = await exchangeCodeForTokens(
				code,
				session.codeVerifier,
				state,
			);

			// Create user session
			await createSession(request, tokenSet);

			// Clear the temporary OIDC session data
			await getServerSession({
				request,
				password: OIDC_CONSTANTS.SESSION_SECRET,
				data: null,
			});

			// Redirect to dashboard or home page
			throw redirect("/dashboard", 302);
		} catch (error) {
			console.error("Callback processing failed:", error);
			throw redirect("/?error=auth_failed", 302);
		}
	},
});
