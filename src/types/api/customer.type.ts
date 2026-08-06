import type { Customer } from "#/schema/create-customer.schema";
import type { MessageApi } from "./base.type";

interface IQueryAll {
	order?: boolean;
	release?: string;
}

interface ICustomerItem extends Customer {
	id: string;
	orders?: MessageApi[];
}

interface ICustomerApi extends MessageApi {
	customers: ICustomerItem[];
}

export type { ICustomerApi, ICustomerItem, IQueryAll };
