
import type { IOrderItem } from "#/types/api/order.type";
import { DetailItem } from "./DetailItem";

export function DetailList({ orders }: { orders: Array<IOrderItem> }) {
  return (
    <div>
      <h2 className="font-semibold">Chi tiết</h2>
      <ul className="space-y-4">
        {orders.map((order, i) => (
          <DetailItem key={order.id} order={order} index={i} />
        ))}
      </ul>
    </div>
  );
}
