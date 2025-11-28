import type { ReactNode } from "react";
import { useAuthState } from "../hooks/use-auth";

interface ProtectedRouteProps {
	children: ReactNode;
	fallback?: ReactNode;
	loading?: ReactNode;
}

/**
 * Protected route component that requires authentication
 */
export function ProtectedRoute({
	children,
	fallback,
	loading,
}: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuthState();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			loading || (
				<div className="flex items-center justify-center min-h-screen">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
						<p className="text-gray-600">Checking authentication...</p>
					</div>
				</div>
			)
		);
	}

	// Show fallback (login prompt) if not authenticated
	if (!isAuthenticated) {
		return (
			fallback || (
				<div className="flex items-center justify-center min-h-screen bg-gray-50">
					<div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
						<div className="mb-6">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<svg
									className="w-8 h-8 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Authentication required"
								>
									<title>Authentication required</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m0 4h.01M21 12c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8z"
									/>
								</svg>
							</div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								Authentication Required
							</h2>
							<p className="text-gray-600 mb-6">
								You need to be logged in to access this page.
							</p>
							<button
								type="button"
								onClick={() => {
									window.location.href = "/";
								}}
								className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
							>
								Go to Home
							</button>
						</div>
					</div>
				</div>
			)
		);
	}

	// Render children if authenticated
	return <>{children}</>;
}
