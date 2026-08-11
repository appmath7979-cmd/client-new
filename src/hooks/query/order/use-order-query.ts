import { useQuery } from "@tanstack/react-query";
import { orderApi } from "#/apis/order.api";
import type { IQueryByCustomerId } from "#/types/api/order.type";

function useOrderQueryByCustomerId({
	customerId,
	release,
}: IQueryByCustomerId) {
	return useQuery({
		queryKey: ["order", customerId, release],
		queryFn: () => orderApi.get({ customerId, release }),
	});
}

export { useOrderQueryByCustomerId };
