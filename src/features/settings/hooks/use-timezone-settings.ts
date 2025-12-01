import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	timeZoneSettingsGetOptions,
	timeZoneSettingsGetTimezonesOptions,
	timeZoneSettingsUpdateMutation,
} from "@/infrastructure/api/@tanstack/react-query.gen";
import { SETTINGS_MESSAGES } from "../constants";

export const TIMEZONE_SETTINGS_QUERY_KEY = ["settings", "timezone"] as const;
export const TIMEZONES_LIST_QUERY_KEY = ["settings", "timezones"] as const;

export function useTimezoneSettings() {
	return useQuery({
		...timeZoneSettingsGetOptions({}),
		queryKey: TIMEZONE_SETTINGS_QUERY_KEY,
	});
}

export function useTimezonesList() {
	return useQuery({
		...timeZoneSettingsGetTimezonesOptions({}),
		queryKey: TIMEZONES_LIST_QUERY_KEY,
	});
}

export function useUpdateTimezoneSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		...timeZoneSettingsUpdateMutation({}),
		mutationFn: async (timezone: string) => {
			return timeZoneSettingsUpdateMutation({}).mutationFn({
				query: { timezone },
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TIMEZONE_SETTINGS_QUERY_KEY });
			toast.success(SETTINGS_MESSAGES.TIMEZONE.SAVE_SUCCESS);
		},
		onError: () => {
			toast.error(SETTINGS_MESSAGES.TIMEZONE.SAVE_ERROR);
		},
	});
}
