import { standardSchedule } from "#/lib/helper/get-standard";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getStandardPersonal } from "#/services/standar-personal.service";
import { useAppStore } from "@lavaz/store";
import { store } from "#/store/store";
import { useEffect, useMemo } from "react";
import { CardCustomerStandard } from "./standard/CardCustomerStandard";

export function CustomerStandard({
  day,
  customerId,
}: {
  day: number;
  customerId: string;
}) {
  const { data } = useSuspenseQuery(getStandardPersonal({ customerId, day }));
  const dailyStandard = standardSchedule[day];

  const [{ items }, { setAll }] = useAppStore(
    store.standardPersonal,
    (s) => s,
  );

  // ĐÃ SỬA: Thêm items vào dependency để mỗi khi store đổi, useMemo tự động chạy lại
  const { standardMB, standardMN, standardMT } = useMemo(() => {
    const standardMB = items.filter((item) => item.region === "MB");
    const standardMT = items.filter((item) => item.region === "MT");
    const standardMN = items.filter((item) => item.region === "MN");

    return { standardMB, standardMT, standardMN };
  }, [items]);

  useEffect(() => {
    const defaultTemplateItems = [
      ...dailyStandard.MB,
      ...dailyStandard.MT,
      ...dailyStandard.MN,
    ].map((item, index) => ({
      ...item,
      id: `${item.region}-${item.stationCode}-${item.type}-${index}`,
      customerId,
      value: 0,
      day,
      isChange: false,
    }));

    if (data.standards.length === 0) {
      setAll({
        items: defaultTemplateItems,
        canSubmit: false,
      });
    } else {
      const mergedItems = defaultTemplateItems.map((templateItem) => {
        const foundServerItem = data.standards.find(
          (s: any) =>
            s.region === templateItem.region &&
            s.stationCode === templateItem.stationCode &&
            s.type === templateItem.type &&
            s.syntax === templateItem.syntax,
        );

        return {
          ...templateItem,
          id: foundServerItem?.id ?? templateItem.id,
          value: foundServerItem ? foundServerItem.value : 0,
          customerId: customerId,
          isChange: false,
        };
      });

      setAll({
        items: mergedItems,
        canSubmit: false,
      });
    }
  }, [day, customerId, data]);

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <CardCustomerStandard title="Miền Bắc" items={standardMB} />
      <CardCustomerStandard title="Miền Trung" items={standardMT} />
      <CardCustomerStandard title="Miền Nam" items={standardMN} />
    </div>
  );
}
