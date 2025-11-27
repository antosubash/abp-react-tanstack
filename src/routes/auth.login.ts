import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getServerSession } from "@tanstack/react-start/server";
import { getAuthUrl } from "../lib/oidc";
import { OIDC_CONSTANTS } from "../lib/constants";

export const APIRoute = createAPIFileRoute("/api/auth/login")({
	loader: async ({ request }) => {
		try {
			const { url, state, codeVerifier } = await getAuthUrl();

			// Store state and codeVerifier in session for callback verification
			await getServerSession({
				request,
				password: OIDC_CONSTANTS.SESSION_SECRET,
				data: {
					oidcState: state,
					codeVerifier,
				},
			});

			return json({
				authUrl: url.toString(),
			});
		} catch (error) {
			console.error("Login URL generation failed:", error);
			throw new Response("Failed to generate login URL", { status: 500 });
		}
	},
});
