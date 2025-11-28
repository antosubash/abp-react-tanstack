import { getServerSession } from "@tanstack/react-start/server";
import { OIDC_CONSTANTS } from "./constants";
import { getUserInfo, refreshToken } from "./oidc";
import type {
	TokenEndpointResponse,
	TokenEndpointResponseHelpers,
} from "openid-client";

// Session types
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
}

export interface SessionData {
	user: User;
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
}

/**
 * Get session from request
 */
export async function getSession(
	request: Request,
): Promise<SessionData | null> {
	try {
		const session = await getServerSession({
			request,
			password: OIDC_CONSTANTS.SESSION_SECRET,
		});

		if (!session) {
			return null;
		}

		const sessionData = session as SessionData;

		// Check if token is expired and try to refresh
		if (Date.now() >= sessionData.expiresAt) {
			if (sessionData.refreshToken) {
				try {
					const newTokens = await refreshToken(sessionData.refreshToken);
					const accessToken = newTokens.access_token;
					if (!accessToken) {
						throw new Error("No access token in refresh response");
					}
					sessionData.accessToken = accessToken;
					sessionData.refreshToken = newTokens.refresh_token;
					sessionData.expiresAt =
						Date.now() + (newTokens.expiresIn?.() || 3600) * 1000;

					// Update session with new tokens
					await updateSession(request, sessionData);
				} catch (error) {
					console.error("Token refresh failed:", error);
					// Token refresh failed, clear session
					await clearSession(request);
					return null;
				}
			} else {
				// No refresh token available, clear session
				await clearSession(request);
				return null;
			}
		}

		return sessionData;
	} catch (error) {
		console.error("Session retrieval failed:", error);
		return null;
	}
}

/**
 * Create/update session with user data
 */
export async function createSession(
	request: Request,
	tokenResponse: TokenEndpointResponse & TokenEndpointResponseHelpers,
): Promise<SessionData> {
	try {
		// Get user info from OIDC provider
		const accessToken = tokenResponse.access_token;
		if (!accessToken) {
			throw new Error("No access token in response");
		}

		const userInfo = await getUserInfo(accessToken);

		const sessionData: SessionData = {
			user: userInfo as User,
			accessToken,
			refreshToken: tokenResponse.refresh_token,
			expiresAt: Date.now() + (tokenResponse.expiresIn?.() || 3600) * 1000,
		};

		await getServerSession({
			request,
			password: OIDC_CONSTANTS.SESSION_SECRET,
			data: sessionData,
		});

		return sessionData;
	} catch (error) {
		console.error("Session creation failed:", error);
		throw new Error("Failed to create user session");
	}
}

/**
 * Update existing session
 */
export async function updateSession(
	request: Request,
	sessionData: SessionData,
): Promise<void> {
	try {
		await getServerSession({
			request,
			password: OIDC_CONSTANTS.SESSION_SECRET,
			data: sessionData,
		});
	} catch (error) {
		console.error("Session update failed:", error);
		throw new Error("Failed to update session");
	}
}

/**
 * Clear user session
 */
export async function clearSession(request: Request): Promise<void> {
	try {
		await getServerSession({
			request,
			password: OIDC_CONSTANTS.SESSION_SECRET,
			data: null,
		});
	} catch (error) {
		console.error("Session clear failed:", error);
	}
}

/**
 * Check if user is authenticated
 */
export async function requireAuth(request: Request): Promise<SessionData> {
	const session = await getSession(request);

	if (!session) {
		throw new Response("Unauthorized", { status: 401 });
	}

	return session;
}
