import { useMatches } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import { BackBtn } from "./BackBtn";
import { DatePicker } from "./DatePicker";

export function Header() {
	const matches = useMatches();
	const currentName = matches[1]?.staticData?.title;
	const isShowHeader = !matches.some((s) => s.staticData?.isShowHeader);
	const isShowBack = matches.some((s) => s.staticData?.isShowBack) ?? undefined;
	return (
		<>
			{isShowHeader ? (
				<header className="sticky top-0 left-0 z-9999 bg-background/80 backdrop-blur-sm p-4 shadow-md flex justify-between items-center">
					{isShowBack ? (
						<BackBtn />
					) : (
						<Button variant={"outline"} size={"icon"}>
							<MenuIcon />
						</Button>
					)}
					<h1 className="absolute top-1/2 left-1/2 transform -translate-1/2 text-center md:text-xl font-semibold uppercase text-primary cursor-default">
						{currentName || "Toán học"}
					</h1>
					<DatePicker />
				</header>
			) : null}
		</>
	);
}
