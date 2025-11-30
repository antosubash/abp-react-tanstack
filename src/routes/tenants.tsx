import { createFileRoute } from "@tanstack/react-router";
import { TenantsList } from "@/components/TenantsList";
import { SidebarLayout } from "@/components/SidebarLayout";

export const Route = createFileRoute("/tenants")({
	component: TenantsPage,
});

function TenantsPage() {
	return (
		<SidebarLayout>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight">Tenants</h1>
				</div>
				<TenantsList />
			</div>
		</SidebarLayout>
	);
}
