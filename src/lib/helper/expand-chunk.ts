import type { Region } from "#/types/region.type";
import type { ISchedule } from "../constant/schedule.constant";

// Hàm helper hoán vị chuỗi số và loại bỏ trùng lặp (ví dụ: 112 -> [112, 121, 211])
function getPermutations(str: string): string[] {
	const results: string[] = [];
	function permute(arr: string[], memo: string[] = []) {
		if (arr.length === 0) {
			results.push(memo.join(""));
			return;
		}
		const seen = new Set<string>();
		for (let i = 0; i < arr.length; i++) {
			if (seen.has(arr[i])) continue;
			seen.add(arr[i]);
			const current = arr.splice(i, 1);
			permute([...arr], memo.concat(current));
			arr.splice(i, 0, current[0]);
		}
	}
	permute(str.split(""));
	return Array.from(new Set(results));
}

export function expandChunks(
	chunks: Array<string[]>,
	rewardSchedule: ISchedule,
	region: Region,
): Array<string[]> {
	return chunks.flatMap((subArray: string[]) => {
		const stations: string[] = [];
		let numbers: string[] = [];
		const actionTypes: Array<{ type: string; value: string }> = [];

		const rawNumbers: string[] = [];
		let hasKéo = false;
		let has3D = false;
		let hasBaoĐảo = false;
		let multiStationCount: number | null = null; // Biến lưu số lượng đài khi gặp 2d, 3d, 4d...

		// Bước 1: Phân loại dữ liệu từ mảng con (vẫn bắt được .5 sau cú pháp như b0.5, da0.5...)
		subArray.forEach((item) => {
			const match = item.match(/^([a-zA-ZÀ-ỹ]+)(\d+(?:\.\d+)?)$/i);

			if (match) {
				let charPart = match[1].toLowerCase();
				const numPart = match[2];

				// TỰ ĐỘNG XÓA CHỮ 'n' HOẶC 'N' Ở CUỐI CỦA TỪ KHÓA
				if (/[a-zA-ZÀ-ỹ]+[nN]$/.test(charPart) && !/^n+$/.test(charPart)) {
					charPart = charPart.replace(/[nN]$/, "");
				}

				if (charPart === "bd") {
					hasBaoĐảo = true;
				}

				if (charPart === "xc") {
					actionTypes.push(
						{ type: "xdau", value: numPart },
						{ type: "xduoi", value: numPart },
					);
				} else if (charPart === "dd") {
					actionTypes.push(
						{ type: "dau", value: numPart },
						{ type: "duoi", value: numPart },
					);
				} else {
					actionTypes.push({ type: charPart, value: numPart });
				}
			} else if (/^\d+(?:\.\d+)?$/.test(item)) {
				rawNumbers.push(item);
			} else if (item.toLowerCase() === "k") {
				hasKéo = true;
			} else if (item.toLowerCase() === "3d") {
				has3D = true;
			} else {
				const normalizedItem = item.toLowerCase();
				// Kiểm tra nếu gặp từ khóa dạng số + 'd' (ví dụ: 2d, 3d, 4d...)
				const matchMultiStation = normalizedItem.match(/^(\d+)d$/);
				if (matchMultiStation) {
					multiStationCount = parseInt(matchMultiStation[1], 10);
				} else {
					if (!stations.includes(normalizedItem)) {
						stations.push(normalizedItem);
					}
				}
			}
		});

		// Bước 1.1: Nếu gặp từ khóa dạng 'Xd' (như 2d, 4d...), tự động lấy số lượng đài tương ứng từ lịch mở thưởng của vùng
		if (multiStationCount !== null) {
			const regionKey = region.toUpperCase() as "MN" | "MT" | "MB";
			const openProvinces = rewardSchedule[regionKey] || [];
			const scheduledStations = openProvinces
				.map((p) => p?.syntax?.toLowerCase())
				.filter(Boolean) as string[];

			// Lấy đúng số lượng đài từ lịch (ví dụ 4d thì lấy 4 đài đầu tiên)
			const targetStations = scheduledStations.slice(0, multiStationCount);
			targetStations.forEach((st) => {
				if (!stations.includes(st)) stations.push(st);
			});
		}

		// Bước 1.2: Xử lý khi gặp từ khóa "3d" dựa vào rewardSchedule và region thực tế (nếu nhập riêng lẻ chữ 3d)
		if (has3D) {
			const regionKey = region.toUpperCase() as "MN" | "MT" | "MB";
			const openProvinces = rewardSchedule[regionKey] || [];
			const scheduledStations = openProvinces
				.map((p) => p?.syntax?.toLowerCase())
				.filter(Boolean) as string[];

			scheduledStations.forEach((st) => {
				if (!stations.includes(st)) stations.push(st);
			});
		}

		// Bước 2: Xử lý Kéo (k) - Bước nhảy i += 1 (số nguyên thuần túy, không kéo số thập phân .5)
		if (hasKéo && rawNumbers.length >= 2) {
			const startNum = parseInt(rawNumbers[0], 10);
			const endNum = parseInt(rawNumbers[1], 10);
			const padLength = rawNumbers[0].length; // Giữ nguyên định dạng số gốc (ví dụ: 01 -> 02 -> 03)

			for (let i = startNum; i <= endNum; i += 1) {
				const formattedNum = String(i).padStart(padLength, "0");
				numbers.push(formattedNum);
			}
		} else {
			numbers = rawNumbers;
		}

		// XỬ LÝ ĐẢO SỐ: Nếu phát hiện có phím bd trong cụm, thực hiện hoán vị danh sách số
		if (hasBaoĐảo) {
			numbers = Array.from(
				new Set(numbers.flatMap((num) => getPermutations(num))),
			);
		}

		// Bước 3: Tạo tổ hợp kết quả trả về đúng kiểu Array<string[]>
		const combinations: Array<string[]> = [];

		if (stations.length > 0 && numbers.length > 0 && actionTypes.length > 0) {
			actionTypes.forEach((action) => {
				// TRƯỜNG HỢP 1: ĐÁ XIÊN (dax) -> Cặp đài chập 2 x Cặp số chập 2
				if (action.type === "dax") {
					if (stations.length >= 2 && numbers.length >= 2) {
						for (let s1 = 0; s1 < stations.length; s1++) {
							for (let s2 = s1 + 1; s2 < stations.length; s2++) {
								const pairedStation = `${stations[s1]}-${stations[s2]}`;
								for (let n1 = 0; n1 < numbers.length; n1++) {
									for (let n2 = n1 + 1; n2 < numbers.length; n2++) {
										const pairedNumber = `${numbers[n1]}-${numbers[n2]}`;
										combinations.push([
											pairedStation,
											pairedNumber,
											action.type,
											action.value,
										]);
									}
								}
							}
						}
					}
				}
				// TRƯỜNG HỢP 2: ĐÁ THƯỜNG (da) -> Đài đơn x Cặp số chập 2
				else if (action.type === "da") {
					if (numbers.length >= 2) {
						stations.forEach((station) => {
							for (let i = 0; i < numbers.length; i++) {
								for (let j = i + 1; j < numbers.length; j++) {
									const pairedNumber = `${numbers[i]}-${numbers[j]}`;
									combinations.push([
										station,
										pairedNumber,
										action.type,
										action.value,
									]);
								}
							}
						});
					}
				}
				// TRƯỜNG HỢP 3: Các kiểu chơi thông thường (b, xc, dd...)
				else {
					stations.forEach((station) => {
						numbers.forEach((num) => {
							combinations.push([station, num, action.type, action.value]);
						});
					});
				}
			});

			// LỌC TRÙNG LẶP: Loại bỏ hoàn toàn các dòng trùng nhau trước khi return
			const uniqueMap = new Map<string, string[]>();
			combinations.forEach((item) => {
				const key = JSON.stringify(item);
				if (!uniqueMap.has(key)) {
					uniqueMap.set(key, item);
				}
			});

			return Array.from(uniqueMap.values());
		}

		return [subArray];
	});
}
