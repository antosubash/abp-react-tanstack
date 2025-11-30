import { create } from "zustand";
import type { TenantDto } from "@/client/types.gen";

interface TenantConnectionState {
	// Modal state
	open: boolean;
	loading: boolean;

	// Data
	tenant: TenantDto | null;
	connectionString: string;

	// Actions
	openModal: (tenant: TenantDto, connectionString?: string) => void;
	closeModal: () => void;
	setLoading: (loading: boolean) => void;
	setConnectionString: (connectionString: string) => void;
	reset: () => void;
}

export const useTenantConnectionStore = create<TenantConnectionState>(
	(set) => ({
		// Initial state
		open: false,
		loading: false,
		tenant: null,
		connectionString: "",

		// Actions
		openModal: (tenant, connectionString = "") =>
			set({
				open: true,
				tenant,
				connectionString: connectionString || "",
			}),

		closeModal: () =>
			set({
				open: false,
				loading: false,
				tenant: null,
				connectionString: "",
			}),

		setLoading: (loading) => set({ loading }),

		setConnectionString: (connectionString) => set({ connectionString }),

		reset: () =>
			set({
				open: false,
				loading: false,
				tenant: null,
				connectionString: "",
			}),
	}),
);
