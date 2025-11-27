import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuthState } from "../hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
	component: DashboardComponent,
});

function DashboardComponent() {
	const { user } = useAuthState();

	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
				<div className="container mx-auto px-6 py-12">
					<div className="max-w-4xl mx-auto">
						<h1 className="text-4xl font-bold text-white mb-8">Dashboard</h1>

						<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
							<h2 className="text-2xl font-semibold text-white mb-6">
								Welcome back, {user?.name || user?.preferred_username || "User"}
								!
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="bg-slate-700/50 rounded-lg p-6">
									<h3 className="text-lg font-semibold text-white mb-3">
										User Information
									</h3>
									<div className="space-y-2 text-gray-300">
										<p>
											<span className="font-medium">Email:</span> {user?.email}
										</p>
										<p>
											<span className="font-medium">Verified:</span>{" "}
											{user?.email_verified ? "Yes" : "No"}
										</p>
										<p>
											<span className="font-medium">Subject:</span> {user?.sub}
										</p>
									</div>
								</div>

								<div className="bg-slate-700/50 rounded-lg p-6">
									<h3 className="text-lg font-semibold text-white mb-3">
										Quick Actions
									</h3>
									<div className="space-y-3">
										<button
											type="button"
											className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
										>
											View Profile
										</button>
										<button
											type="button"
											className="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
										>
											Settings
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
}
