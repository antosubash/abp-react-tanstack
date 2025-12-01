import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Shield, User } from "lucide-react";
import { PROFILE_LABELS, PROFILE_ROUTES } from "@/features/profile/constants";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export const Route = createFileRoute("/profile")({
	component: ProfileLayout,
});

function ProfileLayout() {
	return (
		<div className="container mx-auto py-6 max-w-5xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">Profile</h1>
				<p className="text-muted-foreground mt-2">
					Manage your account settings and preferences
				</p>
			</div>

			<Tabs defaultValue="general" className="space-y-6">
				<TabsList>
					<Link to={PROFILE_ROUTES.GENERAL}>
						<TabsTrigger value="general" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							{PROFILE_LABELS.TABS.GENERAL}
						</TabsTrigger>
					</Link>
					<Link to={PROFILE_ROUTES.SECURITY}>
						<TabsTrigger value="security" className="flex items-center gap-2">
							<Shield className="h-4 w-4" />
							{PROFILE_LABELS.TABS.SECURITY}
						</TabsTrigger>
					</Link>
				</TabsList>

				<Outlet />
			</Tabs>
		</div>
	);
}
