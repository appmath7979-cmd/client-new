import type { ICustomerWithOrder, IOrderItem } from "#/types/api/order.type";
import { DetailItem } from "./DetailItem";

export function DetailList({
	orders,
	customer,
}: {
	orders: Array<IOrderItem>;
	customer: ICustomerWithOrder | undefined;
}) {
	return (
		<div>
			<h2 className="font-semibold">Chi tiết</h2>
			<ul className="space-y-4">
				{orders.map((order, i) => (
					<DetailItem
						key={order.id}
						order={order}
						index={i}
						isGuest={customer?.type === "GUEST"}
						customerId={order.customerId ?? ""}
					/>
				))}
			</ul>
		</div>
	);
}
