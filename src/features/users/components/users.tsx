import { createFileRoute } from "@tanstack/react-router";
import { UsersList } from "@/features/users/components/users-list";
import { SidebarLayout } from "@/shared/components/sidebar-layout";

export const Route = createFileRoute("/users")({
	component: UsersPage,
});

function UsersPage() {
	return (
		<SidebarLayout>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold tracking-tight">Users</h1>
				</div>
				<UsersList />
			</div>
		</SidebarLayout>
	);
}
