import { useAppStore } from "@lavaz/store";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { SaveIcon } from "lucide-react";
import { useState } from "react";
import { RegionDropdown } from "#/components/base/dropdown/RegionDropdown";
import { CustomerLayoff } from "#/components/customer/layoff/CustomerLayoff";
import { CustomerStandard } from "#/components/customer/layoff/CustomerStandard";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { getStandardPersonal } from "#/services/standar-personal.service";
import { store } from "#/store/store";

export const Route = createFileRoute("/khach-hang/$customerId/du-chuan")({
	staticData: { isShowBack: true, title: "Xử lý dư chuẩn cá nhân" },
	component: RouteComponent,
	loader: ({ context, params }) =>
		context.queryClient.prefetchQuery(
			getStandardPersonal({ customerId: params.customerId }),
		),
});

function RouteComponent() {
	const { customerId } = useParams({
		from: "/khach-hang/$customerId/du-chuan",
	});

	const [date] = useAppStore(store.date, (s) => s.date);

	const [isSetting, setIsSetting] = useState<boolean>(false);

	return (
		<div className="pt-4 pb-20 space-y-8">
			<div className="p-4 flex justify-end gap-2 items-center border rounded-md">
				<RegionDropdown />
				{isSetting && (
					<Button>
						<SaveIcon />
						<span>Lưu cài đặt</span>
					</Button>
				)}
			</div>
			<Tabs defaultValue={"du-chuan"}>
				<TabsList className="w-full">
					<TabsTrigger value="du-chuan" onClick={() => setIsSetting(false)}>
						Dư chuẩn
					</TabsTrigger>
					<TabsTrigger value="cai-dat" onClick={() => setIsSetting(true)}>
						Cài đặt dư chuẩn
					</TabsTrigger>
				</TabsList>
				<TabsContent value="du-chuan">
					<CustomerLayoff customerId={customerId} />
				</TabsContent>
				<TabsContent value="cai-dat">
					<CustomerStandard day={date.getDay()} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
