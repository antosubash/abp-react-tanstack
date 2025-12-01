import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Shield, User } from "lucide-react";
import { PROFILE_LABELS, PROFILE_ROUTES } from "@/features/profile/constants";
import { PageHeader } from "@/shared/components/page-header";
import { PageLayout } from "@/shared/components/page-layout";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export const Route = createFileRoute("/profile")({
	component: ProfileLayout,
});

function ProfileLayout() {
	return (
		<PageLayout>
			<PageHeader
				title="Profile"
				description="Manage your account settings and preferences"
			/>

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
		</PageLayout>
	);
}
