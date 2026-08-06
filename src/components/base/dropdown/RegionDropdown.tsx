import { useAppStore } from "@lavaz/store";
import { Button } from "#/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { regions } from "#/data/region.data";
import { store } from "#/store/store";

export function RegionDropdown() {
	const [region, { setRegion }] = useAppStore(store.region, (s) => s.region);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"outline"}>
					{regions.find((r) => r.value === region)?.label || "Miền Bắc"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-37 p-1 z-9999">
				<DropdownMenuLabel className="text-[10px] text-muted-foreground uppercase px-2 py-1.5 font-semibold tracking-wider">
					danh sách các miền
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="my-1" />
				{regions.map((r) => (
					<DropdownMenuItem key={r.id} onClick={() => setRegion(r.value)}>
						{r.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
