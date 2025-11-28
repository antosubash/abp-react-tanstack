import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Zap,
	Server,
	Route as RouteIcon,
	Shield,
	Waves,
	Sparkles,
	LogIn,
	User,
	ArrowRight,
} from "lucide-react";
import { useAuthCombined } from "../hooks/use-auth";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { user, isAuthenticated, isLoading, login, error, clearError } = useAuthCombined();

	const features = [
		{
			icon: <Zap className="w-12 h-12 text-cyan-400" />,
			title: "Powerful Server Functions",
			description:
				"Write server-side code that seamlessly integrates with your client components. Type-safe, secure, and simple.",
		},
		{
			icon: <Server className="w-12 h-12 text-cyan-400" />,
			title: "Flexible Server Side Rendering",
			description:
				"Full-document SSR, streaming, and progressive enhancement out of the box. Control exactly what renders where.",
		},
		{
			icon: <RouteIcon className="w-12 h-12 text-cyan-400" />,
			title: "API Routes",
			description:
				"Build type-safe API endpoints alongside your application. No separate backend needed.",
		},
		{
			icon: <Shield className="w-12 h-12 text-cyan-400" />,
			title: "Strongly Typed Everything",
			description:
				"End-to-end type safety from server to client. Catch errors before they reach production.",
		},
		{
			icon: <Waves className="w-12 h-12 text-cyan-400" />,
			title: "Full Streaming Support",
			description:
				"Stream data from server to client progressively. Perfect for AI applications and real-time updates.",
		},
		{
			icon: <Sparkles className="w-12 h-12 text-cyan-400" />,
			title: "Next Generation Ready",
			description:
				"Built from the ground up for modern web applications. Deploy anywhere JavaScript runs.",
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			<section className="relative py-20 px-6 text-center overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
				<div className="relative max-w-5xl mx-auto">
					<div className="flex items-center justify-center gap-6 mb-6">
						<img
							src="/tanstack-circle-logo.png"
							alt="TanStack Logo"
							className="w-24 h-24 md:w-32 md:h-32"
						/>
						<h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
							<span className="text-gray-300">TANSTACK</span>{" "}
							<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
								START
							</span>
						</h1>
					</div>
					<p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
						The framework for next generation AI applications
					</p>
					<p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
						Full-stack framework powered by TanStack Router for React and Solid.
						Build modern applications with server functions, streaming, and type
						safety.
					</p>

					{/* Authentication-based content */}
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
						</div>
					) : isAuthenticated ? (
						<div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8 max-w-md mx-auto">
							<div className="flex items-center gap-4 mb-4">
								{user?.picture ? (
									<img
										src={user.picture}
										alt={user.name || "User"}
										className="w-12 h-12 rounded-full"
									/>
								) : (
									<div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center">
										<User size={24} />
									</div>
								)}
								<div>
									<h3 className="text-xl font-semibold text-white">
										Welcome back, {user?.name || user?.preferred_username || "User"}!
									</h3>
									<p className="text-gray-400 text-sm">You're signed in and ready to explore</p>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<Link
									to="/dashboard"
									className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
								>
									<User size={16} />
									Go to Dashboard
								</Link>
								<a
									href="https://tanstack.com/start"
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
								>
									Documentation
									<ArrowRight size={16} />
								</a>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							{error && (
								<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md">
									<div className="flex items-start gap-3">
										<div className="text-red-400 mt-0.5">
											<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
											</svg>
										</div>
										<div className="flex-1">
											<p className="text-red-400 text-sm font-medium">Authentication Error</p>
											<p className="text-red-300 text-sm mt-1">{error}</p>
											<button
												onClick={clearError}
												className="text-red-400 hover:text-red-300 text-sm underline mt-2"
											>
												Dismiss
											</button>
										</div>
									</div>
								</div>
							)}
							<button
								type="button"
								onClick={login}
								disabled={isLoading}
								className="flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
							>
								<LogIn size={16} />
								{isLoading ? "Signing In..." : "Sign In to Get Started"}
							</button>
							<p className="text-gray-400 text-sm mt-2">
								Begin your TanStack Start journey by editing{" "}
								<code className="px-2 py-1 bg-slate-700 rounded text-cyan-400">
									/src/routes/index.tsx
								</code>
							</p>
						</div>
					)}
				</div>
			</section>

			<section className="py-16 px-6 max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
						>
							<div className="mb-4">{feature.icon}</div>
							<h3 className="text-xl font-semibold text-white mb-3">
								{feature.title}
							</h3>
							<p className="text-gray-400 leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
