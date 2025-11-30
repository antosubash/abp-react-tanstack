import { createFileRoute } from "@tanstack/react-router";
import { UsersList } from "@/features/users/components/users-list";

export const Route = createFileRoute("/users")({
	component: UsersList,
});
