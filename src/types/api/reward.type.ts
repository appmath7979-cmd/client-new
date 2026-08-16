import type { Region } from "../region.type";
import type { MessageApi, TimeApi } from "./base.type";

interface Reward {
	provinceCode: string;
	release: string;
	region: Region;
	gdb: string[];
	g1: string[];
	g2: string[];
	g3: string[];
	g4: string[];
	g5: string[];
	g6: string[];
	g7: string[];
	g8: string[];
}

interface RewardItem extends TimeApi, Reward {
	id: string;
}

interface IRewardApi extends MessageApi {
	reward: RewardItem[];
}

export type { IRewardApi, RewardItem, Reward };
