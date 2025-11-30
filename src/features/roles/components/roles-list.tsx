import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	roleCreateMutation,
	roleDeleteMutation,
	roleGetListOptions,
	roleGetListQueryKey,
	roleUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { IdentityRoleDto } from "@/infrastructure/api/types.gen";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { RoleForm, type RoleFormData } from "./role-form";
import { RolePermissionsModal } from "./role-permissions-modal";
import { useRoleFormStore } from "../stores/role-form-store";
import { usePermissionModalStore } from "../stores/permission-store";
import { RolesTable } from "./roles-table";
import { RolesHeader } from "./roles-header";

export function RolesList() {
	const [sorting, setSorting] = useState([]);
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	});

	const queryOptions = {
		query: {
			MaxResultCount: pagination.pageSize,
			SkipCount: pagination.pageIndex * pagination.pageSize,
		},
	};
	const queryClient = useQueryClient();

	const {
		role: editingRole,
		open: formOpen,
		setLoading,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useRoleFormStore();

	const { openModal: openPermissionsModal } = usePermissionModalStore();

	const {
		data: rolesResponse,
		isLoading,
		error,
		isError,
	} = useQuery(roleGetListOptions(queryOptions));

	const createRoleMutation = useMutation({
		...roleCreateMutation(),
	});

	const updateRoleMutation = useMutation({
		...roleUpdateMutation(),
	});

	const deleteRoleMutation = useMutation({
		...roleDeleteMutation(),
	});

	const roles = rolesResponse?.items || [];
	const totalCount = rolesResponse?.totalCount || 0;

	const handleCreateRole = async (data: RoleFormData) => {
		try {
			setLoading(true);
			await createRoleMutation.mutateAsync({
				body: {
					name: data.name,
					isDefault: data.isDefault,
					isPublic: data.isPublic,
				},
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create role";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateRole = async (data: RoleFormData) => {
		if (!editingRole?.id) return;
		try {
			setLoading(true);
			await updateRoleMutation.mutateAsync({
				path: { id: editingRole.id },
				body: {
					name: data.name,
					isDefault: data.isDefault,
					isPublic: data.isPublic,
					concurrencyStamp: editingRole.concurrencyStamp || null,
				},
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update role";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteRole = async (roleId: string) => {
		try {
			await deleteRoleMutation.mutateAsync({
				path: { id: roleId },
			});
			queryClient.invalidateQueries({
				queryKey: roleGetListQueryKey(queryOptions),
			});
			toast.success("Role deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete role";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleEditRole = (role: IdentityRoleDto) => {
		openEditForm(role);
	};

	const handleCreateNewRole = () => {
		openCreateForm();
	};

	const handleOpenPermissions = (role: IdentityRoleDto) => {
		openPermissionsModal(role);
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load roles: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<RolesHeader
				totalCount={totalCount}
				onCreateRole={handleCreateNewRole}
				isCreating={createRoleMutation.isPending}
			/>

			<RolesTable
				roles={roles}
				isLoading={isLoading}
				sorting={sorting}
				pagination={pagination}
				totalCount={totalCount}
				onSortingChange={setSorting}
				onPaginationChange={setPagination}
				onEditRole={handleEditRole}
				onOpenPermissions={handleOpenPermissions}
				onDeleteRole={handleDeleteRole}
				isDeleting={deleteRoleMutation.isPending}
			/>

			<RoleForm
				key={editingRole?.id || "create"}
				role={editingRole}
				open={formOpen}
				onOpenChange={closeForm}
				onSubmit={editingRole ? handleUpdateRole : handleCreateRole}
				isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
				mode={editingRole ? "edit" : "create"}
			/>
			<RolePermissionsModal />
		</div>
	);
}
