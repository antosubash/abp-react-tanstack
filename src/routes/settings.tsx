import { createFileRoute } from "@tanstack/react-router";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Clock, Mail, MessageSquare } from "lucide-react";
import { SETTINGS_LABELS } from "@/features/settings/constants";
import { EmailSettingsForm } from "@/features/settings/components/email-settings-form";
import { TimezoneSettingsForm } from "@/features/settings/components/timezone-settings-form";
import { CommentSettingsForm } from "@/features/settings/components/comment-settings-form";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

const SETTINGS_TAB_VALUE = {
	EMAIL: "email",
	TIMEZONE: "timezone",
	COMMENTS: "comments",
} as const;

function SettingsPage() {
	return (
		<div className="container mx-auto py-6 max-w-5xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Settings</h1>
				<p className="text-muted-foreground mt-2">
					Manage your application settings and configurations
				</p>
			</div>

			<Tabs defaultValue={SETTINGS_TAB_VALUE.EMAIL} className="w-full">
				<TabsList className="grid w-full grid-cols-3 mb-6">
					<TabsTrigger
						value={SETTINGS_TAB_VALUE.EMAIL}
						className="flex items-center gap-2"
					>
						<Mail className="h-4 w-4" />
						<span className="hidden sm:inline">
							{SETTINGS_LABELS.EMAIL.TITLE}
						</span>
						<span className="sm:hidden">Email</span>
					</TabsTrigger>
					<TabsTrigger
						value={SETTINGS_TAB_VALUE.TIMEZONE}
						className="flex items-center gap-2"
					>
						<Clock className="h-4 w-4" />
						<span className="hidden sm:inline">
							{SETTINGS_LABELS.TIMEZONE.TITLE}
						</span>
						<span className="sm:hidden">Timezone</span>
					</TabsTrigger>
					<TabsTrigger
						value={SETTINGS_TAB_VALUE.COMMENTS}
						className="flex items-center gap-2"
					>
						<MessageSquare className="h-4 w-4" />
						<span className="hidden sm:inline">
							{SETTINGS_LABELS.COMMENTS.TITLE}
						</span>
						<span className="sm:hidden">Comments</span>
					</TabsTrigger>
				</TabsList>

				<TabsContent value={SETTINGS_TAB_VALUE.EMAIL} className="mt-6">
					<div className="mb-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-3 rounded-lg bg-blue-500/10">
								<Mail className="h-8 w-8 text-blue-500" />
							</div>
							<div>
								<h2 className="text-2xl font-bold tracking-tight">
									{SETTINGS_LABELS.EMAIL.TITLE}
								</h2>
								<p className="text-muted-foreground mt-1">
									Configure SMTP settings for sending emails from your
									application
								</p>
							</div>
						</div>
					</div>
					<EmailSettingsForm />
				</TabsContent>

				<TabsContent value={SETTINGS_TAB_VALUE.TIMEZONE} className="mt-6">
					<div className="mb-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-3 rounded-lg bg-purple-500/10">
								<Clock className="h-8 w-8 text-purple-500" />
							</div>
							<div>
								<h2 className="text-2xl font-bold tracking-tight">
									{SETTINGS_LABELS.TIMEZONE.TITLE}
								</h2>
								<p className="text-muted-foreground mt-1">
									Set the default timezone for your application
								</p>
							</div>
						</div>
					</div>
					<TimezoneSettingsForm />
				</TabsContent>

				<TabsContent value={SETTINGS_TAB_VALUE.COMMENTS} className="mt-6">
					<div className="mb-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-3 rounded-lg bg-green-500/10">
								<MessageSquare className="h-8 w-8 text-green-500" />
							</div>
							<div>
								<h2 className="text-2xl font-bold tracking-tight">
									{SETTINGS_LABELS.COMMENTS.TITLE}
								</h2>
								<p className="text-muted-foreground mt-1">
									Configure comment moderation and approval settings
								</p>
							</div>
						</div>
					</div>
					<CommentSettingsForm />
				</TabsContent>
			</Tabs>
		</div>
	);
}
