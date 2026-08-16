import type { StandardPerItem } from "#/types/api/standard-personal.type";
import { schedule } from "../constant/schedule.constant";
import { syntaxWithType } from "../constant/syntax-type.constant";

export interface IDailyStandard {
	MB: Omit<StandardPerItem, "customerId" | "id" | "value" | "day">[];
	MT: Omit<StandardPerItem, "customerId" | "id" | "value" | "day">[];
	MN: Omit<StandardPerItem, "customerId" | "id" | "value" | "day">[];
}

// Hàm sinh tổ hợp chập 2 (để tạo các cặp đài đá xiên)
function getCombinations<T>(arr: T[]): [T, T][] {
	const result: [T, T][] = [];
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			result.push([arr[i], arr[j]]);
		}
	}
	return result;
}

export const standardSchedule: IDailyStandard[] = schedule.map((daySchedule, dayIndex) => {
	const createItems = (stations: Array<{ label: string; syntax: string }>, region: "MB" | "MT" | "MN") => {
		// 1. Lọc bỏ các đài không có syntax hợp lệ (tránh bị stationCode rỗng "")
		const validStations = (stations ?? []).filter((s) => s && s.syntax && s.syntax.trim() !== "");

		return syntaxWithType.flatMap((st) => {
			// Nếu là Miền Trung hoặc Miền Nam VÀ gặp type là "dax"
			if ((region === "MT" || region === "MN") && st.type === "dax") {
				const pairs = getCombinations(validStations);
				return pairs.map(([station1, station2]) => ({
					region,
					stationCode: `${station1.syntax}-${station2.syntax}`,
					syntax: st.syntax,
					type: st.type,
					day: dayIndex,
				}));
			}

			// Các trường hợp thông thường khác sử dụng danh sách đã lọc sạch
			return validStations.map((station) => ({
				region,
				stationCode: station.syntax,
				syntax: st.syntax,
				type: st.type,
				day: dayIndex,
			}));
		});
	};

	return {
		MB: createItems(daySchedule.MB, "MB"),
		MT: createItems(daySchedule.MT, "MT"),
		MN: createItems(daySchedule.MN, "MN"),
	};
});