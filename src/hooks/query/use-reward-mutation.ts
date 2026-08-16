import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rewardApi } from "#/apis/reward.api";
import type { Reward } from "#/types/api/reward.type";

export function useRewardMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Reward[]) => rewardApi.post(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (error) => error,
	});
}
