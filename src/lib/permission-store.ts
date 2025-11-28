import { create } from "zustand";
import type {
	IdentityRoleDto,
	PermissionGrantInfoDto,
} from "@/client/types.gen";
import { filterPermissions } from "./permission-utils";

interface PermissionModalState {
	// Modal state
	open: boolean;
	role: IdentityRoleDto | null;

	// Data state
	allPermissions: PermissionGrantInfoDto[];
	rolePermissions: PermissionGrantInfoDto[];
	filteredPermissions: PermissionGrantInfoDto[];
	searchTerm: string;

	// UI state
	isLoading: boolean;
	isSaving: boolean;
	error: string | null;

	// Actions
	openModal: (role: IdentityRoleDto) => void;
	closeModal: () => void;
	setAllPermissions: (permissions: PermissionGrantInfoDto[]) => void;
	setRolePermissions: (permissions: PermissionGrantInfoDto[]) => void;
	setSearchTerm: (term: string) => void;
	updatePermission: (permissionName: string, isGranted: boolean) => void;
	updateGroupPermissions: (groupName: string, isGranted: boolean) => void;
	setLoading: (loading: boolean) => void;
	setSaving: (saving: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

const initialState = {
	open: false,
	role: null,
	allPermissions: [],
	rolePermissions: [],
	filteredPermissions: [],
	searchTerm: "",
	isLoading: false,
	isSaving: false,
	error: null,
};

export const usePermissionModalStore = create<PermissionModalState>(
	(set, get) => ({
		...initialState,

		openModal: (role: IdentityRoleDto) =>
			set({
				role,
				open: true,
				searchTerm: "",
				error: null,
				allPermissions: [],
				rolePermissions: [],
				filteredPermissions: [],
			}),

		closeModal: () =>
			set({
				open: false,
				role: null,
				searchTerm: "",
				error: null,
				allPermissions: [],
				rolePermissions: [],
				filteredPermissions: [],
			}),

		setAllPermissions: (permissions: PermissionGrantInfoDto[]) => {
			const { rolePermissions, searchTerm } = get();

			// Update all permissions with role-specific granted status
			const updatedPermissions = permissions.map((permission) => {
				if (!permission.name) return permission;

				const rolePermission = rolePermissions.find(
					(rp) => rp.name === permission.name,
				);

				return {
					...permission,
					isGranted: rolePermission?.isGranted || false,
				};
			});

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedPermissions, searchTerm)
				: updatedPermissions;

			set({
				allPermissions: updatedPermissions,
				filteredPermissions,
			});
		},

		setRolePermissions: (permissions: PermissionGrantInfoDto[]) => {
			const { allPermissions, searchTerm } = get();

			// Update all permissions with role-specific granted status
			const updatedPermissions = allPermissions.map((permission) => {
				if (!permission.name) return permission;

				const rolePermission = permissions.find(
					(rp) => rp.name === permission.name,
				);

				return {
					...permission,
					isGranted: rolePermission?.isGranted || false,
				};
			});

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedPermissions, searchTerm)
				: updatedPermissions;

			set({
				rolePermissions: permissions,
				allPermissions: updatedPermissions,
				filteredPermissions,
			});
		},

		setSearchTerm: (term: string) => {
			const { allPermissions } = get();

			// Filter permissions based on search term
			const filteredPermissions = term
				? filterPermissions(allPermissions, term)
				: allPermissions;

			set({
				searchTerm: term,
				filteredPermissions,
			});
		},

		updatePermission: (permissionName: string, isGranted: boolean) => {
			const { allPermissions, searchTerm } = get();

			const updatePermissionList = (permissions: PermissionGrantInfoDto[]) =>
				permissions.map((permission) =>
					permission.name === permissionName
						? { ...permission, isGranted }
						: permission,
				);

			const updatedAllPermissions = updatePermissionList(allPermissions);

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedAllPermissions, searchTerm)
				: updatedAllPermissions;

			set({
				allPermissions: updatedAllPermissions,
				filteredPermissions,
			});
		},

		updateGroupPermissions: (groupName: string, isGranted: boolean) => {
			const { allPermissions, searchTerm } = get();

			const updatePermissionList = (permissions: PermissionGrantInfoDto[]) =>
				permissions.map((permission) => {
					if (!permission.name) return permission;

					// Extract group name from permission name
					const parts = permission.name.split(".");
					const permissionGroupName = parts.length > 1 ? parts[0] : "Other";

					return permissionGroupName === groupName
						? { ...permission, isGranted }
						: permission;
				});

			const updatedAllPermissions = updatePermissionList(allPermissions);

			// Apply search filter if needed
			const filteredPermissions = searchTerm
				? filterPermissions(updatedAllPermissions, searchTerm)
				: updatedAllPermissions;

			set({
				allPermissions: updatedAllPermissions,
				filteredPermissions,
			});
		},

		setLoading: (loading: boolean) => set({ isLoading: loading }),

		setSaving: (saving: boolean) => set({ isSaving: saving }),

		setError: (error: string | null) => set({ error }),

		reset: () => set(initialState),
	}),
);
