import { queryOptions } from "@tanstack/react-query";
import { getStandardPersonalApi } from "#/apis/standard-personal.api";
import type { IStandardPerQuery } from "#/types/api/standard-personal.type";

function getStandardPersonal({ customerId, day }: IStandardPerQuery) {
	return queryOptions({
		queryKey: ["standard-personal", customerId, day ?? 0],
		queryFn: () => getStandardPersonalApi({ customerId, day }),
	});
}

export { getStandardPersonal };
