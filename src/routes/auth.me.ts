import { createFileRoute } from "@tanstack/react-router";
import { getUserSession } from "@/infrastructure/auth/session";
import type { User } from "@/infrastructure/auth/session";

interface MeResponse {
	user: User | null;
	expiresAt?: number;
}

const json = (data: MeResponse) => Response.json(data);

export const Route = createFileRoute("/auth/me")({
	server: {
		handlers: {
			GET: async () => {
				try {
					const session = await getUserSession();

					if (!session) {
						return json({ user: null });
					}

					// Return user info without sensitive tokens
					return json({
						user: session.user,
						expiresAt: session.expiresAt,
					});
				} catch (error) {
					console.error("Session retrieval failed:", error);
					return json({ user: null });
				}
			},
		},
	},
});
