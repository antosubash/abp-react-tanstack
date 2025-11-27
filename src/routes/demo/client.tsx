import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { abpApplicationConfigurationGetOptions } from "@/client/@tanstack/react-query.gen";
import { client } from "@/client/client.gen";
import { API_CONSTANTS } from "@/lib/constants";

export const Route = createFileRoute("/demo/client")({
	component: ApiClientDemo,
});

function ApiClientDemo() {
	// Configure the API client to use the proxy
	useEffect(() => {
		client.setConfig({
			baseUrl: window.location.origin + API_CONSTANTS.PROXY_PATH,
		});
	}, []);
	const {
		data: applicationConfiguration,
		isLoading,
		error,
		isError,
	} = useQuery(
		abpApplicationConfigurationGetOptions({
			query: {
				IncludeLocalizationResources: false,
			},
		}),
	);

	if (isError) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-red-500">
					Error: {error?.error?.message || "Failed to load users"}
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading application configuration...</div>
			</div>
		);
	}

	const currentUser = applicationConfiguration?.currentUser || [];

	return (
		<div
			className="flex items-center justify-center min-h-screen p-4 text-white"
			style={{
				backgroundColor: "#000",
				backgroundImage:
					"radial-gradient(ellipse 60% 60% at 0% 100%, #444 0%, #222 60%, #000 100%)",
			}}
		>
			<div className="w-full max-w-4xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
				<h1 className="text-2xl mb-4">API Client Demo - Users List</h1>
				<p className="text-sm text-gray-300 mb-6">
					This demo shows the generated API client with TanStack Query hooks.
				</p>

				<div className="mb-4">
					<div className="grid gap-3">
						<pre className="text-sm text-gray-300">
							{JSON.stringify(currentUser, null, 2)}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
