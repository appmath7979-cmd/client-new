import type { IOrderApi, IQueryByCustomerId } from "#/types/api/order.type";
import { baseApi } from "./base.api";

export const orderApi = {
	get: async ({ customerId, release }: IQueryByCustomerId) => {
		const res: IOrderApi = await baseApi.get(
			`order?customerId=${customerId}&release=${release}`,
		);
		return res;
	},
};
