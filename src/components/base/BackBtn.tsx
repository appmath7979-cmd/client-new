import { ChevronLeftIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function BackBtn() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => window.history.back()}
        >
          <ChevronLeftIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="z-10000">Quay lại</TooltipContent>
    </Tooltip>
  );
}
