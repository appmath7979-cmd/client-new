import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import type { StandardPerItem } from "#/types/api/standard-personal.type";
import { useMemo, useState } from "react";
import { CustomerStandardInput } from "./CustomerStandardInput";

export function CardCustomerStandard({
  title,
  items,
}: {
  title: string;
  items: Array<
    StandardPerItem & {
      id: string;
      value: number;
      customerId: string;
      isChange: boolean;
    }
  >;
}) {
  // 1. Gom nhóm cấp 1 theo `syntax` (ví dụ: 2c, 3c...)
  const groupedBySyntax = useMemo(() => {
    return (items ?? []).reduce(
      (acc, item) => {
        const syntaxKey = item.syntax;
        if (!acc[syntaxKey]) {
          acc[syntaxKey] = [];
        }
        acc[syntaxKey].push(item);
        return acc;
      },
      {} as Record<string, typeof items>,
    );
  }, [items]);

  const [batchValues, setBatchValues] = useState<
    Record<string, number | string>
  >({});
  const [batchModes, setBatchModes] = useState<Record<string, boolean>>({});

  const getKey = (syntax: string, type: string) => `${syntax}-${type}`;

  const handleBatchToggle = (
    syntax: string,
    type: string,
    checked: boolean,
  ) => {
    const key = getKey(syntax, type);
    setBatchModes((prev) => ({ ...prev, [key]: checked }));
    if (!checked) {
      setBatchValues((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleBatchInputChange = (
    syntax: string,
    type: string,
    val: string,
    subItems: typeof items,
  ) => {
    const key = getKey(syntax, type);
    const numVal = val === "" ? 0 : Number(val);
    setBatchValues((prev) => ({ ...prev, [key]: val }));

    subItems.forEach((item) => {
      item.value = numVal;
      item.isChange = true;
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="max-md:border-b-4 max-md:pb-2 md:border-l-4 border-primary md:pl-2 text-lg capitalize font-semibold max-md:w-fit mx-auto">
        {title}
      </h2>

      <div className="space-y-6">
        {Object.entries(groupedBySyntax).map(([syntaxKey, syntaxItems]) => {
          // 2. Gom nhóm cấp 2 theo `type` (bao, dau, duoi, dax...)
          const groupedByType = syntaxItems.reduce(
            (acc, item) => {
              const typeKey = item.type;
              if (!acc[typeKey]) {
                acc[typeKey] = [];
              }
              acc[typeKey].push(item);
              return acc;
            },
            {} as Record<string, typeof syntaxItems>,
          );

          return (
            <Card key={syntaxKey} className="bg-card/40 border shadow-sm">
              <CardContent className="p-4 space-y-4">
                {/* Tiêu đề Cú pháp */}
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold uppercase text-primary text-sm tracking-wider">
                    Cú pháp: {syntaxKey}
                  </span>
                </div>

                <div className="space-y-4">
                  {Object.entries(groupedByType).map(([typeKey, typeItems]) => {
                    if (!typeItems || typeItems.length === 0) return null;

                    const batchKey = getKey(syntaxKey, typeKey);
                    const isBatchActive = batchModes[batchKey] ?? false;
                    const batchVal = batchValues[batchKey] ?? "";

                    return (
                      <div key={typeKey} className="space-y-2">
                        {/* Thanh tiêu đề loại và Set toàn bộ */}
                        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                          <span className="font-semibold uppercase text-xs tracking-wide text-muted-foreground">
                            Loại:{" "}
                            <span className="text-foreground">{typeKey}</span>
                          </span>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`switch-${batchKey}`}
                                checked={isBatchActive}
                                onCheckedChange={(checked) =>
                                  handleBatchToggle(syntaxKey, typeKey, checked)
                                }
                                className="scale-90"
                              />
                              <label
                                htmlFor={`switch-${batchKey}`}
                                className="text-xs font-medium cursor-pointer text-muted-foreground select-none"
                              >
                                Set toàn bộ
                              </label>
                            </div>

                            {isBatchActive && (
                              <Input
                                type="number"
                                value={batchVal}
                                onChange={(e) =>
                                  handleBatchInputChange(
                                    syntaxKey,
                                    typeKey,
                                    e.target.value,
                                    typeItems,
                                  )
                                }
                                placeholder="Nhập chung..."
                                className="w-24 text-right h-7 text-xs"
                                autoFocus
                              />
                            )}
                          </div>
                        </div>

                        {/* Đã xóa hoàn toàn khung viền bao quanh (border), chỉ giữ lại lưới và khoảng cách gọn gàng */}
                        <div className="grid grid-cols-2 md:grid-cols-4  gap-20 bg-background/20 p-2 rounded-lg">
                          {typeItems.map((item) => (
                            <CustomerStandardInput
                              key={
                                item.id ??
                                `${item.syntax}-${item.stationCode}-${item.type}`
                              }
                              id={item.id}
                              value={item.value}
                              stationCode={item.stationCode}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
