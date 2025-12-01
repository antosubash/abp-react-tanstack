import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Mail, MessageSquare } from "lucide-react";
import {
	SETTINGS_LABELS,
	SETTINGS_ROUTES,
} from "@/features/settings/constants";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";

export const Route = createFileRoute("/settings/")({
	component: SettingsIndexPage,
});

function SettingsIndexPage() {
	const settingsCategories = [
		{
			title: SETTINGS_LABELS.EMAIL.TITLE,
			description: SETTINGS_LABELS.EMAIL.DESCRIPTION,
			href: SETTINGS_ROUTES.EMAIL,
			icon: Mail,
		},
		{
			title: SETTINGS_LABELS.TIMEZONE.TITLE,
			description: SETTINGS_LABELS.TIMEZONE.DESCRIPTION,
			href: SETTINGS_ROUTES.TIMEZONE,
			icon: Clock,
		},
		{
			title: SETTINGS_LABELS.COMMENTS.TITLE,
			description: SETTINGS_LABELS.COMMENTS.DESCRIPTION,
			href: SETTINGS_ROUTES.COMMENTS,
			icon: MessageSquare,
		},
	];

	return (
		<div className="container mx-auto py-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground mt-2">
					Manage your application settings and configurations
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{settingsCategories.map((category) => (
					<Link key={category.href} to={category.href}>
						<Card className="hover:bg-accent transition-colors cursor-pointer h-full">
							<CardHeader>
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-primary/10">
										<category.icon className="h-6 w-6 text-primary" />
									</div>
									<div>
										<CardTitle className="text-lg">{category.title}</CardTitle>
									</div>
								</div>
								<CardDescription className="mt-3">
									{category.description}
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</div>
	);
}
