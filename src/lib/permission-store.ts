import { create } from "zustand";
import type {
	IdentityRoleDto,
	PermissionGrantInfoDto,
	PermissionGroupDto,
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
	apiGroups: PermissionGroupDto[];
	groupNameToPermissionsMap: Record<string, string[]>;

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
	setApiGroups: (groups: PermissionGroupDto[]) => void;
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
	apiGroups: [],
	groupNameToPermissionsMap: {},
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
				apiGroups: [],
				groupNameToPermissionsMap: {},
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

		setApiGroups: (groups: PermissionGroupDto[]) => {
			// Create a mapping from group display name to permission names
			const map: Record<string, string[]> = {};
			
			groups.forEach((group) => {
				if (!group.name) return;
				
				const groupName = group.displayName || group.name;
				map[groupName] = [];
				
				if (group.permissions) {
					group.permissions.forEach((permission) => {
						if (permission.name) {
							map[groupName].push(permission.name);
						}
					});
				}
			});
			
			set({
				apiGroups: groups,
				groupNameToPermissionsMap: map,
			});
		},

		updateGroupPermissions: (groupName: string, isGranted: boolean) => {
			const { allPermissions, searchTerm, groupNameToPermissionsMap } = get();
			
			// Get the permission names that belong to this group
			const groupPermissionNames = groupNameToPermissionsMap[groupName] || [];
			
			const updatePermissionList = (permissions: PermissionGrantInfoDto[]) =>
				permissions.map((permission) => {
					if (!permission.name) return permission;
					
					// Check if this permission belongs to the specified group
					if (groupPermissionNames.includes(permission.name)) {
						return { ...permission, isGranted };
					}
					
					return permission;
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
