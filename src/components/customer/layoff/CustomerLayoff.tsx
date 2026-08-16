import { useAppStore } from "@lavaz/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { formatDate } from "#/lib/format-date";
import { orderQueryByCustomerId } from "#/services/order.service";
import { store } from "#/store/store";

export function CustomerLayoff({ customerId }: { customerId: string }) {
	const [date] = useAppStore(store.date, (s) => s.date);
	const release = formatDate(date);
	const { data } = useSuspenseQuery(
		orderQueryByCustomerId({ customerId, release }),
	);

	const orders = useMemo(() => {
		if (!data.orders) return [];
		const { orders } = data;
		return orders.filter((order) => !order.isLayoff);
	}, [data.orders]);

	return <div className="h-115 overflow-hidden">{JSON.stringify(orders)}</div>;
}
