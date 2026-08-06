import { createBox } from "@lavaz/store";
import type { Region } from "#/types/region.type";

interface RegionState {
	region: Region;
}

const initialState = {
	region: "MB",
} satisfies RegionState as RegionState;

export const regionBox = createBox(initialState, (set) => ({
	setRegion: (region: Region) => set((prev) => ({ ...prev, region })),
})).create();
