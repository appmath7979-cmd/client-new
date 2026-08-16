import { queryOptions } from "@tanstack/react-query";
import { customerApi } from "#/apis/customer.api";
import type { IQueryAll } from "#/types/api/customer.type";

function customerQueryAll(payload: IQueryAll) {
	return queryOptions({
		queryKey: ["customer", "list", payload.release],
		queryFn: () => customerApi.get(payload),
	});
}

function customerQueryById(id: string) {
	return queryOptions({
		queryKey: ["customer", id],
		queryFn: () => customerApi.getById(id),
	});
}

export { customerQueryAll, customerQueryById };
