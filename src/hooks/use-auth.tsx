import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Types
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

export interface AuthState {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

// Context
const AuthContext = createContext<{
	login: () => Promise<void>;
	logout: () => Promise<void>;
	refresh: () => Promise<void>;
} | null>(null);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
	const [_authState, setAuthState] = useState<AuthState>({
		user: null,
		isLoading: true,
		isAuthenticated: false,
	});

	const queryClient = useQueryClient();

	// Query for user data
	const { data: userData, isLoading } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const response = await fetch("/api/auth/me");
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			return response.json();
		},
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Update auth state when user data changes
	useEffect(() => {
		setAuthState({
			user: userData?.user || null,
			isLoading,
			isAuthenticated: !!userData?.user,
		});
	}, [userData, isLoading]);

	// Login function
	const login = async () => {
		try {
			const response = await fetch("/api/auth/login");
			if (!response.ok) {
				throw new Error("Failed to initiate login");
			}

			const { authUrl, state, codeVerifier } = await response.json();

			// Store state and codeVerifier for callback verification
			sessionStorage.setItem("oidc_state", state);
			sessionStorage.setItem("oidc_code_verifier", codeVerifier);

			// Redirect to OIDC provider
			window.location.href = authUrl;
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	};

	// Logout function
	const logout = async () => {
		try {
			const response = await fetch("/api/auth/logout");
			if (response.redirected) {
				window.location.href = response.url;
			} else {
				// Fallback: clear local state and redirect
				setAuthState({
					user: null,
					isLoading: false,
					isAuthenticated: false,
				});
				queryClient.clear();
				window.location.href = "/";
			}
		} catch (error) {
			console.error("Logout failed:", error);
			// Fallback: clear local state and redirect
			setAuthState({
				user: null,
				isLoading: false,
				isAuthenticated: false,
			});
			queryClient.clear();
			window.location.href = "/";
		}
	};

	// Refresh user data
	const refresh = async () => {
		await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
	};

	const value = {
		login,
		logout,
		refresh,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

// Hook to get auth state
export function useAuthState(): AuthState {
	const { data: userData, isLoading } = useQuery({
		queryKey: ["auth", "me"],
		queryFn: async () => {
			const response = await fetch("/api/auth/me");
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}
			return response.json();
		},
		retry: false,
		staleTime: 5 * 60 * 1000,
	});

	return {
		user: userData?.user || null,
		isLoading,
		isAuthenticated: !!userData?.user,
	};
}
