import { Link } from "@tanstack/react-router";
import { ChevronDown, UserCheck, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import type { ICustomerItem } from "#/types/api/customer.type";

interface CustomerSelectorProps {
	src?: string;
	alt?: string;
	type?: "GUEST" | "OWNER";
	name?: string;
	customers: ICustomerItem[];
}

export function CustomerSelectorCard({
	src,
	alt = "Avatar",
	type,
	name,
	customers,
}: CustomerSelectorProps) {
	const isGuest = type === "GUEST";

	return (
		<div className="group flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:border-primary/50 transition-all duration-200 shadow-2xs">
			{/* Thông tin khách hàng hiện tại */}
			<div className="flex items-center gap-3">
				<Avatar className="h-10 w-10 ring-2 ring-primary/10 transition-transform group-hover:scale-105">
					<AvatarImage src={src} alt={alt} />
					<AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
						{name ? name.charAt(0).toUpperCase() : "KH"}
					</AvatarFallback>
				</Avatar>

				<div className="space-y-0.5">
					<div className="flex items-center gap-2">
						<span
							className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
								isGuest
									? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
									: "bg-amber-500/10 text-amber-600 dark:text-amber-400"
							}`}
						>
							{isGuest ? "Khách" : "Chủ"}
						</span>
					</div>
					<h2 className="text-sm font-bold text-foreground tracking-tight line-clamp-1">
						{name}
					</h2>
				</div>
			</div>

			{/* Hành động chọn khách khác */}
			<div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 gap-2 px-3 text-xs font-medium border-border/80 hover:bg-muted/60 transition-colors"
						>
							<Users className="w-3.5 h-3.5 text-muted-foreground" />
							<span>Xem khách khác</span>
							<ChevronDown className="w-3 h-3 text-muted-foreground opacity-60" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48 p-1 z-9999">
						<DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase px-2 py-1.5 font-semibold tracking-wider">
							Danh sách khách hàng
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="my-1" />
						{customers.length > 0 ? (
							customers.map((customer) => (
								<DropdownMenuItem
									key={customer.id}
									asChild
									className="rounded-md"
								>
									<Link
										to="/khach-hang/$customerId"
										params={{ customerId: customer.id }}
										className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium"
									>
										<UserCheck className="w-3.5 h-3.5 text-primary" />
										<span>{customer.fullName}</span>
									</Link>
								</DropdownMenuItem>
							))
						) : (
							<></>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
