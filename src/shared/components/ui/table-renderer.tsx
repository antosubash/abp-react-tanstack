import type {
	ColumnDef,
	CellContext,
	HeaderContext,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";

interface TableRendererProps<TData> {
	data: TData[];
	columns: ColumnDef<TData>[];
	pagination: {
		pageIndex: number;
		pageSize: number;
	};
	totalCount: number;
	onPaginationChange: (pagination: {
		pageIndex: number;
		pageSize: number;
	}) => void;
	tableTestId?: string;
	rowTestId?: string;
}

export function TableRenderer<TData>({
	data,
	columns,
	pagination,
	totalCount,
	onPaginationChange,
	tableTestId,
	rowTestId,
}: TableRendererProps<TData>) {
	const totalPages = Math.ceil(totalCount / pagination.pageSize);
	const canPreviousPage = pagination.pageIndex > 0;
	const canNextPage = pagination.pageIndex < totalPages - 1;

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table data-testid={tableTestId}>
					<TableHeader>
						<TableRow>
							{columns.map((column, index) => (
								<TableHead
									key={
										(column.id as string) ||
										(column.accessorKey as string) ||
										`column-${index}`
									}
								>
									{typeof column.header === "function"
										? column.header({
												column,
												header: column,
											} as HeaderContext<TData, unknown>)
										: (column.header as string)}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((row, index) => (
							<TableRow
								key={`row-${index}-${JSON.stringify(row)}`}
								data-testid={rowTestId}
							>
								{columns.map((column, colIndex) => {
									let cellContent: React.ReactNode = "";
									if (typeof column.cell === "function") {
										try {
											const cellContext = {
												row: {
													original: row,
													index,
												},
											} as CellContext<TData, unknown>;
											cellContent = column.cell(cellContext);
										} catch {
											cellContent = "";
										}
									} else if (column.cell) {
										cellContent = column.cell;
									} else if (column.header) {
										cellContent =
											typeof column.header === "function"
												? column.header({
														column,
														header: column,
													} as HeaderContext<TData, unknown>)
												: column.header;
									}
									return (
										<TableCell
											key={
												(column.id as string) ||
												(column.accessorKey as string) ||
												`cell-${index}-${colIndex}`
											}
										>
											{cellContent}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div
				className="flex items-center justify-between px-2"
				data-testid="users-pagination"
			>
				<div className="flex-1 text-sm text-muted-foreground">
					Showing {pagination.pageIndex * pagination.pageSize + 1} to{" "}
					{Math.min(
						(pagination.pageIndex + 1) * pagination.pageSize,
						totalCount,
					)}{" "}
					of {totalCount} entries
				</div>
				<div className="flex items-center space-x-6 lg:space-x-8">
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Rows per page</p>
						<Select
							value={`${pagination.pageSize}`}
							onValueChange={(value) =>
								onPaginationChange({
									...pagination,
									pageSize: Number(value),
								})
							}
						>
							<SelectTrigger className="h-8 w-[70px]">
								<SelectValue placeholder={pagination.pageSize} />
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div
						className="flex w-[100px] items-center justify-center text-sm font-medium"
						data-testid="current-page"
					>
						Page {pagination.pageIndex + 1} of {totalPages}
					</div>

					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: 0,
								})
							}
							disabled={!canPreviousPage}
						>
							<span className="sr-only">Go to first page</span>
							<IconChevronLeft className="h-4 w-4" />
							<IconChevronLeft className="h-4 w-4 -translate-x-2" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: pagination.pageIndex - 1,
								})
							}
							disabled={!canPreviousPage}
						>
							<span className="sr-only">Go to previous page</span>
							<IconChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							data-testid="next-page-btn"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: pagination.pageIndex + 1,
								})
							}
							disabled={!canNextPage}
						>
							<span className="sr-only">Go to next page</span>
							<IconChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							onClick={() =>
								onPaginationChange({
									...pagination,
									pageIndex: totalPages - 1,
								})
							}
							disabled={!canNextPage}
						>
							<span className="sr-only">Go to last page</span>
							<IconChevronRight className="h-4 w-4" />
							<IconChevronRight className="h-4 w-4 translate-x-2" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
