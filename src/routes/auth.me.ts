import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { getSession } from "../lib/auth-server";

export const APIRoute = createAPIFileRoute("/api/auth/me")({
	loader: async ({ request }) => {
		try {
			const session = await getSession(request);

			if (!session) {
				return json({ user: null }, { status: 401 });
			}

			// Return user info without sensitive tokens
			return json({
				user: session.user,
				expiresAt: session.expiresAt,
			});
		} catch (error) {
			console.error("Session retrieval failed:", error);
			return json({ user: null }, { status: 500 });
		}
	},
});
