import { createFileRoute } from "@tanstack/react-router";
import { RolesList } from "@/features/roles/components/roles-list";

export const Route = createFileRoute("/roles")({
	component: RolesList,
});
