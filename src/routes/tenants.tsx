import { createFileRoute } from "@tanstack/react-router";
import { TenantsList } from "@/features/tenants/components/tenants-list";

export const Route = createFileRoute("/tenants")({
	component: TenantsList,
});
