// utils/session.ts
import { useSession } from "@tanstack/react-start/server";
import { OIDC_CONSTANTS } from "./constants";
import type { User } from "./auth-server";

type SessionData = {
	user: User;
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
};

export function useAppSession() {
	return useSession<SessionData>({
		// Session configuration
		name: OIDC_CONSTANTS.SESSION_COOKIE_NAME,
		password: OIDC_CONSTANTS.SESSION_SECRET, // At least 32 characters
		// Optional: customize cookie settings
		cookie: {
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			httpOnly: true,
		},
	});
}
