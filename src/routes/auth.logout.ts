import { createFileRoute } from "@tanstack/react-router";
import { clearUserSession } from "../lib/auth-server";

export const Route = createFileRoute("/auth/logout")({
	server: {
		handlers: {
			GET: async () => {
				try {
					// Clear the user session
					await clearUserSession();

					// Redirect to home page
					return new Response(null, {
						status: 302,
						headers: { Location: "/" },
					})
				} catch (error) {
					console.error("Logout failed:", error);
					return new Response(null, {
						status: 302,
						headers: { Location: "/?error=logout_failed" },
					})
				}
			},
		},
	},
});
