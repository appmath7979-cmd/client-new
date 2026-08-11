import { useAppStore } from "@lavaz/store";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { RegionDropdown } from "#/components/base/dropdown/RegionDropdown";
import { CustomerResult } from "#/components/customer/customer-detail/CustomerResult";
import { CustomerSelectorCard } from "#/components/customer/customer-detail/CustomerSelectorCard";
import { Button } from "#/components/ui/button";
import { useCustomerQueryAll } from "#/hooks/query/customer/use-customer-query";
import { useOrderQueryByCustomerId } from "#/hooks/query/order/use-order-query";
import { formatDate } from "#/lib/format-date";
import { store } from "#/store/store";

export const Route = createFileRoute("/khach-hang/$customerId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [region] = useAppStore(store.region, (s) => s.region);
  const [date] = useAppStore(store.date, (s) => s.date);
  const { customerId } = useParams({ from: "/khach-hang/$customerId/" });
  const { data } = useOrderQueryByCustomerId({
    customerId,
    release: formatDate(date),
  });
  const { data: customers } = useCustomerQueryAll({});
  const filterCustomers =
    customers?.customers.filter(
      (customer) => customer.id !== customerId && customer.type !== "OWNER",
    ) || [];

  return (
    <div className="py-4 space-y-4">
      <div className="space-y-2 sticky top-21 z-999">
        <CustomerSelectorCard
          src="https://api.dicebear.com/10.x/micah/svg"
          alt="customer-avatar"
          name={data?.customer?.fullName ?? ""}
          type={data?.customer?.type}
          customers={filterCustomers}
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
      <div className="border rounded-md">
        <CustomerResult
          orders={
            data?.orders
              ?.filter((item) => item.region === region)
              .flatMap((item) => item.details) || []
          }
          customer={data?.customer}
          region={region}
        />
      </div>
      <div>
        
      </div>
    </div>
  );
}
