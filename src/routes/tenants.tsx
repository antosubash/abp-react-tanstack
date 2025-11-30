import { createFileRoute } from "@tanstack/react-router";
import { TenantsList } from "@/features/tenants/components/TenantsList";

export const Route = createFileRoute("/tenants")({
	component: TenantsList,
});
