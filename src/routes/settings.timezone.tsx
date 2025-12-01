import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Clock } from "lucide-react";
import { TimezoneSettingsForm } from "@/features/settings/components/timezone-settings-form";

export const Route = createFileRoute("/settings/timezone")({
	component: TimezoneSettingsPage,
});

function TimezoneSettingsPage() {
	return (
		<div className="container mx-auto py-6 max-w-4xl">
			<div className="mb-6">
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
					<Link
						to="/settings"
						className="hover:text-foreground transition-colors"
					>
						Settings
					</Link>
					<ChevronRight className="h-4 w-4" />
					<span className="text-foreground">Timezone</span>
				</div>
				<div className="flex items-center gap-3">
					<div className="p-3 rounded-lg bg-purple-500/10">
						<Clock className="h-8 w-8 text-purple-500" />
					</div>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Timezone Settings
						</h1>
						<p className="text-muted-foreground mt-1">
							Set the default timezone for your application
						</p>
					</div>
				</div>
			</div>
			<TimezoneSettingsForm />
		</div>
	);
}
