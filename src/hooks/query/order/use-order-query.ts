import { useQuery } from "@tanstack/react-query";
import { orderApi } from "#/apis/order.api";

function useOrderQueryByCustomerId({
	customerId,
	release,
}: {
	customerId: string;
	release: string;
}) {
	return useQuery({
		queryKey: ["order", customerId, release],
		queryFn: () => orderApi.get({ customerId, release }),
	});
}

export { useOrderQueryByCustomerId };
