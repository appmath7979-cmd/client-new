import type { Region } from "./region.type";

interface IProvinceItem {
	label: string;
	syntax: string;
	code: string;
	region: Region;
}

export type { IProvinceItem };
