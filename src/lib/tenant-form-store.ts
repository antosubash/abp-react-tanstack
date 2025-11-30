import { create } from "zustand";
import type { TenantDto } from "@/client/types.gen";

interface TenantFormData {
	name: string;
	adminEmailAddress?: string;
	adminPassword?: string;
	isActive?: boolean;
}

interface TenantFormState {
	// Form state
	open: boolean;
	mode: "create" | "edit";
	loading: boolean;

	// Data
	tenant: TenantDto | null;
	formData: TenantFormData;

	// Actions
	openCreateForm: () => void;
	openEditForm: (tenant: TenantDto) => void;
	closeForm: () => void;
	setLoading: (loading: boolean) => void;
	updateFormData: (data: Partial<TenantFormData>) => void;
	resetForm: () => void;
}

const initialFormData: TenantFormData = {
	name: "",
	adminEmailAddress: "",
	adminPassword: "",
	isActive: true,
};

export const useTenantFormStore = create<TenantFormState>((set, _get) => ({
	// Initial state
	open: false,
	mode: "create",
	loading: false,
	tenant: null,
	formData: { ...initialFormData },

	// Actions
	openCreateForm: () =>
		set({
			open: true,
			mode: "create",
			tenant: null,
			formData: { ...initialFormData },
		}),

	openEditForm: (tenant) =>
		set({
			open: true,
			mode: "edit",
			tenant,
			formData: {
				name: tenant.name || "",
				isActive: true, // Default to true since TenantDto doesn't have isActive
			},
		}),

	closeForm: () =>
		set({
			open: false,
			loading: false,
			tenant: null,
			formData: { ...initialFormData },
		}),

	setLoading: (loading) => set({ loading }),

	updateFormData: (data) =>
		set((state) => ({
			formData: { ...state.formData, ...data },
		})),

	resetForm: () =>
		set({
			formData: { ...initialFormData },
		}),
}));
