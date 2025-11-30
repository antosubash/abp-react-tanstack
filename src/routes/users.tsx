import { createFileRoute } from "@tanstack/react-router";
import { UsersList } from "@/features/users/components/UsersList";

export const Route = createFileRoute("/users")({
	component: UsersList,
});
