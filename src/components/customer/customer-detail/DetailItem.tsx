import type { IOrderItem } from "#/types/api/order.type";
import { CopyIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "#/components/ui/button";
import { useMemo } from "react";
import { cn } from "#/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip";
import { Link } from "@tanstack/react-router";

export function DetailItem({
  order,
  index,
  isGuest,
  customerId,
}: {
  order: IOrderItem;
  index: number;
  isGuest: boolean | undefined;
  customerId: string;
}) {
  const total = useMemo(() => {
    if (isGuest === undefined) return 0;

    const totalCo = order.details
      .map((item) => item.co)
      .reduce((item, total) => item + total, 0);
    const totalTrung = order.details
      .map((item) => item.trung)
      .reduce((item, total) => item + total, 0);

    return isGuest ? totalCo - totalTrung : totalTrung - totalCo;
  }, []);

  return (
    <li
      key={order.id}
      className={cn(
        "border rounded-md p-4",
        total > 0 && "border-emerald-600 bg-emerald-200/10",
        total < 0 && "border-red-600 bg-red-200/10",
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
      <Link
        to="/khach-hang/$customerId/$orderId/chi-tiet"
        params={{ customerId, orderId: order.id }}
      >
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {order.message}
          </p>
          <p
            className={cn(
              "font-semibold border-t pt-2 flex items-center gap-1",
              total > 0 && "text-emerald-600",
              total < 0 && "text-red-600",
            )}
          >
            <span className="font-semibold text-muted-foreground uppercase text-xs">
              Tổng {total >= 0 ? "thu" : "chi"}
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-md",
                total > 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
              )}
            >
              {total.toLocaleString("vi-VN")}
            </span>
          </p>
        </div>
      </Link>
    </li>
  );
}
