import type {
	ICustomerApi,
	ICustomerItem,
	IQueryAll,
} from "#/types/api/customer.type";
import { baseApi } from "./base.api";

export const customerApi = {
	get: async ({ order, release }: IQueryAll) => {
		const res: ICustomerApi = await baseApi.get(
			`customer?order=${order}&release=${release}`,
		);
		return res;
	},
	getById: async (id: string) => {
		const res: ICustomerItem = await baseApi.get(`customer/${id}`);
		return res;
	},
};
