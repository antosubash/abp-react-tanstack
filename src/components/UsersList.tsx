import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	IconEdit,
	IconPlus,
	IconTrash,
	IconUsers,
} from "@tabler/icons-react";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

import {
	userCreateMutation,
	userDeleteMutation,
	userGetListOptions,
	userUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import type { IdentityUserDto } from "@/client/types.gen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { UserForm } from "@/components/UserForm";


export function UsersList() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});
	const [formOpen, setFormOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<IdentityUserDto | null>(null);
	const queryClient = useQueryClient();

	const {
		data: usersResponse,
		isLoading,
		error,
		isError,
	} = useQuery(
		userGetListOptions({
			query: {
				MaxResultCount: pagination.pageSize,
				SkipCount: pagination.pageIndex * pagination.pageSize,
			},
		}),
	);

	const createUserMutation = useMutation({
		...userCreateMutation(),
	});

	const updateUserMutation = useMutation({
		...userUpdateMutation(),
	});

	const deleteUserMutation = useMutation({
		...userDeleteMutation(),
	});

	const users = usersResponse?.items || [];
	const totalCount = usersResponse?.totalCount || 0;

	const handleCreateUser = async (data: any) => {
		try {
			await createUserMutation.mutateAsync({
				body: {
					userName: data.userName,
					name: data.name || null,
					surname: data.surname || null,
					email: data.email,
					phoneNumber: data.phoneNumber || null,
					isActive: data.isActive,
					lockoutEnabled: data.lockoutEnabled,
					password: data.password,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["userGetList"] });
			toast.success("User created successfully");
		} catch (error: any) {
			toast.error(error?.message || "Failed to create user");
			throw error;
		}
	};

	const handleUpdateUser = async (data: any) => {
		if (!editingUser?.id) return;
		try {
			await updateUserMutation.mutateAsync({
				path: { id: editingUser.id },
				body: {
					userName: data.userName,
					name: data.name || null,
					surname: data.surname || null,
					email: data.email,
					phoneNumber: data.phoneNumber || null,
					isActive: data.isActive,
					lockoutEnabled: data.lockoutEnabled,
					password: data.password || null,
					concurrencyStamp: editingUser.concurrencyStamp || null,
				},
			});
			queryClient.invalidateQueries({ queryKey: ["userGetList"] });
			toast.success("User updated successfully");
		} catch (error: any) {
			toast.error(error?.message || "Failed to update user");
			throw error;
		}
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			await deleteUserMutation.mutateAsync({
				path: { id: userId },
			});
			queryClient.invalidateQueries({ queryKey: ["userGetList"] });
			toast.success("User deleted successfully");
		} catch (error: any) {
			toast.error(error?.message || "Failed to delete user");
			throw error;
		}
	};

	const handleEditUser = (user: IdentityUserDto) => {
		setEditingUser(user);
		setFormOpen(true);
	};

	const handleCreateNewUser = () => {
		setEditingUser(null);
		setFormOpen(true);
	};

	const columns: ColumnDef<IdentityUserDto>[] = [
		{
			accessorKey: "userName",
			header: "Username",
			cell: ({ row }) => (
				<div className="font-medium">{row.original.userName}</div>
			),
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => (
				<div>
					{row.original.name} {row.original.surname}
				</div>
			),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => <div>{row.original.email}</div>,
		},
		{
			accessorKey: "phoneNumber",
			header: "Phone",
			cell: ({ row }) => <div>{row.original.phoneNumber || "-"}</div>,
		},
		{
			accessorKey: "isActive",
			header: "Status",
			cell: ({ row }) => (
				<Badge variant={row.original.isActive ? "default" : "secondary"}>
					{row.original.isActive ? "Active" : "Inactive"}
				</Badge>
			),
		},
		{
			accessorKey: "creationTime",
			header: "Created",
			cell: ({ row }) => (
				<div className="text-sm text-muted-foreground">
					{row.original.creationTime
						? new Date(row.original.creationTime).toLocaleDateString()
						: "-"}
				</div>
			),
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<IconEdit className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleEditUser(row.original)}>
							<IconEdit className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							disabled={deleteUserMutation.isPending}
							onClick={() => {
								if (confirm("Are you sure you want to delete this user?")) {
									handleDeleteUser(row.original.id!);
								}
							}}
						>
							<IconTrash className="mr-2 h-4 w-4" />
							{deleteUserMutation.isPending ? "Deleting..." : "Delete"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	const table = useReactTable({
		data: users,
		columns,
		state: {
			sorting,
			pagination,
		},
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		manualPagination: true,
		pageCount: Math.ceil(totalCount / pagination.pageSize),
	});

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load users: {error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconUsers className="h-5 w-5" />
					<span className="text-sm text-muted-foreground">
						{totalCount} users total
					</span>
				</div>
				<Button
					onClick={handleCreateNewUser}
					disabled={createUserMutation.isPending}
				>
					<IconPlus className="mr-2 h-4 w-4" />
					{createUserMutation.isPending ? "Creating..." : "Add User"}
				</Button>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							// Loading skeleton
							Array.from({ length: pagination.pageSize }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<Skeleton className="h-4 w-24" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-32" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-48" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-32" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-6 w-16" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-20" />
									</TableCell>
									<TableCell>
										<Button variant="ghost" size="sm" disabled>
											<IconEdit className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							))
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No users found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					Showing {users.length} of {totalCount} users
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>

			<UserForm
				user={editingUser}
				open={formOpen}
				onOpenChange={setFormOpen}
				onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
				isLoading={createUserMutation.isPending || updateUserMutation.isPending}
				mode={editingUser ? "edit" : "create"}
			/>
		</div>
	);
}
