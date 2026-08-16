import { ArrowDownRight, ArrowUpRight } from "lucide-react"; // Đảm bảo bạn có thư viện lucide-react hoặc thay bằng icon tùy ý
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils";
import type {
	ICustomerWithOrder,
	IOrderDetailItem,
} from "#/types/api/order.type";
import type { Region } from "#/types/region.type";
import { ResultItem } from "./ResultItem";

interface IGroupedSyntax {
	typeKey: string;
	tongXac: number;
	tongCo: number;
	tongTrung: number;
	tongSoConTrung: number;
}

export function CustomerResult({
	orders,
	customer,
	region,
}: {
	orders: Array<IOrderDetailItem>;
	customer: ICustomerWithOrder | undefined;
	region: Region;
}) {
	const customerSettings = customer?.settings || [];

	const groupedSyntaxes: Record<string, IGroupedSyntax> = {};

	let totalXacRegion = 0;
	let totalCoRegion = 0;
	let totalTrungRegion = 0;

	orders.forEach((order) => {
		const hasSyntaxPrefix =
			order.syntax && order.type && !order.type.includes(order.syntax);

		const typeKey = hasSyntaxPrefix
			? `${order.syntax}_${order.type}`
			: order.type || order.syntax || "KHAC";

		if (!groupedSyntaxes[typeKey]) {
			groupedSyntaxes[typeKey] = {
				typeKey,
				tongXac: 0,
				tongCo: 0,
				tongTrung: 0,
				tongSoConTrung: 0,
			};
		}

		const xac = Number(order.xac ?? 0);
		const co = Number(order.co ?? 0);
		const trung = Number(order.trung ?? 0);

		const lowerType = typeKey.toLowerCase();
		let settingName = lowerType;
		if (lowerType.includes("4c_bao") || lowerType === "4c") settingName = "b4";
		else if (lowerType.includes("3c_bao") || lowerType === "3c")
			settingName = "b3";
		else if (
			lowerType.includes("2c_bao") ||
			lowerType === "2c" ||
			lowerType.includes("bao")
		)
			settingName = "b2";
		else if (lowerType.includes("xdau") || lowerType === "dau")
			settingName = "dd2";
		else if (lowerType.includes("xduoi") || lowerType === "duoi")
			settingName = "dd2";
		else if (lowerType.includes("da") && !lowerType.includes("dax"))
			settingName = "da";
		else if (lowerType.includes("dax")) settingName = "dax";

		const setting =
			customerSettings.find((s) => s.name === settingName) ||
			customerSettings.find((s) => s.name === lowerType);

		const winValue =
			setting && setting.t && setting.t[region] !== undefined
				? Number(setting.t[region])
				: 0;

		const isDaType =
			lowerType === "da" ||
			(lowerType.endsWith("da") &&
				!lowerType.includes("dax") &&
				!lowerType.includes("xdau"));

		let calculatedConTrung = 0;
		if (trung > 0) {
			if (isDaType) {
				if (winValue > 0) {
					const rawDiv = trung / winValue;
					calculatedConTrung = rawDiv;
				} else {
					calculatedConTrung = 0;
				}
			} else {
				calculatedConTrung = winValue > 0 ? trung / winValue : 0;
			}
		}

		groupedSyntaxes[typeKey].tongXac += xac;
		groupedSyntaxes[typeKey].tongCo += co;
		groupedSyntaxes[typeKey].tongTrung += trung;
		groupedSyntaxes[typeKey].tongSoConTrung += calculatedConTrung;
	});

	const finalGroupedList = Object.values(groupedSyntaxes);

	finalGroupedList.forEach((item) => {
		totalXacRegion += item.tongXac;
		totalCoRegion += item.tongCo;
		totalTrungRegion += item.tongTrung;
	});

	const diffValue = totalCoRegion - totalTrungRegion;
	const isOwner = customer?.type === "OWNER";
	const isThu = isOwner ? diffValue < 0 : diffValue >= 0;

	return (
		<div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
			<Table>
				<TableHeader className="bg-muted/40">
					<TableRow className="[&_th]:h-10 [&_th]:text-center [&_th]:font-semibold [&_th]:text-muted-foreground [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-xs">
						<TableHead>Xác</TableHead>
						<TableHead>Cò</TableHead>
						<TableHead>Trúng</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="divide-y divide-border/40">
					{finalGroupedList.length > 0 ? (
						finalGroupedList.map((groupedItem, index) => {
							const prefixLabel = groupedItem.typeKey.toLowerCase();

							const formattedConTrung = Number.isInteger(
								groupedItem.tongSoConTrung,
							)
								? groupedItem.tongSoConTrung.toString()
								: groupedItem.tongSoConTrung.toFixed(1);

							const trungContent =
								groupedItem.tongTrung > 0 && groupedItem.tongSoConTrung > 0
									? `${formattedConTrung} = ${groupedItem.tongTrung.toLocaleString("vi-VN")}`
									: groupedItem.tongTrung.toLocaleString("vi-VN");

							return (
								<TableRow
									key={groupedItem.typeKey}
									className={cn(
										"transition-colors hover:bg-muted/30 [&_td]:py-0.5 [&_td]:text-center [&_td]:text-sm",
										index % 2 !== 0 && "bg-muted/10",
									)}
								>
									<TableCell>
										<ResultItem
											type="XAC"
											prefix={prefixLabel}
											content={groupedItem.tongXac.toLocaleString("vi-VN")}
										/>
									</TableCell>
									<TableCell className="border-x">
										<ResultItem
											type="CO"
											prefix={prefixLabel}
											content={groupedItem.tongCo.toLocaleString("vi-VN")}
										/>
									</TableCell>
									<TableCell>
										<ResultItem
											type="TRUNG"
											prefix={prefixLabel}
											content={trungContent}
										/>
									</TableCell>
								</TableRow>
							);
						})
					) : (
						<TableRow>
							<TableCell
								colSpan={3}
								className="h-24 text-center text-muted-foreground"
							>
								Chưa có dữ liệu giao dịch
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				<TableFooter className="bg-transparent border-t border-border/80">
					<TableRow className="[&_td]:text-center [&_td]:font-semibold [&_td]:text-base">
						<TableCell className="text-amber-600">
							{totalXacRegion.toLocaleString("vi-VN")}
						</TableCell>
						<TableCell className="text-emerald-600">
							{totalCoRegion.toLocaleString("vi-VN")}
						</TableCell>
						<TableCell className="text-red-600">
							{totalTrungRegion.toLocaleString("vi-VN")}
						</TableCell>
					</TableRow>
					<TableRow className="hover:bg-transparent">
						<TableCell colSpan={3} className="p-3 text-center">
							<div className="flex items-center justify-center gap-2">
								<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
									{isThu ? "Tổng Thu" : "Tổng Chi"}
								</span>
								<div
									className={cn(
										"inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-bold shadow-xs",
										isThu
											? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
											: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
									)}
								>
									{isThu ? (
										<ArrowUpRight className="h-4 w-4" />
									) : (
										<ArrowDownRight className="h-4 w-4" />
									)}
									{Math.abs(diffValue).toLocaleString("vi-VN")} đ
								</div>
							</div>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
}
