import { useAppStore } from "@lavaz/store";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { RegionDropdown } from "#/components/base/dropdown/RegionDropdown";
import { CustomerSelectorCard } from "#/components/customer/customer-detail/CustomerSelectorCard";
import { Button } from "#/components/ui/button";
import { useOrderQueryByCustomerId } from "#/hooks/query/order/use-order-query";
import { formatDate } from "#/lib/format-date";
import { store } from "#/store/store";

export const Route = createFileRoute("/khach-hang/$customerId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [date] = useAppStore(store.date, (s) => s.date);
  const { customerId } = useParams({ from: "/khach-hang/$customerId/" });
  const { data } = useOrderQueryByCustomerId({
    customerId,
    release: formatDate(date),
  });

  console.log(data);

  return (
    <div className="py-4">
      <div className="space-y-2 sticky top-21 z-999">
        <CustomerSelectorCard
          src="https://api.dicebear.com/10.x/micah/svg"
          alt="customer-avatar"
          name={data?.customer?.fullName ?? ""}
          type={data?.customer?.type}
        />
        <div className="flex justify-end items-center gap-4">
          <RegionDropdown />
          <Button asChild>
            <Link
              to="/khach-hang/$customerId/tin-nhan"
              params={{ customerId: "1" }}
            >
              <PlusIcon />
              <span>Thêm tin nhắn</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
