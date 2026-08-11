import { cn } from "#/lib/utils";

interface ResultItemProps {
	type: "XAC" | "CO" | "TRUNG";
	prefix: string;
	content: string;
}

export function ResultItem({ type, content, prefix }: ResultItemProps) {
	const formatPrefix = (str: string) => {
		let formatted = str.toLowerCase().replace(/_/g, " ");

		formatted = formatted
			.replace(/\bda\b/g, "đá")
			.replace(/\bdau\b/g, "đầu")
			.replace(/\bduoi\b/g, "đuôi");

		return formatted.toUpperCase();
	};

	return (
		<div
			className={cn(
				"w-full font-semibold py-0.5 px-2 uppercase text-left",
				type === "XAC" && "text-amber-600",
				type === "CO" && "text-emerald-600",
				type === "TRUNG" && "text-red-600",
			)}
		>
			{formatPrefix(prefix)}: {content}
		</div>
	);
}
