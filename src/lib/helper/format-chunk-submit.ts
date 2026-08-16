import { provinceList } from "#/data/provinces.data";
import type { CreateOrderDetails } from "#/types/api/order.type";
import type { Region } from "#/types/region.type";

export function formatChunkSubmit(
  checkedMessage: Array<string[]>,
  region: Region,
  availableStations: string[] = [],
): CreateOrderDetails[] {
  const regionKey = region;

  // 0. Tiền xử lý: Nếu gặp dạng 'Xd' (ví dụ 4d), nhân bản row đó lên X lần và gán stationSyntax hoặc giữ nguyên tùy ý bạn
  const expandedMessage: Array<string[]> = [];
  checkedMessage.forEach((row) => {
    if (row.length === 0) return;
    const stationSyntax = row[0].toLowerCase();
    const matchMultiStation = stationSyntax.match(/^(\d+)d$/);

    if (matchMultiStation) {
      const count = parseInt(matchMultiStation[1], 10);

      // Nếu có truyền availableStations thì lấy đúng tên đài trong đó,
      // còn nếu không truyền thì tạm thời giữ nguyên hoặc nhân bản row đó lên đúng `count` lần
      // để các bước sau xử lý hoặc map theo ý bạn muốn.
      const targetStations =
        availableStations.length > 0
          ? availableStations.slice(0, count)
          : Array(count).fill(stationSyntax); // Nhân bản lên đúng số lần đài

      targetStations.forEach((stationCode) => {
        const newRow = [...row];
        newRow[0] = stationCode;
        expandedMessage.push(newRow);
      });
    } else {
      expandedMessage.push(row);
    }
  });

  // 1. Tạo Lookup Map dịch đài từ syntax sang code
  const syntaxToCodeMap = new Map<string, string>();
  provinceList.forEach((p) => {
    const mapKey = `${p.syntax.toLowerCase()}-${p.region}`;
    syntaxToCodeMap.set(mapKey, p.code);
  });

  const detailsList: CreateOrderDetails[] = [];

  expandedMessage.forEach((row) => {
    if (row.length < 3) return;

    const stationSyntax = row[0];
    const num = row[1];

    // Trích xuất phần tử cuối cùng làm tiền (actionValue), các phần tử ở giữa là actionType
    const actionValue = row[row.length - 1];
    let rawActionType = row
      .slice(2, row.length - 1)
      .join("")
      .toLowerCase();

    // Nếu không tách được ở giữa, fallback về cách lấy thông thường
    if (!rawActionType && row.length >= 3) {
      rawActionType = row[2].toLowerCase();
    }

    // Xử lý loại bỏ chữ 'n' hoặc 'N' ở cuối actionType (nếu có)
    if (/[a-zA-Z0-9.]+?[nN]$/.test(rawActionType)) {
      rawActionType = rawActionType.replace(/[nN]$/, "");
    }

    const money = parseFloat(actionValue) || 0;

    // Xử lý trường hợp actionType dính liền số thập phân kiểu b0.5, dau0.5...
    let actionType = rawActionType;
    let explicitMoney: number | null = null;

    const matchActionWithDecimal = rawActionType.match(/^([a-zA-Z]+)(\d+\.5)$/);
    if (matchActionWithDecimal) {
      actionType = matchActionWithDecimal[1];
      explicitMoney = parseFloat(matchActionWithDecimal[2]);
    }

    let finalMoney =
      explicitMoney !== null && explicitMoney > 0 ? explicitMoney : money;

    // Quy tắc: Nếu là Miền Bắc (MB) và loại cược là "dau", nhân thêm 4
    if (regionKey.toUpperCase() === "MB" && actionType === "dau") {
      finalMoney *= 4;
    }

    // 2. Chuyển đổi tên đài sang mã code viết hoa
    let stationCodeKey = stationSyntax;
    if (stationSyntax.includes("-")) {
      stationCodeKey = stationSyntax
        .split("-")
        .map(
          (syntax) =>
            syntaxToCodeMap.get(`${syntax.toLowerCase()}-${regionKey}`) ||
            syntax.toUpperCase(),
        )
        .join("-");
    } else {
      stationCodeKey =
        syntaxToCodeMap.get(`${stationSyntax.toLowerCase()}-${regionKey}`) ||
        stationSyntax.toUpperCase();
    }

    // 3. Phân định syntax theo cấu trúc số càng
    const cleanNumForLength = num.replace(/\.5/g, "");
    const digitCount = cleanNumForLength.includes("-")
      ? cleanNumForLength.split("-")[0].length
      : cleanNumForLength.length;
    let dbSyntax = `${digitCount}c`;

    if (/^b\d+$/.test(actionType)) {
      dbSyntax = `${actionType.replace("b", "")}c`;
    }

    // 4. Phân định type chính xác theo loại cược cốt lõi
    let dbType = actionType;
    if (
      actionType === "b" ||
      actionType === "bd" ||
      /^b\d+$/.test(actionType)
    ) {
      dbType = "bao";
    }

    detailsList.push({
      syntax: dbSyntax,
      stationCode: stationCodeKey,
      number: num,
      type: dbType,
      xac: finalMoney,
    });
  });

  // 5. Gom tổng tiền tích lũy theo xac nếu trùng lặp bộ cược
  const aggregatedMap = new Map<string, CreateOrderDetails>();

  detailsList.forEach((item) => {
    const uniqueKey = `${item.stationCode}_${item.number}_${item.type}_${item.syntax}`;
    const existing = aggregatedMap.get(uniqueKey);

    if (existing) {
      existing.xac += item.xac;
    } else {
      aggregatedMap.set(uniqueKey, { ...item });
    }
  });

  return Array.from(aggregatedMap.values());
}
