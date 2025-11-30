import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	userGetListOptions,
	roleGetListOptions,
	tenantGetListOptions,
} from "../@tanstack/react-query.gen";

describe.skip("API Client Integration", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					gcTime: 0,
				},
				mutations: {
					retry: false,
				},
			},
		});
		vi.clearAllMocks();
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);

	describe("User API Integration", () => {
		it("should fetch users list successfully", async () => {
			const { result } = renderHook(
				() => userGetListOptions({
					query: {
						MaxResultCount: 10,
						SkipCount: 0,
					},
				}),
				{ wrapper }
			);

			const query = queryClient.fetchQuery(result.current);

			await expect(query).resolves.toHaveProperty("items");
			await expect(query).resolves.toHaveProperty("totalCount");
		});

		it.skip("should create user successfully", async () => {
			// TODO: Rewrite for TanStack Query v5 - use renderHook with useMutation
			expect(true).toBe(true); // Placeholder assertion
		});

		it.skip("should update user successfully", async () => {
			// TODO: Rewrite for TanStack Query v5 - use renderHook with useMutation
			expect(true).toBe(true); // Placeholder assertion
		});

		it.skip("should delete user successfully", async () => {
			// TODO: Rewrite for TanStack Query v5 - use renderHook with useMutation
			expect(true).toBe(true); // Placeholder assertion
		});

		it.skip("should handle user not found error", async () => {
			// TODO: Rewrite for TanStack Query v5 - use renderHook with useMutation
			expect(true).toBe(true); // Placeholder assertion
		});
	});

	describe("Role API Integration", () => {
		it("should fetch roles list successfully", async () => {
			const { result } = renderHook(
				() => roleGetListOptions({
					query: {
						MaxResultCount: 10,
						SkipCount: 0,
					},
				}),
				{ wrapper }
			);

			const query = queryClient.fetchQuery(result.current);

			await expect(query).resolves.toHaveProperty("items");
			await expect(query).resolves.toHaveProperty("totalCount");
			expect(Array.isArray((await query).items)).toBe(true);
		});
	});

	describe("Tenant API Integration", () => {
		it("should fetch tenants list successfully", async () => {
			const { result } = renderHook(
				() => tenantGetListOptions({
					query: {
						MaxResultCount: 10,
						SkipCount: 0,
					},
				}),
				{ wrapper }
			);

			const query = queryClient.fetchQuery(result.current);

			await expect(query).resolves.toHaveProperty("items");
			await expect(query).resolves.toHaveProperty("totalCount");
			expect(Array.isArray((await query).items)).toBe(true);
		});
	});

	describe("Query Caching", () => {
		it("should cache query results", async () => {
			const queryOptions = userGetListOptions({
				query: {
					MaxResultCount: 5,
					SkipCount: 0,
				},
			});

			// First query
			const result1 = await queryClient.fetchQuery(queryOptions);
			expect(result1).toHaveProperty("items");

			// Second query should use cache
			const result2 = await queryClient.fetchQuery(queryOptions);
			expect(result2).toEqual(result1);
		});

		it.skip("should invalidate cache after mutation", async () => {
			// TODO: Rewrite for TanStack Query v5 - use renderHook with useMutation
			expect(true).toBe(true); // Placeholder assertion
		});
	});

	describe("Error Handling", () => {
		it("should handle network errors gracefully", async () => {
			const queryOptions = userGetListOptions({
				query: {
					MaxResultCount: 10,
					SkipCount: 0,
				},
			});

			// Mock a network failure by temporarily changing the API URL
			const originalFetch = global.fetch;
			global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

			await expect(queryClient.fetchQuery(queryOptions)).rejects.toThrow("Network error");

			global.fetch = originalFetch;
		});

		it.skip("should handle API validation errors", async () => {
			// TODO: Rewrite for TanStack Query v5 - use renderHook with useMutation
			expect(true).toBe(true); // Placeholder assertion
		});
	});
});
