import { useRouteContext, useRouter } from "@tanstack/react-router";
import { Button } from "../ui/button";
import { setThemeServerFn, type Theme } from "#/lib/server/theme";
import { MonitorIcon, SunIcon, MoonIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useEffect } from "react";

export function ThemeMode() {
  const { theme } = useRouteContext({ from: "__root__" });
  const router = useRouter();

  function toggleTheme() {
    const themes = ["light", "dark"] as const;
    const next = themes[(themes.indexOf(theme as Theme) + 1) % themes.length];
    const root = document.documentElement;

    root.classList.remove("light", "dark");
    setThemeServerFn({ data: next }).then(() => router.invalidate());
  }

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "dark") root.classList.add("dark");
  }, [theme]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant={"outline"} size={"icon"} onClick={toggleTheme}>
          {theme === "dark" ? (
            <MoonIcon />
          ) : theme === "light" ? (
            <SunIcon />
          ) : (
            <MonitorIcon />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="z-10000!">Chế độ sáng/tối</TooltipContent>
    </Tooltip>
  );
}
