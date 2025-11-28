import type { IdentityUserDto } from "@/client/types.gen";
import { create } from "zustand";

interface UserFormState {
	user: IdentityUserDto | null;
	open: boolean;
	isLoading: boolean;
	mode: "create" | "edit";
}

interface UserFormActions {
	openCreateForm: () => void;
	openEditForm: (user: IdentityUserDto) => void;
	closeForm: () => void;
	setLoading: (loading: boolean) => void;
	reset: () => void;
}

type UserFormStore = UserFormState & UserFormActions;

const initialState: UserFormState = {
	user: null,
	open: false,
	isLoading: false,
	mode: "create",
};

export const useUserFormStore = create<UserFormStore>((set) => ({
	...initialState,

	openCreateForm: () =>
		set({
			user: null,
			open: true,
			mode: "create",
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

	reset: () => set(initialState),
}));
