import {
	createFacetedRowModel,
	createFacetedUniqueValues,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	filterFns,
	sortFns,
	stockFeatures,
	tableFeatures,
} from "@tanstack/react-table";
import { z } from "zod";

export const dashboardTableFeatures = tableFeatures({
	...stockFeatures,
	filteredRowModel: createFilteredRowModel(),
	filterFns,
	sortedRowModel: createSortedRowModel(),
	sortFns,
	paginatedRowModel: createPaginatedRowModel(),
	facetedRowModel: createFacetedRowModel(),
	facetedUniqueValues: createFacetedUniqueValues(),
});

export type DashboardTableFeatures = typeof dashboardTableFeatures;

export const schema = z.object({
	id: z.number(),
	header: z.string(),
	type: z.string(),
	status: z.string(),
	target: z.string(),
	limit: z.string(),
	reviewer: z.string(),
	completionDate: z.string().optional(),
	assignee: z.string().optional(),
});

export type DataTableSchema = z.infer<typeof schema>;
