import { createFileRoute } from "@tanstack/react-router";
import { getAuthUrl } from "@/infrastructure/auth/oidc";
import { oidcSessionUtils } from "@/infrastructure/auth/session";

interface LoginResponse {
	authUrl: string;
}

const json = (data: LoginResponse) => Response.json(data);

export const Route = createFileRoute("/auth/login")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const { url, state, codeVerifier } = await getAuthUrl();

					// Store state and codeVerifier in session for callback verification
					await oidcSessionUtils.update({
						oidcState: state,
						codeVerifier,
					});

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
