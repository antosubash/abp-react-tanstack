import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { commentAdminUpdateSettingsMutation } from "@/infrastructure/api/@tanstack/react-query.gen";
import type { CommentSettingsDto } from "@/infrastructure/api/types.gen";
import { SETTINGS_MESSAGES } from "../constants";

export function useUpdateCommentSettings() {
	return useMutation({
		...commentAdminUpdateSettingsMutation({}),
		mutationFn: async (data: CommentSettingsDto) => {
			return commentAdminUpdateSettingsMutation({}).mutationFn({
				body: data,
			});
		},
		onSuccess: () => {
			toast.success(SETTINGS_MESSAGES.COMMENTS.SAVE_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.COMMENTS.SAVE_ERROR);
		},
	});
}
