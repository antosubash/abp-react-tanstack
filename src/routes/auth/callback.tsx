import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/callback")({
	beforeLoad: async () => {
		// Redirect to API callback route to handle the authentication
		const currentUrl = window.location.href;
		window.location.href = `/api/auth/callback${new URL(currentUrl).search}`;
	},

	component: CallbackComponent,
});

function CallbackComponent() {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
				<p className="text-gray-600">Completing authentication...</p>
			</div>
		</div>
	);
}
