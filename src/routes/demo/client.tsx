import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { abpApplicationConfigurationGetOptions } from "@/client/@tanstack/react-query.gen";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/demo/client")({
	component: ApiClientDemo,
});

function ApiClientDemo() {
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
			<div className="flex items-center justify-center min-h-screen p-4">
				<Alert variant="destructive" className="max-w-md">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Failed to Load Data</AlertTitle>
					<AlertDescription>
						{error?.error?.message ||
							"Failed to load application configuration"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen p-4">
				<Card className="max-w-md w-full">
					<CardHeader>
						<CardTitle>Loading Application Configuration</CardTitle>
						<CardDescription>
							Please wait while we fetch the data...
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-4 w-1/2" />
					</CardContent>
				</Card>
			</div>
		);
	}

	const currentUser = applicationConfiguration?.currentUser || [];

	return (
		<div className="w-full bg-slate-900">
			<div className="w-full px-6 py-8">
				<div className="flex items-center justify-center min-h-screen">
					<div className="w-full max-w-4xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<CheckCircle2 className="h-5 w-5 text-green-400" />
							<Badge variant="secondary">API Client Demo</Badge>
						</div>
						<h2 className="text-white text-2xl font-semibold mb-2">
							Application Configuration
						</h2>
						<p className="text-slate-400 mb-4">
							This demo shows the generated API client with TanStack Query hooks
							and displays current user information.
						</p>
						<div className="bg-slate-900/50 rounded-lg p-4 border border-slate-600">
							<pre className="text-sm text-slate-300 overflow-x-auto">
								{JSON.stringify(currentUser, null, 2)}
							</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
