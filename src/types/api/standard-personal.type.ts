import type { Region } from "../region.type";

interface IStandardPerQuery {
	customerId: string;
	day?: number;
}

interface StandardPerItem {
	customerId: string;
	day: number;
	id: string;
	region: Region;
	stationCode: string;
	value: number;
	type: string
	syntax: string
}

export type { IStandardPerQuery, StandardPerItem };
