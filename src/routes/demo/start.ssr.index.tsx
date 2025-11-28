import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, Layers, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/demo/start/ssr/")({
	component: RouteComponent,
});

function RouteComponent() {
	const demos = [
		{
			to: "/demo/start/ssr/spa-mode",
			title: "SPA Mode",
			description: "Single Page Application with client-side routing",
			icon: <Layers className="h-6 w-6" />,
			color: "bg-pink-500 hover:bg-pink-600",
		},
		{
			to: "/demo/start/ssr/full-ssr",
			title: "Full SSR",
			description: "Complete server-side rendering with hydration",
			icon: <Zap className="h-6 w-6" />,
			color: "bg-purple-500 hover:bg-purple-600",
		},
		{
			to: "/demo/start/ssr/data-only",
			title: "Data Only",
			description: "Server-side data fetching without full rendering",
			icon: <Database className="h-6 w-6" />,
			color: "bg-green-500 hover:bg-green-600",
		},
	];

	return (
		<div className="w-full bg-slate-900">
			<div className="w-full px-6 py-8">
				<div className="flex items-center justify-center min-h-screen">
					<div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
						<div className="text-center">
							<div className="flex items-center justify-center gap-2 mb-4">
								<Badge variant="secondary">SSR Demos</Badge>
							</div>
							<h2 className="text-4xl font-bold text-white mb-2">
								Server-Side Rendering Examples
							</h2>
							<p className="text-slate-400 mb-6">
								Explore different SSR approaches with TanStack Start
							</p>
						</div>
						<div className="grid gap-4 md:grid-cols-1">
							{demos.map((demo) => (
								<Button
									key={demo.to}
									asChild
									className={`${demo.color} h-auto p-6 text-white font-semibold shadow-lg transition-all hover:shadow-xl`}
								>
									<Link to={demo.to} className="flex items-center gap-4">
										<div className="flex-shrink-0">{demo.icon}</div>
										<div className="text-left">
											<div className="text-xl font-bold">{demo.title}</div>
											<div className="text-sm opacity-90">
												{demo.description}
											</div>
										</div>
									</Link>
								</Button>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
