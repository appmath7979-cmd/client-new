import type { INavItem } from "#/data/nav.data";
import { Link } from "@tanstack/react-router";

export function NavItem({ item }: { item: INavItem }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      className="flex flex-col items-center justify-center py-2 text-muted-foreground hover:text-primary [&.active]:text-primary"
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs mt-1 font-medium">{item.label}</span>
    </Link>
  );
}
