import { useAppStore } from "@lavaz/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { RegionDropdown } from "#/components/base/dropdown/RegionDropdown";
import { CustomerResult } from "#/components/customer/customer-detail/CustomerResult";
import { CustomerSelectorCard } from "#/components/customer/customer-detail/CustomerSelectorCard";
import { DetailList } from "#/components/customer/customer-detail/DetailList";
import { Button } from "#/components/ui/button";
import { formatDate } from "#/lib/format-date";
import { customerQueryAll } from "#/services/customer.service";
import { orderQueryByCustomerId } from "#/services/order.service";
import { store } from "#/store/store";

export const Route = createFileRoute("/khach-hang/$customerId/")({
	staticData: { isShowBack: true },
	component: RouteComponent,
	loaderDeps: () => ({
		date: store.date.getState().date,
	}),
	loader: ({ context, params, deps }) => {
		const { customerId } = params;
		const release = formatDate(deps.date);
		return Promise.all([
			context.queryClient.prefetchQuery(
				orderQueryByCustomerId({ customerId, release }),
			),
			context.queryClient.prefetchQuery(customerQueryAll({})),
		]);
	},
});

function RouteComponent() {
	const [region] = useAppStore(store.region, (s) => s.region);
	const [date] = useAppStore(store.date, (s) => s.date);
	const { customerId } = useParams({ from: "/khach-hang/$customerId/" });
	const release = formatDate(date);

	const { data } = useSuspenseQuery(
		orderQueryByCustomerId({ customerId, release }),
	);
	const { data: customers } = useSuspenseQuery(customerQueryAll({}));

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
					<Button variant={"outline"} asChild>
						<Link to="/khach-hang/$customerId/du-chuan" params={{ customerId }}>
							Xem dư chuẩn
						</Link>
					</Button>
					<RegionDropdown />
					<Button asChild>
						<Link to="/khach-hang/$customerId/tin-nhan" params={{ customerId }}>
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

			<DetailList
				orders={data?.orders.filter((order) => order.region === region) || []}
				customer={data?.customer}
			/>
		</div>
	);
}
