import { create } from "zustand";
import type { IdentityRoleDto } from "@/client/types.gen";

interface RoleFormState {
	// Form state
	role: IdentityRoleDto | null;
	open: boolean;
	isLoading: boolean;
	mode: "create" | "edit";

	// Actions
	setLoading: (loading: boolean) => void;
	openCreateForm: () => void;
	openEditForm: (role: IdentityRoleDto) => void;
	closeForm: () => void;
}

export const useRoleFormStore = create<RoleFormState>((set) => ({
	// Initial state
	role: null,
	open: false,
	isLoading: false,
	mode: "create",

	// Actions
	setLoading: (loading: boolean) => set({ isLoading: loading }),

	openCreateForm: () =>
		set({
			role: null,
			open: true,
			mode: "create",
			isLoading: false,
		}),

	openEditForm: (role: IdentityRoleDto) =>
		set({
			role,
			open: true,
			mode: "edit",
			isLoading: false,
		}),

	closeForm: () =>
		set({
			role: null,
			open: false,
			mode: "create",
			isLoading: false,
		}),
}));
