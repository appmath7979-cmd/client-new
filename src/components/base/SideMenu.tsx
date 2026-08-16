import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import { ThemeMode } from "./ThemeMode";

export function SideMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size={"icon"}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="z-10000">
        <SheetHeader>
          <SheetTitle className="text-lg text-primary uppercase">
            TOÁN HỌC
          </SheetTitle>
          <SheetDescription>Con đường xây dựng những giấc mơ</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <ThemeMode />
        </div>
      </SheetContent>
    </Sheet>
  );
}
