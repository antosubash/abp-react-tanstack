import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconEdit, IconPlus, IconTrash, IconUsers } from "@tabler/icons-react";
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
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { UserForm, type UserFormData } from "@/components/UserForm";
import { useUserFormStore } from "@/lib/user-form-store";

export function UsersList() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const pageSizeOptions = [10, 20, 50, 100];
	const queryClient = useQueryClient();

	const {
		user: editingUser,
		open: formOpen,
		setLoading,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useUserFormStore();

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
			setLoading(true);
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
			closeForm();
		} catch (error: any) {
			toast.error(error?.message || "Failed to create user");
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateUser = async (data: any) => {
		if (!editingUser?.id) return;
		try {
			setLoading(true);
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
			closeForm();
		} catch (error: any) {
			toast.error(error?.message || "Failed to update user");
			throw error;
		} finally {
			setLoading(false);
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
		openEditForm(user);
	};

	const handleCreateNewUser = () => {
		openCreateForm();
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
					Failed to load users: {error?.error?.message || "Unknown error"}
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
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No users found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Enhanced Pagination */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
					<div className="text-sm text-muted-foreground">
						Showing {users.length} of {totalCount} users
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							Rows per page:
						</span>
						<Select
							value={pagination.pageSize.toString()}
							onValueChange={(value) => {
								setPagination((prev) => ({
									...prev,
									pageSize: Number(value),
									pageIndex: 0, // Reset to first page when changing page size
								}));
							}}
						>
							<SelectTrigger className="w-20">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{pageSizeOptions.map((size) => (
									<SelectItem key={size} value={size.toString()}>
										{size}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => table.previousPage()}
								className={
									!table.getCanPreviousPage()
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>

						{/* Page Numbers */}
						{(() => {
							const pageNumbers = [];
							const totalPages = table.getPageCount();
							const currentPage = pagination.pageIndex + 1;

							// Always show first page
							pageNumbers.push(
								<PaginationItem key="page-1">
									<PaginationLink
										onClick={() =>
											setPagination((prev) => ({ ...prev, pageIndex: 0 }))
										}
										isActive={currentPage === 1}
										className="cursor-pointer"
									>
										1
									</PaginationLink>
								</PaginationItem>,
							);

							// Show ellipsis if there's a gap after first page
							if (currentPage > 3) {
								pageNumbers.push(
									<PaginationItem key="ellipsis-start">
										<PaginationEllipsis />
									</PaginationItem>,
								);
							}

							// Show pages around current page
							const startPage = Math.max(2, currentPage - 1);
							const endPage = Math.min(totalPages - 1, currentPage + 1);

							for (let i = startPage; i <= endPage; i++) {
								if (i === 1 || i === totalPages) continue; // Skip first and last as they're handled separately
								pageNumbers.push(
									<PaginationItem key={`page-${i}`}>
										<PaginationLink
											onClick={() =>
												setPagination((prev) => ({ ...prev, pageIndex: i - 1 }))
											}
											isActive={currentPage === i}
											className="cursor-pointer"
										>
											{i}
										</PaginationLink>
									</PaginationItem>,
								);
							}

							// Show ellipsis if there's a gap before last page
							if (currentPage < totalPages - 2) {
								pageNumbers.push(
									<PaginationItem key="ellipsis-end">
										<PaginationEllipsis />
									</PaginationItem>,
								);
							}

							// Always show last page if there are more than 1 page
							if (totalPages > 1) {
								pageNumbers.push(
									<PaginationItem key={`page-${totalPages}`}>
										<PaginationLink
											onClick={() =>
												setPagination((prev) => ({
													...prev,
													pageIndex: totalPages - 1,
												}))
											}
											isActive={currentPage === totalPages}
											className="cursor-pointer"
										>
											{totalPages}
										</PaginationLink>
									</PaginationItem>,
								);
							}

							return pageNumbers;
						})()}

						<PaginationItem>
							<PaginationNext
								onClick={() => table.nextPage()}
								className={
									!table.getCanNextPage()
										? "pointer-events-none opacity-50"
										: "cursor-pointer"
								}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>

			<UserForm
				key={editingUser?.id || "create"}
				user={editingUser}
				open={formOpen}
				onOpenChange={closeForm}
				onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
				isLoading={createUserMutation.isPending || updateUserMutation.isPending}
				mode={editingUser ? "edit" : "create"}
			/>
		</div>
	);
}
