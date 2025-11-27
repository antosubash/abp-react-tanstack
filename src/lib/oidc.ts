import {
	discovery,
	randomState,
	randomPKCECodeVerifier,
	calculatePKCECodeChallenge,
	buildAuthorizationUrl,
	authorizationCodeGrant,
	refreshTokenGrant,
	fetchUserInfo,
	tokenRevocation,
	type Configuration,
	type TokenEndpointResponse,
	type TokenEndpointResponseHelpers,
} from "openid-client";
import { OIDC_CONSTANTS } from "./constants";

let oidcConfig: Configuration | null = null;

/**
 * Get OpenID Connect configuration
 */
export async function getOIDCConfig(): Promise<Configuration> {
	if (oidcConfig) {
		return oidcConfig;
	}

	try {
		oidcConfig = await discovery(
			new URL(OIDC_CONSTANTS.ISSUER),
			OIDC_CONSTANTS.CLIENT_ID,
			{
				client_secret: OIDC_CONSTANTS.CLIENT_SECRET,
			},
		);
		return oidcConfig;
	} catch (error) {
		console.error("Failed to discover OIDC configuration:", error);
		throw new Error("OIDC configuration discovery failed");
	}
}

/**
 * Generate authorization URL for login
 */
export async function getAuthUrl(): Promise<{
	url: URL;
	state: string;
	codeVerifier: string;
}> {
	const config = await getOIDCConfig();
	const codeVerifier = randomPKCECodeVerifier();
	const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
	const state = randomState();

	const url = buildAuthorizationUrl(config, {
		redirect_uri: OIDC_CONSTANTS.REDIRECT_URI,
		scope: OIDC_CONSTANTS.SCOPES.join(" "),
		state,
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
		response_type: OIDC_CONSTANTS.RESPONSE_TYPE,
	});

	return { url, state, codeVerifier };
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
	code: string,
	codeVerifier: string,
	state: string,
): Promise<TokenEndpointResponse & TokenEndpointResponseHelpers> {
	const config = await getOIDCConfig();

	try {
		// Construct the callback URL with the authorization code and state
		const callbackUrl = new URL(OIDC_CONSTANTS.REDIRECT_URI);
		callbackUrl.searchParams.set("code", code);
		callbackUrl.searchParams.set("state", state);

		const tokenSet = await authorizationCodeGrant(config, callbackUrl, {
			pkceCodeVerifier: codeVerifier,
			expectedState: state,
		});

		return tokenSet;
	} catch (error) {
		console.error("Token exchange failed:", error);
		throw new Error("Failed to exchange authorization code for tokens");
	}
}

/**
 * Refresh access token
 */
export async function refreshToken(
	refreshToken: string,
): Promise<TokenEndpointResponse & TokenEndpointResponseHelpers> {
	const config = await getOIDCConfig();

	try {
		const tokenSet = await refreshTokenGrant(config, refreshToken);
		return tokenSet;
	} catch (error) {
		console.error("Token refresh failed:", error);
		throw new Error("Failed to refresh access token");
	}
}

/**
 * Get user info from access token
 */
export async function getUserInfo(
	accessToken: string,
): Promise<Record<string, unknown>> {
	const config = await getOIDCConfig();

	try {
		const userinfo = await fetchUserInfo(config, accessToken, "Bearer");
		return userinfo;
	} catch (error) {
		console.error("Failed to get user info:", error);
		throw new Error("Failed to retrieve user information");
	}
}

/**
 * Revoke token
 */
export async function revokeToken(
	token: string,
	tokenTypeHint?: string,
): Promise<void> {
	const config = await getOIDCConfig();

	try {
		await tokenRevocation(config, token, tokenTypeHint ? {
			token_type_hint: tokenTypeHint,
		} : {});
	} catch (error) {
		console.error("Token revocation failed:", error);
		throw new Error("Failed to revoke token");
	}
}
