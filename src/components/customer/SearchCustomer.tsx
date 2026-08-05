import { SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

interface SearchCustomerProps {
	value: string;
	onChange: (val: string) => void;
}

export function SearchCustomer({ value, onChange }: SearchCustomerProps) {
	return (
		<div className="relative flex-1 max-w-sm">
			<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder="Tìm theo tên..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="pl-9 bg-background"
			/>
		</div>
	);
}
