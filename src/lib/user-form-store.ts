import type { IdentityUserDto } from "@/client/types.gen";
import { create } from "zustand";

interface UserFormState {
	user: IdentityUserDto | null;
	open: boolean;
	isLoading: boolean;
	mode: "create" | "edit";
	selectedRoles: string[];
}

interface UserFormActions {
	openCreateForm: () => void;
	openEditForm: (user: IdentityUserDto) => void;
	closeForm: () => void;
	setLoading: (loading: boolean) => void;
	setSelectedRoles: (roles: string[]) => void;
	reset: () => void;
}

type UserFormStore = UserFormState & UserFormActions;

const initialState: UserFormState = {
	user: null,
	open: false,
	isLoading: false,
	mode: "create",
	selectedRoles: [],
};

export const useUserFormStore = create<UserFormStore>((set) => ({
	...initialState,

	openCreateForm: () =>
		set({
			user: null,
			open: true,
			mode: "create",
			selectedRoles: [],
		}),

	openEditForm: (user: IdentityUserDto) =>
		set({
			user,
			open: true,
			mode: "edit",
		}),

	closeForm: () =>
		set({
			open: false,
		}),

	setLoading: (loading: boolean) =>
		set({
			isLoading: loading,
		}),

	setSelectedRoles: (roles: string[]) =>
		set({
			selectedRoles: roles,
		}),

	reset: () => set(initialState),
}));
