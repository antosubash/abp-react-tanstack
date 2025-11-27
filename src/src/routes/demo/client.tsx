import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { userGetListOptions } from "@/lib/api/@tanstack/react-query.gen";

export const Route = createFileRoute("/demo/client")({
	component: ApiClientDemo,
});

function ApiClientDemo() {
	const {
		data: usersResponse,
		isLoading,
		error,
		isError,
	} = useQuery(
		userGetListOptions({
			query: {
				SkipCount: 0,
				MaxResultCount: 10,
			},
		}),
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading users...</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg text-red-500">
					Error: {error?.error?.message || "Failed to load users"}
				</div>
			</div>
		);
	}

	const users = usersResponse?.items || [];

	return (
		<div
			className="flex items-center justify-center min-h-screen p-4 text-white"
			style={{
				backgroundColor: "#000",
				backgroundImage:
					"radial-gradient(ellipse 60% 60% at 0% 100%, #444 0%, #222 60%, #000 100%)",
			}}
		>
			<div className="w-full max-w-4xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
				<h1 className="text-2xl mb-4">API Client Demo - Users List</h1>
				<p className="text-sm text-gray-300 mb-6">
					This demo shows the generated API client with TanStack Query hooks.
				</p>

				<div className="mb-4">
					<h2 className="text-lg mb-2">
						Total Users: {usersResponse?.totalCount || 0}
					</h2>
					<div className="grid gap-3">
						{users.map((user: any) => (
							<div
								key={user.id}
								className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur-sm shadow-md"
							>
								<div className="flex justify-between items-center">
									<div>
										<h3 className="text-lg font-semibold">{user.userName}</h3>
										<p className="text-sm text-gray-300">{user.email}</p>
									</div>
									<div className="text-sm text-gray-400">
										{user.isActive ? (
											<span className="text-green-400">Active</span>
										) : (
											<span className="text-red-400">Inactive</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
