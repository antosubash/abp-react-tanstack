import { createFileRoute } from "@tanstack/react-router";
import { RolesList } from "@/features/roles/components/RolesList";
import { SidebarLayout } from "@/shared/components/SidebarLayout";

export const Route = createFileRoute("/roles")({
	component: RolesPage,
});

function RolesPage() {
	return (
		<SidebarLayout>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight">Roles</h1>
				</div>
				<RolesList />
			</div>
		</SidebarLayout>
	);
}
