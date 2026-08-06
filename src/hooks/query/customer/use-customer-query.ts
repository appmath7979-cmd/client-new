import { useQuery } from "@tanstack/react-query";
import { customerApi } from "#/apis/customer.api";
import type { IQueryAll } from "#/types/api/customer.type";

function useCustomerQueryAll(payload: IQueryAll) {
	return useQuery({
		queryKey: ["customer", "list", payload.release],
		queryFn: () => customerApi.get(payload),
	});
}

function useCustomerQueryById(id: string) {
	return useQuery({
		queryKey: ["customer", id],
		queryFn: () => customerApi.getById(id),
	});
}

export { useCustomerQueryAll, useCustomerQueryById };
