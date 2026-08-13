import { orderApi } from "#/apis/order.api";
import type { IQueryByCustomerId, IQueryById } from "#/types/api/order.type";
import { queryOptions } from "@tanstack/react-query";

function orderQueryByCustomerId({
  customerId,
  release,
}: IQueryByCustomerId) {
  return queryOptions({
    queryKey: ["order", customerId, release],
    queryFn: () => orderApi.get({ customerId, release }),
  });
}

function orderQueryById({ customerId, orderId }: IQueryById) {
  return queryOptions({
    queryKey: ["order", customerId, orderId],
    queryFn: () => orderApi.getById({ customerId, orderId }),
  })
}

export { orderQueryByCustomerId, orderQueryById };
