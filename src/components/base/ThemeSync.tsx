import { useEffect } from "react";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { collections } from "#/lib/ui";

export function ThemeSync() {
  const { data } = useLiveQuery((q) =>
    q.from({ ui: collections }).where(({ ui }) => eq(ui.id, "ui")),
  );

  const currentPref = data?.[0];
  const currentTheme = currentPref?.theme ?? "light";

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(currentTheme);
  }, [currentTheme]);

  return null;
}
