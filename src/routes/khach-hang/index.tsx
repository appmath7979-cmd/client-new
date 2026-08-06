import { useAppStore } from "@lavaz/store";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SearchCustomer } from "#/components/customer/SearchCustomer";
import { TableCustomer } from "#/components/customer/TableCustomer";
import { TitleCustomer } from "#/components/customer/TitleCustomer";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { useCustomerQueryAll } from "#/hooks/query/customer/use-customer-query";
import { formatDate } from "#/lib/format-date";
import { store } from "#/store/store";

export const Route = createFileRoute("/khach-hang/")({
	staticData: { title: "Khách hàng" },
	component: RouteComponent,
});

const MOCK_CUSTOMERS = [
	{
		id: "1",
		name: "Nguyễn Văn A",
		role: "chu",
		status: "active",
		createdAt: "2026-06-01",
	},
	{
		id: "2",
		name: "Trần Thị B",
		role: "khach",
		status: "active",
		createdAt: "2026-06-03",
	},
	{
		id: "3",
		name: "Lê Văn C",
		role: "khach",
		status: "inactive",
		createdAt: "2026-06-04",
	},
	{
		id: "4",
		name: "Phạm Văn D",
		role: "chu",
		status: "active",
		createdAt: "2026-06-05",
	},
];

function RouteComponent() {
	const [searchTerm, setSearchTerm] = useState("");
	const [activeTab, setActiveTab] = useState<string>("GUEST");

	const [date] = useAppStore(store.date, (s) => s.date);

	const { data } = useCustomerQueryAll({
		order: true,
		release: formatDate(date),
	});

	// Xử lý sao chép thông tin
	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		alert(`Đã sao chép: ${text}`);
	};

	// Xử lý xóa
	const handleDelete = (id: string) => {
		if (confirm("Bạn có chắc chắn muốn xóa đối tác này?")) {
			alert(`Đã xóa ID: ${id}`);
		}
	};

	// Lọc dữ liệu theo tên và tab
	const filteredCustomers =
		data?.customers.filter((c) => {
			const matchesSearch = c.fullName.toLowerCase().includes(searchTerm);

			if (activeTab === "GUEST") return matchesSearch && c.type === "GUEST";
			if (activeTab === "OWNER") return matchesSearch && c.type === "OWNER";
			return matchesSearch;
		}) || [];

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6 pb-24">
			<TitleCustomer />
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
				<SearchCustomer value={searchTerm} onChange={setSearchTerm} />
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className="w-full sm:w-auto"
				>
					<TabsList className="grid grid-cols-3 w-full sm:w-60">
						<TabsTrigger value="all">Tất cả</TabsTrigger>
						<TabsTrigger value="GUEST">Khách</TabsTrigger>
						<TabsTrigger value="OWNER">Chủ</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<TableCustomer
				customers={filteredCustomers}
				handleCopy={handleCopy}
				handleDelete={handleDelete}
			/>
		</div>
	);
}
