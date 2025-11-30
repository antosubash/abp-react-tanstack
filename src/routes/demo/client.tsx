import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/shared/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useId } from "react";
import { Toaster } from "@/shared/components/ui/sonner";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	userCreateMutation,
	userGetListOptions,
	userGetListQueryKey,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { IdentityUserCreateDto } from "@/infrastructure/api/types.gen";

export const Route = createFileRoute("/demo/client")({
	component: ClientDemo,
});

function ClientDemo() {
	const queryClient = useQueryClient();
	const userNameId = useId();
	const emailId = useId();

	const createUserMutation = useMutation({
		...userCreateMutation(),
	});

	const handleCreateUser = async (data: IdentityUserCreateDto) => {
		try {
			await createUserMutation.mutateAsync({ body: data });
			queryClient.invalidateQueries({
				queryKey: userGetListQueryKey(),
			});
			toast.success("User created successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create user";
			toast.error(errorMessage);
			throw error;
		}
	};

	const {
		data: usersResponse,
		isLoading: usersLoading,
		error: usersError,
		isError: usersIsError,
	} = useQuery(userGetListOptions());

	return (
		<div className="container mx-auto py-8">
			<Toaster />
			<div className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Generated API Client Demo</CardTitle>
						<CardDescription>
							Generated API client from ABP OpenAPI specification with full
							TypeScript support.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor={userNameId}>User Name</Label>
							<Input
								id={userNameId}
								placeholder="Enter user name"
								defaultValue="Demo User"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={emailId}>Email</Label>
							<Input
								id={emailId}
								type="email"
								placeholder="Enter email"
								defaultValue="demo@example.com"
							/>
						</div>
						<Button
							onClick={() =>
								handleCreateUser({
									userName: "Demo User",
									email: "demo@example.com",
									password: "demo-password",
								})
							}
							disabled={createUserMutation.isPending}
						>
							{createUserMutation.isPending ? "Creating..." : "Create User"}
						</Button>
					</CardContent>

					{usersIsError && (
						<Card>
							<CardHeader>
								<CardTitle>Error</CardTitle>
							</CardHeader>
							<CardContent>
								{usersError?.error?.message || "Failed to load users"}
							</CardContent>
						</Card>
					)}

					{usersLoading && (
						<Card>
							<CardHeader>
								<CardTitle>Loading</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-center space-x-2">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
									<span>Loading users...</span>
								</div>
							</CardContent>
						</Card>
					)}

					{usersResponse && (
						<Card>
							<CardHeader>
								<CardTitle>Users</CardTitle>
								<CardDescription>
									{usersResponse.items?.length || 0} users found
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<table className="w-full">
										<thead>
											<tr>
												<th>ID</th>
												<th>Name</th>
												<th>Email</th>
											</tr>
										</thead>
										<tbody>
											{usersResponse.items?.map((user) => (
												<tr key={user.id}>
													<td>{user.id}</td>
													<td>{user.name}</td>
													<td>{user.email}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					)}
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>API Client Info</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-sm">
							<p>
								<strong>Generated from:</strong>{" "}
								<a
									href="https://abp.antosubash.com/swagger/v1/swagger.json"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									https://abp.antosubash.com/swagger/v1/swagger.json
								</a>
							</p>
							<p>
								<strong>TypeScript types:</strong> Generated with full type
								safety
							</p>
							<p>
								<strong>TanStack Query hooks:</strong> Auto-generated for all
								API endpoints
							</p>
							<p>
								<strong>Zod validation:</strong> Runtime type validation for API
								responses
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
