import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getPunkSongs } from "@/data/demo.punk-songs";

export const Route = createFileRoute("/demo/start/ssr/spa-mode")({
	ssr: false,
	component: RouteComponent,
});

function RouteComponent() {
	const [punkSongs, setPunkSongs] = useState<
		Awaited<ReturnType<typeof getPunkSongs>> | undefined
	>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		getPunkSongs().then((songs) => {
			setPunkSongs(songs);
			setIsLoading(false);
		});
	}, []);

	return (
		<div className="w-full bg-background">
			<div className="w-full px-6 py-8">
				<div className="flex items-center justify-center min-h-screen">
					<div className="w-full max-w-3xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
						<div className="flex items-center gap-2 mb-4">
							<Smartphone className="h-5 w-5 text-green-400" />
							<Badge variant="secondary">SPA Mode Demo</Badge>
						</div>
						<h2 className="text-white text-3xl font-semibold mb-2">
							Punk Songs Collection
						</h2>
						<p className="text-slate-400 mb-4">
							This page demonstrates Single Page Application mode with
							client-side data fetching
						</p>
						{isLoading ? (
							<div className="space-y-3">
								<div className="flex items-center gap-2 text-slate-300">
									<Loader2 className="h-4 w-4 animate-spin" />
									Loading songs...
								</div>
								{[
									"skeleton-1",
									"skeleton-2",
									"skeleton-3",
									"skeleton-4",
									"skeleton-5",
								].map((key) => (
									<div key={key} className="space-y-2">
										<Skeleton className="h-4 w-3/4" />
										<Skeleton className="h-4 w-1/2" />
									</div>
								))}
							</div>
						) : (
							<div className="space-y-3">
								{punkSongs?.map((song) => (
									<div
										key={song.id}
										className="flex items-center justify-between bg-slate-700/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/70 transition-colors"
									>
										<div>
											<span className="text-lg text-white font-medium">
												{song.name}
											</span>
											<span className="text-slate-400 ml-2">
												- {song.artist}
											</span>
										</div>
										<Badge variant="outline" className="text-green-400">
											Punk
										</Badge>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
