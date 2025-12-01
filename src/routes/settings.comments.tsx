import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, MessageSquare } from "lucide-react";
import { CommentSettingsForm } from "@/features/settings/components/comment-settings-form";

export const Route = createFileRoute("/settings/comments")({
	component: CommentSettingsPage,
});

function CommentSettingsPage() {
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
					<span className="text-foreground">Comments</span>
				</div>
				<div className="flex items-center gap-3">
					<div className="p-3 rounded-lg bg-green-500/10">
						<MessageSquare className="h-8 w-8 text-green-500" />
					</div>
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Comment Settings
						</h1>
						<p className="text-muted-foreground mt-1">
							Configure comment moderation and approval settings
						</p>
					</div>
				</div>
			</div>
			<CommentSettingsForm />
		</div>
	);
}
