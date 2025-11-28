import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IconEdit, IconPlus, IconTrash, IconShield } from "@tabler/icons-react";
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
	roleCreateMutation,
	roleDeleteMutation,
	roleGetListOptions,
	roleGetListQueryKey,
	roleUpdateMutation,
} from "@/client/@tanstack/react-query.gen";
import type { IdentityRoleDto } from "@/client/types.gen";
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
import { RoleForm, type RoleFormData } from "@/components/RoleForm";
import { useRoleFormStore } from "@/lib/role-form-store";

export function RolesList() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const pageSizeOptions = [10, 20, 50, 100];
	const queryClient = useQueryClient();

	const {
		role: editingRole,
		open: formOpen,
		setLoading,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useRoleFormStore();

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
		},
	};

	const {
		data: rolesResponse,
		isLoading,
		error,
		isError,
	} = useQuery(roleGetListOptions(queryOptions));

	const createRoleMutation = useMutation({
		...roleCreateMutation(),
	});

	const updateRoleMutation = useMutation({
		...roleUpdateMutation(),
	});

	const deleteRoleMutation = useMutation({
		...roleDeleteMutation(),
	});

	const roles = rolesResponse?.items || [];
	const totalCount = rolesResponse?.totalCount || 0;

	const handleCreateRole = async (data: RoleFormData) => {
		try {
			setLoading(true);
			await createRoleMutation.mutateAsync({
				body: {
					name: data.name,
					isDefault: data.isDefault,
					isPublic: data.isPublic,
				},
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create role";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRole = async (data: RoleFormData) => {
		if (!editingRole?.id) return;
		try {
			setLoading(true);
			await updateRoleMutation.mutateAsync({
				path: { id: editingRole.id },
				body: {
					name: data.name,
					isDefault: data.isDefault,
					isPublic: data.isPublic,
					concurrencyStamp: editingRole.concurrencyStamp || null,
				},
			});
			// Invalidate and refetch the role list to update the table
			await queryClient.invalidateQueries({
				queryKey: [roleGetListQueryKey({})],
			});
			// Invalidate and refetch the role list to update the table
			await queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			// Also force a refetch to ensure immediate UI update
			await queryClient.refetchQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update role";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRole = async (roleId: string) => {
		try {
			await deleteRoleMutation.mutateAsync({
				path: { id: roleId },
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete role";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleEditRole = (role: IdentityRoleDto) => {
		openEditForm(role);
	};

	const handleCreateNewRole = () => {
		openCreateForm();
	};

	const columns: ColumnDef<IdentityRoleDto>[] = [
		{
			accessorKey: "name",
			header: "Role Name",
			cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
		},
		{
			accessorKey: "isDefault",
			header: "Default",
			cell: ({ row }) => (
				<Badge variant={row.original.isDefault ? "default" : "secondary"}>
					{row.original.isDefault ? "Yes" : "No"}
				</Badge>
			),
		},
		{
			accessorKey: "isPublic",
			header: "Public",
			cell: ({ row }) => (
				<Badge variant={row.original.isPublic ? "default" : "secondary"}>
					{row.original.isPublic ? "Yes" : "No"}
				</Badge>
			),
		},
		{
			accessorKey: "isStatic",
			header: "Static",
			cell: ({ row }) => (
				<Badge variant={row.original.isStatic ? "default" : "secondary"}>
					{row.original.isStatic ? "Yes" : "No"}
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
						<DropdownMenuItem onClick={() => handleEditRole(row.original)}>
							<IconEdit className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							disabled={deleteRoleMutation.isPending || row.original.isStatic}
							onClick={() => {
								if (confirm("Are you sure you want to delete this role?")) {
									if (row.original.id) {
										handleDeleteRole(row.original.id);
									}
								}
							}}
						>
							<IconTrash className="mr-2 h-4 w-4" />
							{deleteRoleMutation.isPending ? "Deleting..." : "Delete"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	const table = useReactTable({
		data: roles,
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
					Failed to load roles: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconShield className="h-5 w-5" />
					<span className="text-sm text-muted-foreground">
						{totalCount} roles total
					</span>
				</div>
				<Button
					onClick={handleCreateNewRole}
					disabled={createRoleMutation.isPending}
				>
					<IconPlus className="mr-2 h-4 w-4" />
					{createRoleMutation.isPending ? "Creating..." : "Add Role"}
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
							Array.from({ length: pagination.pageSize }).map(() => (
								<TableRow key={crypto.randomUUID()}>
									<TableCell>
										<Skeleton className="h-4 w-32" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-6 w-12" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-6 w-12" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-6 w-12" />
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
									No roles found.
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
						Showing {roles.length} of {totalCount} roles
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

			<RoleForm
				key={editingRole?.id || "create"}
				role={editingRole}
				open={formOpen}
				onOpenChange={closeForm}
				onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
				isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
				mode={editingRole ? "edit" : "create"}
			/>
		</div>
	);
}
