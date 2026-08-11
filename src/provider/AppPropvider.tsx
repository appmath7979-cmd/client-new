import { TooltipProvider } from "#/components/ui/tooltip";
import type React from "react";

export function AppPropvider({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
