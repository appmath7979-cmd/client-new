import type React from "react";
import { TooltipProvider } from "#/components/ui/tooltip";
import { ThemeProvider } from "./ThemeProvider";

export function AppPropvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return (
    <ThemeProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
