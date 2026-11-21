// utils/session.ts
import { getCookie, setCookie } from "@tanstack/react-start/server";
import {
	type CookieJar,
	getIronSession,
	type SessionOptions,
} from "iron-session";
import { OIDC_CONSTANTS } from "../constants";

export interface User {
	sub: string;
	name?: string;
	email?: string;
	email_verified?: boolean;
	picture?: string;
	profile?: string;
	preferred_username?: string;
	given_name?: string;
	family_name?: string;
	updated_at?: number;
	roles?: string[];
}

export type SessionData = {
	user: User;
	accessToken: string;
	refreshToken?: string;
	idToken?: string;
	expiresAt: number;
};

export type OidcStateSessionData = {
	oidcState?: string;
	codeVerifier?: string;
};

const baseCookieOptions = {
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	httpOnly: true,
	path: "/",
};

const sessionOptions: SessionOptions = {
	cookieName: OIDC_CONSTANTS.SESSION_COOKIE_NAME,
	password: OIDC_CONSTANTS.SESSION_SECRET,
	chunk: true,
	cookieOptions: baseCookieOptions,
};

const oidcSessionOptions: SessionOptions = {
	cookieName: `${OIDC_CONSTANTS.SESSION_COOKIE_NAME}-oidc`,
	password: OIDC_CONSTANTS.SESSION_SECRET,
	ttl: 15 * 60,
	cookieOptions: baseCookieOptions,
};

function getCookieJar(): CookieJar {
	return {
		read: (name) => getCookie(name),
		write: (name, value, options) => setCookie(name, value, options),
	};
}

function getAppSession() {
	return getIronSession<SessionData>(getCookieJar(), sessionOptions);
}

/**
 * Server-side session management utilities
 */
export const sessionUtils = {
	/**
	 * Get the current session data
	 */
	async get(): Promise<SessionData | null> {
		try {
			const session = await getAppSession();

			if (
				!session.user ||
				!session.accessToken ||
				session.expiresAt === undefined
			) {
				return null;
			}

			return {
				user: session.user,
				accessToken: session.accessToken,
				refreshToken: session.refreshToken,
				idToken: session.idToken,
				expiresAt: session.expiresAt,
			};
		} catch (error) {
			console.error("Session retrieval failed:", error);
			return null;
		}
	},

	/**
	 * Update the session with new data
	 */
	async update(sessionData: SessionData): Promise<void> {
		try {
			const session = await getAppSession();
			session.user = sessionData.user;
			session.accessToken = sessionData.accessToken;
			session.refreshToken = sessionData.refreshToken;
			session.idToken = sessionData.idToken;
			session.expiresAt = sessionData.expiresAt;
			await session.save();
		} catch (error) {
			console.error("Session update failed:", error);
			throw new Error("Failed to update session");
		}
	},

	/**
	 * Clear the current session
	 */
	async clear(): Promise<void> {
		try {
			const session = await getAppSession();
			session.destroy();
		} catch (error) {
			console.error("Session clear failed:", error);
			throw new Error("Failed to clear session");
		}
	},
};

export const oidcSessionUtils = {
	async get(): Promise<OidcStateSessionData | null> {
		try {
			const session = await getIronSession<OidcStateSessionData>(
				getCookieJar(),
				oidcSessionOptions,
			);
			if (!session.oidcState && !session.codeVerifier) {
				return null;
			}
			return {
				oidcState: session.oidcState,
				codeVerifier: session.codeVerifier,
			};
		} catch (error) {
			console.error("OIDC session retrieval failed:", error);
			return null;
		}
	},

	async update(data: OidcStateSessionData): Promise<void> {
		const session = await getIronSession<OidcStateSessionData>(
			getCookieJar(),
			oidcSessionOptions,
		);
		session.oidcState = data.oidcState;
		session.codeVerifier = data.codeVerifier;
		await session.save();
	},

	async clear(): Promise<void> {
		const session = await getIronSession<OidcStateSessionData>(
			getCookieJar(),
			oidcSessionOptions,
		);
		session.destroy();
	},
};

// Export individual functions for convenience
export const getUserSession = sessionUtils.get;
