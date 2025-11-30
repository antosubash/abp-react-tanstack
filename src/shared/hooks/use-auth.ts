import { useAppSession, type User } from "@/infrastructure/auth/session";

export function useAuth() {
	const sessionManager = useAppSession();
	type SessionManagerWithData = {
		data?: { user?: User } | null;
		isPending?: boolean;
	};
	const sessionManagerTyped = sessionManager as SessionManagerWithData | null;
	const session = sessionManagerTyped?.data ?? null;
	const isLoading =
		sessionManager &&
		typeof sessionManager === "object" &&
		"isPending" in sessionManager
			? (sessionManager.isPending as boolean)
			: false;

	return {
		user: session?.user || null,
		isAuthenticated: !!session?.user,
		isLoading,
		login: async () => {
			// This would be implemented with actual login logic
			window.location.href = "/auth/login";
		},
		logout: async () => {
			// This would be implemented with actual logout logic
			window.location.href = "/auth/logout";
		},
		refresh: async () => {
			// This would be implemented with actual refresh logic
			window.location.reload();
		},
		clearError: () => {
			// This would be implemented with actual error clearing logic
		},
		authState: {
			isAuthenticated: !!session?.user,
			isLoading,
			user: session?.user || null,
		},
	};
}
