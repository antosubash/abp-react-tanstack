import { createFileRoute } from "@tanstack/react-router";
import { Database } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

function getNames() {
	return fetch("/demo/api/names").then(
		(res) => res.json() as Promise<string[]>,
	);
}

export const Route = createFileRoute("/demo/start/api-request")({
	component: Home,
});

function Home() {
	const [names, setNames] = useState<Array<string>>([]);

	useEffect(() => {
		getNames().then(setNames);
	}, []);

	return (
		<div className="w-full bg-background">
			<div className="w-full px-6 py-8">
				<div className="flex items-center justify-center min-h-screen">
					<Card className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm border-slate-700">
						<CardHeader>
							<div className="flex items-center gap-2 mb-2">
								<Database className="h-5 w-5 text-blue-400" />
								<Badge variant="secondary">API Request Demo</Badge>
							</div>
							<CardTitle className="text-white text-2xl">Names List</CardTitle>
							<CardDescription>
								This demo shows API request functionality
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2">
								{names.map((name) => (
									<li
										key={name}
										className="flex items-center gap-3 bg-slate-700/50 border border-slate-600 rounded-lg p-3"
									>
										<span className="text-lg text-white">{name}</span>
									</li>
								))}
							</ul>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
