import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
	userCreateMutation,
	userDeleteMutation,
	userGetListOptions,
	userGetListQueryKey,
	userUpdateMutation,
	userUpdateRolesMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { IdentityUserDto } from "@/infrastructure/api/types.gen";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { UserForm, type UserFormData } from "./user-form";
import { UserPermissionsModal } from "./user-permissions-modal";
import { useUserFormStore } from "../stores/user-form-store";
import { useUserPermissionModalStore } from "../stores/user-permission-store";
import { UsersTable } from "./users-table";
import { UsersHeader } from "./users-header";

export function UsersList() {
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
		user: editingUser,
		open: formOpen,
		setLoading,
		openCreateForm,
		openEditForm,
		closeForm,
	} = useUserFormStore();

	const { openModal: openPermissionsModal } = useUserPermissionModalStore();

	const {
		data: usersResponse,
		isLoading,
		error,
		isError,
	} = useQuery(userGetListOptions(queryOptions));

	const createUserMutation = useMutation({
		...userCreateMutation(),
	});

	const updateUserMutation = useMutation({
		...userUpdateMutation(),
	});

	const _updateUserRolesMutation = useMutation({
		...userUpdateRolesMutation(),
	});

	const deleteUserMutation = useMutation({
		...userDeleteMutation(),
	});

	const users = usersResponse?.items || [];
	const totalCount = usersResponse?.totalCount || 0;

	const handleCreateUser = async (data: UserFormData) => {
		try {
			setLoading(true);
			await createUserMutation.mutateAsync({
				body: {
					userName: data.userName,
					name: data.name || null,
					surname: data.surname || null,
					email: data.email,
					phoneNumber: data.phoneNumber || null,
					isActive: data.isActive,
					lockoutEnabled: data.lockoutEnabled,
					password: data.password || "",
				},
			});
			queryClient.invalidateQueries({
				queryKey: userGetListQueryKey(queryOptions),
			});
			toast.success("User created successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to create user";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateUser = async (data: UserFormData) => {
		if (!editingUser?.id) return;
		try {
			setLoading(true);
			await updateUserMutation.mutateAsync({
				path: { id: editingUser.id },
				body: {
					userName: data.userName,
					name: data.name || null,
					surname: data.surname || null,
					email: data.email,
					phoneNumber: data.phoneNumber || null,
					isActive: data.isActive,
					lockoutEnabled: data.lockoutEnabled,
					password: data.password || null,
					concurrencyStamp: editingUser.concurrencyStamp || null,
				},
			});

			// Update user roles if they are provided
			if (data.roles && Array.isArray(data.roles)) {
				await _updateUserRolesMutation.mutateAsync({
					path: { id: editingUser.id },
					body: {
						roleNames: data.roles,
					},
				});
			}

			// Invalidate and refetch user list to update table
			await queryClient.invalidateQueries({
				queryKey: userGetListQueryKey(queryOptions),
			});
			// Also force a refetch to ensure immediate UI update
			await queryClient.refetchQueries({
				queryKey: userGetListQueryKey(queryOptions),
			});
			toast.success("User updated successfully");
			closeForm();
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to update user";
			toast.error(errorMessage);
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async (userId: string) => {
		try {
			await deleteUserMutation.mutateAsync({
				path: { id: userId },
			});
			queryClient.invalidateQueries({
				queryKey: userGetListQueryKey(queryOptions),
			});
			toast.success("User deleted successfully");
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete user";
			toast.error(errorMessage);
			throw error;
		}
	};

	const handleEditUser = (user: IdentityUserDto) => {
		openEditForm(user);
	};

	const handleCreateNewUser = () => {
		openCreateForm();
	};

	const handleOpenPermissions = (user: IdentityUserDto) => {
		openPermissionsModal(user);
	};

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertDescription>
					Failed to load users: {error?.error?.message || "Unknown error"}
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<UsersHeader
				totalCount={totalCount}
				onCreateUser={handleCreateNewUser}
				isCreating={createUserMutation.isPending}
			/>

			<UsersTable
				users={users}
				isLoading={isLoading}
				sorting={sorting}
				pagination={pagination}
				totalCount={totalCount}
				onSortingChange={setSorting}
				onPaginationChange={setPagination}
				onEditUser={handleEditUser}
				onOpenPermissions={handleOpenPermissions}
				onDeleteUser={handleDeleteUser}
				isDeleting={deleteUserMutation.isPending}
			/>

			<UserForm
				key={editingUser?.id || "create"}
				user={editingUser}
				open={formOpen}
				onOpenChange={closeForm}
				onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
				isLoading={createUserMutation.isPending || updateUserMutation.isPending}
				mode={editingUser ? "edit" : "create"}
			/>
			<UserPermissionsModal />
		</div>
	);
}
