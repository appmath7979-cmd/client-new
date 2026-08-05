import { Link } from "@tanstack/react-router";
import {
	CopyIcon,
	MoreHorizontalIcon,
	PencilIcon,
	ShieldCheckIcon,
	Trash2Icon,
	User2Icon,
	UserCheckIcon,
} from "lucide-react";
import { Badge } from "#/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { cn } from "#/lib/utils";
import { Button } from "../ui/button";

export function TableCustomer({
	customers,
	handleCopy,
	handleDelete,
}: {
	customers: {
		id: string;
		name: string;
		role: string;
		status: string;
		createdAt: string;
	}[];
	handleCopy: (val: string) => void;
	handleDelete: (id: string) => void;
}) {
	return (
		<div className="border rounded-xl bg-card shadow-sm overflow-hidden">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Họ tên</TableHead>
						<TableHead>Phân loại</TableHead>
						<TableHead className="text-right">Hành động</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{customers.length > 0 ? (
						customers.map((customer) => (
							<TableRow key={customer.id} className="hover:bg-muted/50">
								<TableCell className="font-medium">
									<Link
										to="/khach-hang/$customerId"
										params={{ customerId: customer.id }}
										className="flex items-center gap-3 w-full hover:text-primary"
									>
										<div className="relative size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
											<User2Icon className="h-5 w-5" />
											<Badge
												className={cn(
													"absolute size-3 p-0 -top-0.5 right-0.5 rounded-full",
													customer.status === "active"
														? "bg-emerald-600"
														: "bg-gray-400",
												)}
											></Badge>
										</div>
										<span className="truncate font-semibold">
											{customer.name}
										</span>
									</Link>
								</TableCell>
								<TableCell>
									{customer.role === "chu" ? (
										<Badge
											variant="default"
											className="gap-1 bg-amber-500 hover:bg-amber-600 text-white"
										>
											<ShieldCheckIcon className="size-3" /> Chủ
										</Badge>
									) : (
										<Badge variant="secondary" className="gap-1">
											<UserCheckIcon className="size-3" /> Khách
										</Badge>
									)}
								</TableCell>
								{/* Hành động (Dropdown Menu: Sao chép, Sửa, Xóa) */}
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<span className="sr-only">Mở menu</span>
												<MoreHorizontalIcon className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-40 rounded-xl"
										>
											<DropdownMenuLabel>Hành động</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleCopy(customer.name)}
												className="gap-2 cursor-pointer"
											>
												<CopyIcon className="h-4 w-4" /> Sao chép
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													alert(`Sửa khách hàng ID: ${customer.id}`)
												}
												className="gap-2 cursor-pointer"
											>
												<PencilIcon className="h-4 w-4" /> Sửa
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleDelete(customer.id)}
												className="gap-2 text-destructive focus:text-destructive cursor-pointer"
											>
												<Trash2Icon className="h-4 w-4" /> Xóa
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={4}
								className="h-24 text-center text-muted-foreground"
							>
								Không tìm thấy kết quả phù hợp.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
