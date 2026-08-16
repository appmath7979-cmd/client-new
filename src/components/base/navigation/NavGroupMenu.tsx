import { Link } from "@tanstack/react-router";
import { LayersIcon } from "lucide-react";
import { useState } from "react";
import type { INavItem } from "#/data/nav.data";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"; 

export function NavGroupMenu({ items }: { items: INavItem[] }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative -mt-6">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						className="flex flex-col items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg border-4 border-background transition-transform active:scale-95 focus:outline-none"
						title="Mở rộng"
					>
						<LayersIcon className="h-6 w-6" />
					</button>
				</PopoverTrigger>
				<PopoverContent
					side="top"
					align="center"
					className="w-48 p-2 rounded-2xl shadow-xl border-border bg-popover mb-2"
				>
					<div className="flex flex-col gap-1">
						{items.map((subItem) => {
							const SubIcon = subItem.icon;
							return (
								<Link
									key={subItem.id}
									to={subItem.href}
									onClick={() => setOpen(false)}
									className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground [&.active]:bg-primary/10 [&.active]:text-primary capitalize"
								>
									<SubIcon className="h-4 w-4" />
									<span>{subItem.label}</span>
								</Link>
							);
						})}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
