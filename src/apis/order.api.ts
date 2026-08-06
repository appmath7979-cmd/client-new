import type { IOrderApi } from "#/types/api/order.type";
import { baseApi } from "./base.api";

export const orderApi = {
	get: async ({
		customerId,
		release,
	}: {
		release: string;
		customerId: string;
	}) => {
		const res: IOrderApi = await baseApi.get(
			`order?customerId=${customerId}&release=${release}`,
		);
		return res;
	},
};
