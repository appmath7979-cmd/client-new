import type { IOrderApi, IOrderDetailApi, IQueryByCustomerId, IQueryById } from "#/types/api/order.type";
import { baseApi } from "./base.api";

export const orderApi = {
	get: async ({ customerId, release }: IQueryByCustomerId) => {
		const res: IOrderApi = await baseApi.get(
			`order?customerId=${customerId}&release=${release}`,
		);
		return res;
	},
	getById: async (data: IQueryById) => {
		const { customerId, orderId } = data
		const res: IOrderDetailApi = await baseApi.get(`order/customer/${customerId}/order/${orderId}`, { data })
		return res;
	}
};
