import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	profileChangePasswordMutation,
	profileGetOptions,
	profileUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type { ProfileDto } from "@/infrastructure/api/types.gen";
import { PROFILE_MESSAGES } from "../constants";

const PROFILE_QUERY_KEY = ["profile", "my-profile"];

export function useProfileData() {
	const {
		data: profile,
		isLoading,
		error,
		refetch,
	} = useQuery({
		...profileGetOptions(),
		queryKey: PROFILE_QUERY_KEY,
	});

	return {
		profile: profile as ProfileDto | undefined,
		isLoading,
		error,
		refetch,
	};
}

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		...profileUpdateMutation(),
		onSuccess: (data) => {
			queryClient.setQueryData(PROFILE_QUERY_KEY, data);
			toast.success(PROFILE_MESSAGES.GENERAL.SAVE_SUCCESS);
		},
		onError: (error) => {
			console.error("Failed to update profile:", error);
			toast.error(PROFILE_MESSAGES.GENERAL.SAVE_ERROR);
		},
	});
}

export function useChangePassword() {
	return useMutation({
		...profileChangePasswordMutation(),
		onSuccess: () => {
			toast.success(PROFILE_MESSAGES.SECURITY.SAVE_SUCCESS);
		},
		onError: (error: Error) => {
			console.error("Failed to change password:", error);

			// Check if it's an incorrect current password error
			const errorMessage = error.message || "";
			if (
				errorMessage.includes("current") ||
				errorMessage.includes("incorrect")
			) {
				toast.error(PROFILE_MESSAGES.SECURITY.INCORRECT_CURRENT);
			} else {
				toast.error(PROFILE_MESSAGES.SECURITY.SAVE_ERROR);
			}
		},
	});
}

export function useProfileMutations() {
	const updateProfile = useUpdateProfile();
	const changePassword = useChangePassword();

	return {
		updateProfile,
		changePassword,
	};
}
