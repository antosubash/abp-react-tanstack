import { createFileRoute } from "@tanstack/react-router";
import { performLogout } from "../lib/auth-server";

export const Route = createFileRoute("/auth/logout")({
	server: {
		handlers: {
			GET: async () => {
				try {
					// Perform complete logout including token revocation and session clearing
					const { endSessionUrl } = await performLogout();

					// If we have an end session URL, redirect to it for RP-initiated logout
					if (endSessionUrl) {
						return new Response(null, {
							status: 302,
							headers: { Location: endSessionUrl },
						});
					}

					// Fallback: redirect to home page if no end session URL
					return new Response(null, {
						status: 302,
						headers: { Location: "/" },
					});
				} catch (error) {
					console.error("Logout failed:", error);
					return new Response(null, {
						status: 302,
						headers: { Location: "/?error=logout_failed" },
					});
				}
			},
		},
	},
});
