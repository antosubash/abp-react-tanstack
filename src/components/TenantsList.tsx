import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	IconDots,
	IconPencil,
	IconPlus,
	IconTrash,
	IconBuilding,
	IconDatabase,
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

import type { TenantDto } from "@/client/types.gen";
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
import { TenantForm, type TenantFormData } from "@/components/TenantForm";
import { TenantConnectionStringModal } from "@/components/TenantConnectionStringModal";
import { useTenantFormStore } from "@/lib/tenant-form-store";
import { useTenantConnectionStore } from "@/lib/tenant-connection-store";
import {
	tenantCreateMutation,
	tenantDeleteMutation,
	tenantGetListOptions,
	tenantGetListQueryKey,
	tenantUpdateMutation,
} from "@/client/@tanstack/react-query.gen";

export function TenantsList() {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const pageSizeOptions = [10, 20, 50, 100];
	const queryClient = useQueryClient();

	const {
		tenant: editingTenant,
		open: formOpen,
		setLoading,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useTenantFormStore();

	const { openModal: openConnectionStringModal } = useTenantConnectionStore();

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
		},
	};

	const {
		data: tenantsResponse,
		isLoading,
		error,
		isError,
	} = useQuery(tenantGetListOptions(queryOptions));

	const createTenantMutation = useMutation({
		...tenantCreateMutation(),
	});

	const updateTenantMutation = useMutation({
		...tenantUpdateMutation(),
	});

	const deleteTenantMutation = useMutation({
		...tenantDeleteMutation(),
	});

	const tenants = tenantsResponse?.items || [];
	const totalCount = tenantsResponse?.totalCount || 0;

	const handleCreateTenant = async (data: TenantFormData) => {
		try {
			setLoading(true);
			await createTenantMutation.mutateAsync({
				body: {
					name: data.name,
					adminEmailAddress: data.adminEmailAddress || "",
					adminPassword: data.adminPassword || "",
				},
			});
			queryClient.invalidateQueries({
				queryKey: tenantGetListQueryKey(queryOptions),
			});
			toast.success("Tenant created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create tenant";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateTenant = async (data: TenantFormData) => {
		if (!editingTenant?.id) return;
		try {
			setLoading(true);
			await updateTenantMutation.mutateAsync({
				path: { id: editingTenant.id },
				body: {
					name: data.name,
					concurrencyStamp: editingTenant.concurrencyStamp || null,
				},
			});
			queryClient.invalidateQueries({
				queryKey: tenantGetListQueryKey(queryOptions),
			});
			toast.success("Tenant updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update tenant";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteTenant = async (tenantId: string) => {
		try {
			await deleteTenantMutation.mutateAsync({
				path: { id: tenantId },
			});
			queryClient.invalidateQueries({
				queryKey: tenantGetListQueryKey(queryOptions),
			});
			toast.success("Tenant deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete tenant";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleEditTenant = (tenant: TenantDto) => {
		openEditForm(tenant);
	};

	const handleCreateNewTenant = () => {
		openCreateForm();
	};

	const handleManageConnectionString = async (tenant: TenantDto) => {
		// Open the connection string modal
		// The modal will handle fetching the connection string itself
		openConnectionStringModal(tenant);
	};

	const columns: ColumnDef<TenantDto>[] = [
		{
			accessorKey: "name",
			header: "Name",
			cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
		},
		{
			id: "connectionString",
			header: "Connection String",
			cell: () => {
				// We'll need to fetch this for each tenant
				// For now, just show a placeholder
				return (
					<div className="text-sm text-muted-foreground">Not configured</div>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<IconDots className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleEditTenant(row.original)}>
							<IconPencil className="mr-2 h-4 w-4" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleManageConnectionString(row.original)}
						>
							<IconDatabase className="mr-2 h-4 w-4" />
							Connection String
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive"
							disabled={deleteTenantMutation.isPending}
							onClick={() => {
								if (confirm("Are you sure you want to delete this tenant?")) {
									if (row.original.id) {
										handleDeleteTenant(row.original.id);
									}
								}
							}}
						>
							<IconTrash className="mr-2 h-4 w-4" />
							{deleteTenantMutation.isPending ? "Deleting..." : "Delete"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			),
		},
	];

	const table = useReactTable({
		data: tenants,
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
					Failed to load tenants: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<IconBuilding className="h-5 w-5" />
					<span className="text-sm text-muted-foreground">
						{totalCount} tenants total
					</span>
				</div>
				<Button
					onClick={handleCreateNewTenant}
					disabled={createTenantMutation.isPending}
				>
					<IconPlus className="mr-2 h-4 w-4" />
					{createTenantMutation.isPending ? "Creating..." : "Add Tenant"}
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
										<Skeleton className="h-4 w-48" />
									</TableCell>
									<TableCell>
										<Skeleton className="h-4 w-64" />
									</TableCell>
									<TableCell>
										<Button variant="ghost" size="sm" disabled>
											<IconDots className="h-4 w-4" />
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
									No tenants found.
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
						Showing {tenants.length} of {totalCount} tenants
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

			<TenantForm
				key={editingTenant?.id || "create"}
				open={formOpen}
				onOpenChange={closeForm}
				onSubmit={editingTenant ? handleUpdateTenant : handleCreateTenant}
				isLoading={
					createTenantMutation.isPending || updateTenantMutation.isPending
				}
				mode={editingTenant ? "edit" : "create"}
			/>
			<TenantConnectionStringModal />
		</div>
	);
}
