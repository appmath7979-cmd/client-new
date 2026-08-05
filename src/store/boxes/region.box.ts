import type { Region } from "#/types/region.type";
import { createBox } from "@lavaz/store";

interface RegionState {
  region: Region
}

const initialState = {
  region: "MB"
} satisfies RegionState as RegionState

export const regionBox = createBox(initialState, set => ({
  onSelectRegion: (region: Region) => set(prev => ({ ...prev, region }))
})).create()