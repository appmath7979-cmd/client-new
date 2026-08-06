import type { IValidateMessageResult } from "#/types/message.type";
import type { Region } from "#/types/region.type";
import type { ISchedule } from "../constant/schedule.constant";

// ==========================================
// 1. CÁC HÀM TRỢ GIÚP (HELPER FUNCTIONS)
// ==========================================

/** Kiểm tra trùng chữ liền kề dạng 'b20 b30' */
function checkDuplicateSequentialBet(word: string, nextWord?: string): boolean {
	if (!nextWord) return false;
	const currentPrefix = word
		.match(/^([\p{L}a-zA-Z]+)\d+(\.5)?[nN]?$/u)?.[1]
		?.toLowerCase();
	const nextPrefix = nextWord
		.match(/^([\p{L}a-zA-Z]+)\d+(\.5)?[nN]?$/u)?.[1]
		?.toLowerCase();
	return !!(currentPrefix && nextPrefix && currentPrefix === nextPrefix);
}

/** Kiểm tra tính đúng đắn của cụm dùng kéo chữ "k" */
function validateKInstruction(
	chunk: string[],
	currentIdx: number,
	numbers: string[],
	betPrefixes: string[],
): string | null {
	const kIndex = chunk.findIndex((w) => w.toLowerCase() === "k");
	if (kIndex === -1) return null;

	if (numbers.length !== 2) {
		return `LỖI CÚ PHÁP: Cú pháp kéo chữ "k" ở cụm ${currentIdx + 1} chỉ chấp nhận đúng 2 số (Ví dụ: 00 k 09).`;
	}

	const prev = chunk[kIndex - 1];
	const next = chunk[kIndex + 1];
	if (
		!prev ||
		!/^\d+(\.5)?$/.test(prev) ||
		!next ||
		!/^\d+(\.5)?$/.test(next)
	) {
		return `LỖI CÚ PHÁP: Chữ "k" ở cụm ${currentIdx + 1} bắt buộc phải đứng liền giữa 2 con số.`;
	}

	if (betPrefixes.includes("da") || betPrefixes.includes("dax")) {
		return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} đang dùng cú pháp kéo "k" thì không được phép sử dụng kiểu cược "da" hoặc "dax".`;
	}

	return null;
}

/**
 * Kiểm tra loại trừ lẫn nhau:
 * - Đã có dd thì KHÔNG được có dau/duoi. Có dau/duoi thì KHÔNG được có dd. (dau và duoi ĐƯỢC ĐI CHUNG)
 * - Đã có xc thì KHÔNG được có xdau/xduoi. Có xdau/xduoi thì KHÔNG được có xc. (xdau và xduoi ĐƯỢC ĐI CHUNG)
 */
function validateMutuallyExclusiveBets(
	betPrefixes: string[],
	currentIdx: number,
): string | null {
	const hasDd = betPrefixes.includes("dd");
	const hasDau = betPrefixes.includes("dau");
	const hasDuoi = betPrefixes.includes("duoi");

	if (hasDd && (hasDau || hasDuoi)) {
		return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} không cho phép phím cược "dd" đứng chung với "dau" hoặc "duoi".`;
	}

	const hasXc = betPrefixes.includes("xc");
	const hasXdau = betPrefixes.includes("xdau");
	const hasXduoi = betPrefixes.includes("xduoi");

	if (hasXc && (hasXdau || hasXduoi)) {
		return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} không cho phép phím cược "xc" đứng chung với "xdau" hoặc "xduoi".`;
	}

	return null;
}

/** Kiểm tra tính hợp lệ của độ dài số (Càng) dựa trên phím cược */
function validateDigitLengthAndPrefixes(
	numbers: string[],
	betPrefixes: string[],
	currentIdx: number,
): string | null {
	if (numbers.length === 0) return null;

	const isPureB = betPrefixes.length > 0 && betPrefixes.every((p) => p === "b");

	if (isPureB) {
		const hasInvalidLength = numbers.some(
			(num) =>
				num.replace(".5", "").length < 2 || num.replace(".5", "").length > 4,
		);
		if (hasInvalidLength) {
			return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} chứa số có độ dài không hợp lệ (Chỉ chấp nhận số từ 2 đến 4 chữ số).`;
		}
	} else {
		const firstDigitCount = numbers[0].replace(".5", "").length;
		const isSameDigitCount = numbers.every(
			(num) => num.replace(".5", "").length === firstDigitCount,
		);

		if (!isSameDigitCount) {
			return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} chứa các con số lệch càng. Kiểu viết trộn lẫn độ dài số CHỈ được áp dụng khi cụm có duy nhất cú pháp cược "b".`;
		}

		const valid2Cang = ["b", "dau", "duoi", "db", "dd", "da", "dax"];
		const valid3Cang = ["b", "xdau", "xduoi", "xc", "bd"];

		for (const prefix of betPrefixes) {
			if (firstDigitCount === 2 && !valid2Cang.includes(prefix)) {
				return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} đánh số 2 càng nhưng dùng phím cược "${prefix}" không hợp lệ.`;
			}
			if (firstDigitCount === 3 && !valid3Cang.includes(prefix)) {
				return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} đánh số 3 càng nhưng dùng phím cược "${prefix}" không hợp lệ.`;
			}
			if (firstDigitCount === 4 && prefix !== "b") {
				return `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} đánh số 4 càng thì không được phép dùng phím cược "${prefix}".`;
			}
		}
	}
	return null;
}

// ==========================================
// 2. HÀM XỬ LÝ CHÍNH
// ==========================================

export function splitMessageToChunks(
	parsedText: string,
	rewardSchedule: ISchedule,
	region: Region,
): IValidateMessageResult {
	if (!parsedText) {
		return { message: "Chưa nhập tin nhắn!", status: "error", chunks: [] };
	}

	// Tiền xử lý: Tách chữ 'n' hoặc 'N' đi liền với số điểm (VD: b5n -> b5 n, 20n -> 20 n)
	const normalizedText = parsedText.replace(/(\d+(?:\.5)?)[nN]\b/g, "$1 n");

	const todayProvincesSet = new Set(
		(rewardSchedule?.[region as keyof typeof rewardSchedule] || [])
			.filter(Boolean)
			.map((p) => p.syntax.toLowerCase()),
	);
	const totalStationsToday = todayProvincesSet.size;
	const allWords = normalizedText.split(/\s+/).filter(Boolean);

	const processedMessageChunks: string[][] = [];
	let lastValidStations: string[] = [];
	let lastValidDigitD: string | null = null;
	let currentChunk: string[] = [];

	for (let i = 0; i < allWords.length; i++) {
		const word = allWords[i];
		const nextWord = allWords[i + 1];
		currentChunk.push(word);

		if (checkDuplicateSequentialBet(word, nextWord)) {
			return {
				message: `LỖI CÚ PHÁP: Nhập trùng kiểu cược giống nhau liên tiếp "${word} ${nextWord}".`,
				status: "error",
				chunks: processedMessageChunks,
			};
		}

		// --- ĐIỀU KIỆN NGẮT CỤM ---
		const isBetSyntax = /^[\p{L}a-zA-Z]+\d+(\.5)?[nN]?$/u.test(word);
		let shouldCloseChunk = false;

		if (i === allWords.length - 1) {
			shouldCloseChunk = true;
		} else if (isBetSyntax) {
			const hasNumberBefore = currentChunk.some((w) => /^\d+(\.5)?$/.test(w));
			const isNextBet = nextWord
				? /^[\p{L}a-zA-Z]+\d+(\.5)?[nN]?$/u.test(nextWord)
				: false;

			if (!isNextBet && hasNumberBefore) {
				const currentPrefix =
					word.match(/^([\p{L}a-zA-Z]+)/u)?.[1]?.toLowerCase() || "";
				const nextPrefix = nextWord
					? nextWord.match(/^([\p{L}a-zA-Z]+)/u)?.[1]?.toLowerCase() || ""
					: "";

				const allowedPairs = [
					["dau", "duoi"],
					["duoi", "dau"],
					["xdau", "xduoi"],
					["xduoi", "xdau"],
					["dd", "dau"],
					["dau", "dd"],
					["dd", "duoi"],
					["duoi", "dd"],
					["xc", "xdau"],
					["xdau", "xc"],
					["xc", "xduoi"],
					["xduoi", "xc"],
				];

				const isAllowedToGroup = allowedPairs.some(
					([p1, p2]) => currentPrefix === p1 && nextPrefix === p2,
				);

				if (!isAllowedToGroup) {
					shouldCloseChunk = true;
				}
			}
		}

		if (!shouldCloseChunk) continue;

		// --- TIẾN HÀNH ĐÓNG CỤM VÀ XỬ LÝ LOGIC ---
		const chunkToProcess = [...currentChunk];
		currentChunk = [];
		const currentIdx = processedMessageChunks.length;

		const numbersInChunk = chunkToProcess.filter((w) => /^\d+(\.5)?$/.test(w));
		const pureTextsInChunk = chunkToProcess.filter(
			(w) => /^[\p{L}a-zA-Z]+$/u.test(w) && w.toLowerCase() !== "k",
		);
		const digitDWord = chunkToProcess.find((w) => /^\d+[dD]$/.test(w));
		const matchedProvinces = pureTextsInChunk.filter((w) =>
			todayProvincesSet.has(w.toLowerCase()),
		);

		const betWordsInChunk = chunkToProcess.filter((w) =>
			/^[\p{L}a-zA-Z]+\d+(\.5)?[nN]?$/u.test(w),
		);
		const betPrefixes = betWordsInChunk.map(
			(w) => w.match(/^([\p{L}a-zA-Z]+)/u)?.[1]?.toLowerCase() || "",
		);
		const isDaOrDax = betPrefixes.includes("da") || betPrefixes.includes("dax");

		if (betWordsInChunk.length === 0) {
			return {
				message: `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} chứa các con số lẻ loi không đi kèm cú pháp cược (Ví dụ thiếu: b20, da10...).`,
				status: "error",
				chunks: processedMessageChunks,
			};
		}

		if (new Set(numbersInChunk).size !== numbersInChunk.length) {
			return {
				message: `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} phát hiện có các con số đánh trùng lặp nhau "${numbersInChunk.join(" ")}".`,
				status: "error",
				chunks: processedMessageChunks,
			};
		}

		const errorK = validateKInstruction(
			chunkToProcess,
			currentIdx,
			numbersInChunk,
			betPrefixes,
		);
		if (errorK)
			return {
				message: errorK,
				status: "error",
				chunks: processedMessageChunks,
			};

		const errorExclusive = validateMutuallyExclusiveBets(
			betPrefixes,
			currentIdx,
		);
		if (errorExclusive)
			return {
				message: errorExclusive,
				status: "error",
				chunks: processedMessageChunks,
			};

		if (isDaOrDax) {
			const phimDa = betPrefixes.includes("dax") ? "dax" : "da";

			if (numbersInChunk.length < 2) {
				return {
					message: `LỖI CÚ PHÁP: Cú pháp "${phimDa}" tại cụm số ${currentIdx + 1} bắt buộc phải đi kèm với ít nhất 2 con số để đánh.`,
					status: "error",
					chunks: processedMessageChunks,
				};
			}

			if (phimDa === "dax") {
				const uniqueProvinces = new Set(
					matchedProvinces.map((p) => p.toLowerCase()),
				);
				if (uniqueProvinces.size !== matchedProvinces.length) {
					return {
						message: `LỖI CÚ PHÁP: Cú pháp đá xiên "dax" tại cụm số ${currentIdx + 1} phát hiện các tên đài bị nhập trùng lặp nhau.`,
						status: "error",
						chunks: processedMessageChunks,
					};
				}

				let chunkStationCount = matchedProvinces.length;
				if (chunkStationCount === 0) {
					if (digitDWord) {
						chunkStationCount = parseInt(
							digitDWord.match(/^(\d+)[dD]$/)?.[1] || "0",
							10,
						);
					} else {
						const lastValidDStr = lastValidDigitD?.match(/^(\d+)[dD]$/)?.[1];
						chunkStationCount =
							lastValidStations.length ||
							(lastValidDStr ? parseInt(lastValidDStr, 10) : 0);
					}
				}

				if (chunkStationCount < 2 || chunkStationCount > totalStationsToday) {
					return {
						message: `LỖI CÚ PHÁP: Cú pháp đá xiên "dax" tại cụm số ${currentIdx + 1} yêu cầu tối thiểu là 2 đài và tối đa bằng số đài mở thưởng hôm nay (${totalStationsToday} đài). Bạn hiện đang chạy cho ${chunkStationCount} đài.`,
						status: "error",
						chunks: processedMessageChunks,
					};
				}
			}
		}

		const errorDigit = validateDigitLengthAndPrefixes(
			numbersInChunk,
			betPrefixes,
			currentIdx,
		);
		if (errorDigit)
			return {
				message: errorDigit,
				status: "error",
				chunks: processedMessageChunks,
			};

		const invalidProvince = pureTextsInChunk.find(
			(w) => !todayProvincesSet.has(w.toLowerCase()),
		);

		if (region === "MB") {
			if (invalidProvince) {
				return {
					message: `LỖI CÚ PHÁP: Đài không đúng lịch miền Bắc: "${invalidProvince}" ở cụm số ${currentIdx + 1}.`,
					status: "error",
					chunks: processedMessageChunks,
				};
			}
			chunkToProcess.unshift("mb");
		} else {
			if (invalidProvince) {
				return {
					message: `LỖI CÚ PHÁP: Đài "${invalidProvince}" không thuộc lịch mở thưởng hôm nay của miền ${region}.`,
					status: "error",
					chunks: processedMessageChunks,
				};
			}

			if (digitDWord) {
				const matchDigits = digitDWord.match(/^(\d+)[dD]$/);
				if (matchDigits) {
					const inputDigitCount = parseInt(matchDigits[1], 10);
					if (inputDigitCount > totalStationsToday) {
						return {
							message: `LỖI CÚ PHÁP: Nhập sai phím tắt "${digitDWord}". Lịch vùng ${region} hôm nay chỉ có tối đa ${totalStationsToday} đài.`,
							status: "error",
							chunks: processedMessageChunks,
						};
					}
					if (inputDigitCount < totalStationsToday) {
						return {
							message: `LỖI CÚ PHÁP: Phím tắt "${digitDWord}" không hợp lệ. Nếu chơi ít hơn ${totalStationsToday} đài, vui lòng nhập rõ từng tên đài.`,
							status: "error",
							chunks: processedMessageChunks,
						};
					}
				}
			}

			const hasSelfStation = matchedProvinces.length > 0 || !!digitDWord;
			const hasInheritedStation =
				lastValidStations.length > 0 || !!lastValidDigitD;

			if (!hasSelfStation && (currentIdx === 0 || !hasInheritedStation)) {
				return {
					message:
						currentIdx === 0
							? `LỖI CÚ PHÁP: Cụm tin nhắn đầu tiên của miền ${region} bắt buộc phải có tên đài hoặc phím tắt hợp lệ (Ví dụ: tp hoặc ${totalStationsToday}d).`
							: `LỖI CÚ PHÁP: Cụm số ${currentIdx + 1} của miền ${region} không tìm thấy đài chữ hoặc phím tắt hợp lệ để kế thừa.`,
					status: "error",
					chunks: processedMessageChunks,
				};
			}

			if (matchedProvinces.length > 0) {
				lastValidStations = matchedProvinces;
				lastValidDigitD = null;
			} else if (digitDWord) {
				lastValidDigitD = digitDWord;
				lastValidStations = [];
			} else {
				if (lastValidStations.length > 0)
					chunkToProcess.unshift(...lastValidStations);
				else if (lastValidDigitD) chunkToProcess.unshift(lastValidDigitD);
			}
		}

		processedMessageChunks.push(chunkToProcess);
	}

	return {
		message: `Toàn bộ tin nhắn hợp lệ theo quy tắc của miền ${region}.`,
		status: "success",
		chunks: processedMessageChunks,
	};
}
