import { ArrowLeftIcon } from "lucide-react";
import { Button } from "../ui/button";

export function BackBtn() {
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={() => window.history.back()}
    >
      <ArrowLeftIcon />
    </Button>
  );
}
