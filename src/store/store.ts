import { createStore } from "@lavaz/store";
import { dateBox } from "./boxes/date.box";
import { regionBox } from "./boxes/region.box";
import { rewardBox } from "./boxes/reward.box";

export const store = createStore({
	date: dateBox,
	region: regionBox,
	reward: rewardBox,
});
