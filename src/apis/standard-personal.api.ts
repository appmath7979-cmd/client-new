import type { MessageApi, TimeApi } from "#/types/api/base.type";
import type { IStandardPerQuery, StandardPerItem } from "#/types/api/standard-personal.type";
import { baseApi } from "./base.api";

async function getStandardPersonalApi({ customerId, day }: IStandardPerQuery) {
	const res: { standards: Array<StandardPerItem & TimeApi> } & MessageApi = await baseApi.get(
		`standard-personal/customer/${customerId}?day=${day}`,
	);
	return res;
}

export { getStandardPersonalApi };
