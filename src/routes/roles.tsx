import { createFileRoute } from "@tanstack/react-router";
import { RolesList } from "@/features/roles/components/RolesList";

export const Route = createFileRoute("/roles")({
	component: RolesList,
});
