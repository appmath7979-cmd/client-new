import type { MessageApi } from "#/types/api/base.type";
import type { IRewardApi, Reward } from "#/types/api/reward.type";
import { baseApi } from "./base.api";

const rewardApi = {
  get: async (release?: string) => {
    const route = release ? `reward?release=${release}` : "reward"
    const res: IRewardApi = await baseApi.get(route);
    return res;
  },
  post: async (data: Reward[]) => {
    const res: MessageApi = await baseApi.post("reward", data);
    return res;
  },
};

export { rewardApi };
