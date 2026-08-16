import { queryOptions } from "@tanstack/react-query";
import { rewardApi } from "#/apis/reward.api";

function rewardQuery(release?: string) {
	return queryOptions({
		queryKey: ["reward", release ?? ""],
		queryFn: () => rewardApi.get(release),
	});
}

export { rewardQuery };
