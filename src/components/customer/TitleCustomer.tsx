import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { Button } from "../ui/button";

export function TitleCustomer() {
	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Quản lý Đối tác</h1>
				<p className="text-sm text-muted-foreground">
					Quản lý danh sách chủ hàng, khách hàng và trạng thái hoạt động.
				</p>
			</div>
			<Button className="gap-2 shadow-sm" asChild>
				<Link to="/khach-hang/them-khach-hang">
					<PlusIcon className="h-4 w-4" />
					<span>Thêm mới</span>
				</Link>
			</Button>
		</div>
	);
}
