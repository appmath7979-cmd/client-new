import type { IOrderItem } from "#/types/api/order.type";
import {
  CopyIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "#/components/ui/button";
import { useMemo } from "react";
import { cn } from "#/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";

export function DetailItem({
  order,
  index,
}: {
  order: IOrderItem;
  index: number;
}) {
  const total = useMemo(() => {
    const totalCo = order.details
      .map((item) => item.co)
      .reduce((item, total) => item + total, 0);
    const totalTrung = order.details
      .map((item) => item.trung)
      .reduce((item, total) => item + total, 0);

    return totalCo - totalTrung;
  }, []);

  return (
    <li
      key={order.id}
      className={cn(
        "border rounded-md p-4",
        total > 0
          ? "border-emerald-600 bg-emerald-50/10"
          : "border-red-600 bg-red-50/10",
      )}
    >
      <div className="flex justify-between items-center">
        <p className="text-xs border border-blue-600 text-blue-600 bg-blue-50 font-semibold rounded-md px-1 py-0.5 inline-flex justify-center items-center">
          Tin nhắn {index + 1}
        </p>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon-sm"}>
                <CopyIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sao chép tin nhắn</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon-sm"}>
                <PencilIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Sửa tin nhắn</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"destructive"} size={"icon-sm"}>
                <Trash2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xóa tin nhắn</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {order.message}
        </p>
        <p className="font-semibold border-t pt-2">
          {total.toLocaleString("vi-VN")}
        </p>
      </div>
    </li>
  );
}
