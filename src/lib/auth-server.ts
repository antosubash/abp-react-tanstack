import { getUserInfo, refreshToken } from "./oidc";
import type {
	TokenEndpointResponse,
	TokenEndpointResponseHelpers,
} from "openid-client";
import { useAppSession } from "./session";

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
export async function getUserSession(): Promise<SessionData | null> {
	try {
		const session = await useAppSession();

		if (!session || !session.data) {
			return null;
		}

		const sessionData = session.data as SessionData;

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
					await session.update(sessionData);
				} catch (error) {
					console.error("Token refresh failed:", error);
					// Token refresh failed, clear session
					await clearUserSession();
					return null;
				}
			} else {
				// No refresh token available, clear session
				await clearUserSession();
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
	tokenResponse: TokenEndpointResponse & TokenEndpointResponseHelpers,
): Promise<SessionData> {
	try {
		// Get user info from token claims instead of user info endpoint
		const accessToken = tokenResponse.access_token;
		if (!accessToken) {
			throw new Error("No access token in response");
		}

		// Extract user claims from the ID token
		let claims = tokenResponse.claims();
		if (!claims) {
			throw new Error("No claims found in token response");
		}

		const { sub } = claims;
		if (!sub) {
			throw new Error("No subject (sub) claim found in token");
		}

		// Use claims as user info, with fallback to getUserInfo if needed
		let userInfo: Record<string, unknown> = claims;

		// Try to get additional user info from user info endpoint if available
		try {
			const additionalUserInfo = await getUserInfo(accessToken, sub as string);
			// Merge claims with additional user info, giving priority to claims for core fields
			userInfo = { ...additionalUserInfo, ...claims };
		} catch (userInfoError) {
			console.warn("Could not fetch additional user info, using token claims only:", userInfoError);
			// Continue with claims only
		}

		const sessionData: SessionData = {
			user: userInfo as unknown as User,
			accessToken,
			refreshToken: tokenResponse.refresh_token,
			expiresAt: Date.now() + (tokenResponse.expiresIn?.() || 3600) * 1000,
		};

		const session = await useAppSession();
		await session.update(sessionData);
		return sessionData;
	} catch (error) {
		console.error("Session creation failed:", error);
		throw new Error("Failed to create user session");
	}
}

/**
 * Update existing session
 */
export async function updateUserSession(
	sessionData: SessionData,
): Promise<void> {
	try {
		const session = await useAppSession();
		await session.update(sessionData);
	} catch (error) {	
		console.error("Session update failed:", error);
		throw new Error("Failed to update session");
	}
}

/**
 * Clear user session
 */
export async function clearUserSession(): Promise<void> {
	try {
		const session = await useAppSession();
		await session.clear();
	} catch (error) {
		console.error("Session clear failed:", error);
		throw new Error("Failed to clear session");
	}
}
