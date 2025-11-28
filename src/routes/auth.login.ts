import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { updateSession } from "@tanstack/react-start/server";
import { getAuthUrl } from "../lib/oidc";
import { OIDC_CONSTANTS } from "../lib/constants";

export const Route = createFileRoute("/auth/login")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const { url, state, codeVerifier } = await getAuthUrl();

					// Store state and codeVerifier in session for callback verification
					await updateSession(
						{
							password: OIDC_CONSTANTS.SESSION_SECRET,
						},
						{
							oidcState: state,
							codeVerifier,
						},
					);

					return json({
						authUrl: url.toString(),
					});
				} catch (error) {
					console.error("Login URL generation failed:", error);
					return new Response("Failed to generate login URL", { status: 500 });
				}
			},
		},
	},
});
