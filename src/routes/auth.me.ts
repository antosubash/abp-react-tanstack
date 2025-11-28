import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import { getUserSession } from "../lib/auth-server";

export const Route = createFileRoute("/auth/me")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const session = await getUserSession();

					console.log("session", session);

					if (!session) {
						return json({ user: null }, { status: 401 });
					}

					// Return user info without sensitive tokens
					return json({
						user: session.user,
						expiresAt: session.expiresAt,
					})
				} catch (error) {
					console.error("Session retrieval failed:", error);
					return json({ user: null }, { status: 500 });
				}
			},
		},
	},
});
