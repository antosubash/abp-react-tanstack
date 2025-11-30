import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactElement, ReactNode } from "react";
import { AuthProvider } from "@/features/auth/hooks/use-auth";

// Create a test query client
export const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	});

// Test wrapper component
export function TestWrapper({ children }: { children: ReactNode }) {
	const queryClient = createTestQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>{children}</AuthProvider>
		</QueryClientProvider>
	);
}

// Custom render function for React Testing Library
export function renderWithProviders(ui: ReactElement) {
	return {
		...require("@testing-library/react").render(ui, {
			wrapper: TestWrapper,
		}),
	};
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export * from "@testing-library/dom";
