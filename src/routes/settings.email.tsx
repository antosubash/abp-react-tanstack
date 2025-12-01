import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Mail } from "lucide-react";
import { EmailSettingsForm } from "@/features/settings/components/email-settings-form";

export const Route = createFileRoute("/settings/email")({
	component: EmailSettingsPage,
});

function EmailSettingsPage() {
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
					<span className="text-foreground">Email</span>
				</div>
				<div className="flex items-center gap-3">
					<div className="p-3 rounded-lg bg-blue-500/10">
						<Mail className="h-8 w-8 text-blue-500" />
					</div>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Email Settings
						</h1>
						<p className="text-muted-foreground mt-1">
							Configure SMTP settings for sending emails from your application
						</p>
					</div>
				</div>
			</div>
			<EmailSettingsForm />
		</div>
	);
}
