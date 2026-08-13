import type { Customer } from "#/schema/create-customer.schema";
import type { Region } from "../region.type";
import type { MessageApi, TimeApi } from "./base.type";

interface IQueryByCustomerId {
	release: string;
	customerId: string;
}

interface IQueryById {
	orderId: string;
	customerId: string;
}

interface IOrderDetailItem {
	number: string;
	customerId: string | null;
	id: string;
	type: string;
	date: string;
	syntax: string;
	stationCode: string;
	price: number;
	xac: number;
	co: number;
	trung: number;
	orderId: string;
}

interface IOrderItem extends TimeApi {
	id: string;
	details: Array<IOrderDetailItem & TimeApi>;
	customerId: string | null;
	release: string;
	isLayoff: boolean;
	region: Region;
	message: string;
	isSend: boolean | null;
}

interface ICustomerWithOrder
	extends Pick<Customer, "daxt">,
	Pick<Customer, "type">,
	Pick<Customer, "fullName">,
	Pick<Customer, "settings"> { }

interface IOrderApi extends MessageApi {
	orders: IOrderItem[];
	customer: ICustomerWithOrder;
}

interface IOrderDetailApi extends MessageApi {
	order: IOrderItem & TimeApi & { customer: { fullName: string | null, type: "GUEST" | "OWNER" } } & { details: Array<IOrderDetailItem & TimeApi> }
}


// {
// 	details: {
// 		number: string;
// 		customerId: string | null;
// 		orderId: string;
// 		id: string;
// 		createdAt: Date;
// 		updatedAt: Date;
// 		type: string;
// 		date: string;
// 		syntax: string;
// 		stationCode: string;
// 		price: number;
// 		xac: number;
// 		co: number;
// 		trung: number;
// 	} [];
// 	customer: {
// 		fullName: string;
// 	} | null;
// } & {
// 	customerId: string | null;
// 	id: string;
// 	release: string;
// 	isLayoff: boolean;
// 	region: $Enums.Region;
// 	message: string;
// 	isSend: boolean | null;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

export type {
	IOrderItem,
	IOrderApi,
	IOrderDetailItem,
	IQueryByCustomerId,
	ICustomerWithOrder,
	IOrderDetailApi,
	IQueryById
};
