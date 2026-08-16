import { eq, useLiveQuery } from "@tanstack/react-db";
import { MoonIcon, SunDimIcon } from "lucide-react";
import { collections } from "#/lib/ui";
import { cn } from "#/lib/utils";
import { Button } from "../ui/button";

export function ThemeMode() {
	const { data } = useLiveQuery((q) =>
		q.from({ pref: collections }).where(({ pref }) => eq(pref.id, "ui")),
	);

	const currentPref = data?.[0];

	const currentTheme = currentPref?.theme ?? "light";
	const isDark = currentTheme === "dark";

	const toggleTheme = () => {
		const next = currentTheme === "dark" ? "light" : "dark";
		if (currentPref)
			collections.update("ui", (darf) => {
				darf.theme = next;
			});
		else collections.insert({ id: "ui", theme: "light" });
	};

	return (
		<Button
			variant={"ghost"}
			onClick={toggleTheme}
			className={cn(isDark ? "text-blue-600" : "text-amber-600")}
		>
			{isDark ? (
				<>
					<MoonIcon />
					<span>Chế độ tối</span>
				</>
			) : (
				<>
					<SunDimIcon />
					<span>Chế độ sáng</span>
				</>
			)}
		</Button>
	);
}
