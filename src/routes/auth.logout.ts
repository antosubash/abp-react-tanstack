import { redirect } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { clearSession } from "../lib/auth-server";

export const APIRoute = createAPIFileRoute("/api/auth/logout")({
	loader: async ({ request }) => {
		try {
			// Clear the user session
			await clearSession(request);

			// Redirect to home page
			throw redirect("/", 302);
		} catch (error) {
			console.error("Logout failed:", error);
			throw redirect("/?error=logout_failed", 302);
		}
	},
});
