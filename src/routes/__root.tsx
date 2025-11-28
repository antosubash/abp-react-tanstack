import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Scripts,
	useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { SidebarLayout } from "../components/SidebarLayout";
import { AuthProvider } from "../hooks/use-auth";

// Configure API client to use proxy
// import "@/lib/api-config";

import appCss from "../styles.css?url";

// Create a client
const queryClient = new QueryClient();

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
	notFoundComponent: () => (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
				<p className="text-lg text-gray-600 mb-8">Page not found</p>
				<a
					href="/"
					className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				>
					Go Home
				</a>
			</div>
		</div>
	),
});

function ConditionalLayout({ children }: { children: React.ReactNode }) {
	const location = useLocation();

	// Routes that should use the sidebar layout
	const sidebarRoutes = ["/dashboard", "/demo"];

	const shouldUseSidebar = sidebarRoutes.some((route) =>
		location.pathname.startsWith(route),
	);

	if (shouldUseSidebar) {
		return <SidebarLayout>{children}</SidebarLayout>;
	}

	return <>{children}</>;
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<html lang="en">
					<head>
						<HeadContent />
					</head>
					<body>
						<ConditionalLayout>{children}</ConditionalLayout>
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
							]}
						/>
						<Scripts />
					</body>
				</html>
			</AuthProvider>
		</QueryClientProvider>
	);
}
