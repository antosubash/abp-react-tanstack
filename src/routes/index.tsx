import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	ArrowRight,
	LogIn,
	Route as RouteIcon,
	Server,
	Shield,
	Sparkles,
	User,
	Waves,
	Zap,
} from "lucide-react";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { useAuthCombined } from "@/features/auth/hooks/use-auth";

export const Route = createFileRoute("/")({ component: App });

function App() {
	const { user, isAuthenticated, isLoading, login, error, clearError } =
		useAuthCombined();

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
		<div className="min-h-screen bg-background">
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
										Welcome back,{" "}
										{user?.name || user?.preferred_username || "User"}!
									</h3>
									<p className="text-gray-400 text-sm">
										You're signed in and ready to explore
									</p>
								</div>
							</div>
							<div className="flex flex-col sm:flex-row gap-3">
								<Button asChild className="flex-1">
									<Link to="/dashboard">
										<User size={16} />
										Go to Dashboard
									</Link>
								</Button>
								<Button asChild variant="outline" className="flex-1">
									<a
										href="https://tanstack.com/start"
										target="_blank"
										rel="noopener noreferrer"
									>
										Documentation
										<ArrowRight size={16} />
									</a>
								</Button>
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center gap-4">
							{error && (
								<Alert variant="destructive" className="max-w-md">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Authentication Error</AlertTitle>
									<AlertDescription>
										{error}
										<Button
											variant="link"
											size="sm"
											onClick={clearError}
											className="h-auto p-0 ml-2 text-red-400 hover:text-red-300"
										>
											Dismiss
										</Button>
									</AlertDescription>
								</Alert>
							)}
							<Button
								onClick={login}
								disabled={isLoading}
								size="lg"
								className="px-8"
							>
								<LogIn size={16} />
								{isLoading ? "Signing In..." : "Sign In to Get Started"}
							</Button>
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
						<Card
							key={feature.title}
							className="bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
						>
							<CardHeader>
								<div className="mb-2">{feature.icon}</div>
								<CardTitle className="text-white">{feature.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-gray-400 leading-relaxed">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Footer */}
			<footer className="py-12 px-6 border-t border-border/50 bg-background/50 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
						<div>
							<h3 className="text-lg font-semibold text-white mb-4">
								TanStack Start
							</h3>
							<p className="text-slate-400 text-sm leading-relaxed">
								The framework for next generation AI applications. Built with
								TanStack Router for React and Solid.
							</p>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-white mb-4">
								Resources
							</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="https://tanstack.com/start"
										className="text-slate-400 hover:text-cyan-400 transition-colors"
									>
										Documentation
									</a>
								</li>
								<li>
									<a
										href="https://github.com/TanStack/router"
										className="text-slate-400 hover:text-cyan-400 transition-colors"
									>
										TanStack Router
									</a>
								</li>
								<li>
									<a
										href="https://tanstack.com/query"
										className="text-slate-400 hover:text-cyan-400 transition-colors"
									>
										TanStack Query
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="text-sm font-semibold text-white mb-4">
								Community
							</h4>
							<ul className="space-y-2 text-sm">
								<li>
									<a
										href="https://discord.gg/tanstack"
										className="text-slate-400 hover:text-cyan-400 transition-colors"
									>
										Discord
									</a>
								</li>
								<li>
									<a
										href="https://github.com/TanStack/start"
										className="text-slate-400 hover:text-cyan-400 transition-colors"
									>
										GitHub
									</a>
								</li>
								<li>
									<a
										href="https://twitter.com/tan_stack"
										className="text-slate-400 hover:text-cyan-400 transition-colors"
									>
										Twitter
									</a>
								</li>
							</ul>
						</div>
					</div>
					<Separator className="mb-8" />
					<div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
						<p>© 2025 TanStack. All rights reserved.</p>
						<div className="flex gap-6 mt-4 md:mt-0">
							<a
								href="#privacy"
								className="hover:text-cyan-400 transition-colors"
							>
								Privacy
							</a>
							<a
								href="#terms"
								className="hover:text-cyan-400 transition-colors"
							>
								Terms
							</a>
							<a
								href="#support"
								className="hover:text-cyan-400 transition-colors"
							>
								Support
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
