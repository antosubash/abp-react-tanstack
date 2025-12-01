import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	emailSettingsGetOptions,
	emailSettingsSendTestEmailMutation,
	emailSettingsUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import type {
	SendTestEmailInput,
	UpdateEmailSettingsDto,
} from "@/infrastructure/api/types.gen";
import { SETTINGS_MESSAGES } from "../constants";

export const EMAIL_SETTINGS_QUERY_KEY = ["settings", "email"] as const;

export function useEmailSettings() {
	return useQuery({
		...emailSettingsGetOptions({}),
		queryKey: EMAIL_SETTINGS_QUERY_KEY,
	});
}

export function useUpdateEmailSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		...emailSettingsUpdateMutation({}),
		mutationFn: async (data: UpdateEmailSettingsDto) => {
			return emailSettingsUpdateMutation({}).mutationFn({
				body: data,
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: EMAIL_SETTINGS_QUERY_KEY });
			toast.success(SETTINGS_MESSAGES.EMAIL.SAVE_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.EMAIL.SAVE_ERROR);
		},
	});
}

export function useSendTestEmail() {
	return useMutation({
		...emailSettingsSendTestEmailMutation({}),
		mutationFn: async (data: SendTestEmailInput) => {
			return emailSettingsSendTestEmailMutation({}).mutationFn({
				body: data,
			});
		},
		onSuccess: () => {
			toast.success(SETTINGS_MESSAGES.EMAIL.TEST_EMAIL_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.EMAIL.TEST_EMAIL_ERROR);
		},
	});
}
