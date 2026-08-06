import type { IScheduleItem } from "../constant/schedule.constant";

export function formatMessage(
	rawText: string,
	betPairSyntaxes: Record<string, string[]>,
	validKeysToCombine: string[],
	provinces: IScheduleItem[] = [],
): string {
	if (!rawText) {
		return "";
	}

	if (/\s$/.test(rawText)) {
		return rawText;
	}

	const debounceTrim = rawText.trim().toLowerCase();

	// 0. CHUẨN HÓA TOÀN BỘ CÁC BIẾN THỂ CỦA CHỮ "Đ"
	const preProcessedText = debounceTrim
		.replace(/[₫đ](?=[a-z0-9])/g, "d")
		.replace(/(?:đd|dđ)/g, "dd")
		.replace(/(^|\s)[₫đ](?=\s|$)/g, "$1dd");

	// 1. CHUẨN HÓA CÁC CỤM CHỈ ĐÀI (dai, đài, đai, dài) THÀNH "d"
	const normalizedDaiText = preProcessedText.replace(
		/(\d+)\s*(?:dai|đài|đai|dài)/gi,
		"$1d",
	);

	// QUY ĐỔI CÁC DẤU NGĂN CÁCH (,-+) THÀNH KHOẢNG TRẮNG
	const spacedSymbolsText = normalizedDaiText.replace(/[,+-]/g, " ");

	const cleanValue = spacedSymbolsText.replace(/[^\p{L}\s;\d.]/gu, " ");

	// TẠO MAP ÁNH XẠ TỪ PROVINCES
	const provinceMap = new Map<string, string>();
	provinceMap.set("dnai", "dn");
	provinceMap.set("đồng nai", "dn");
	provinceMap.set("sgn", "tp");
	provinceMap.set("hcm", "tp");
	provinceMap.set("sóc trăng", "st");
	provinceMap.set("soc trang", "st");
	provinceMap.set("long an", "la");
	provinceMap.set("cà mau", "cm");

	provinces.forEach((p) => {
		const syntax = p.syntax.toLowerCase();
		provinceMap.set(syntax, syntax);
		provinceMap.set(p.syntax.toLowerCase(), syntax);

		if (p.label) {
			const lowerName = p.label.toLowerCase();
			provinceMap.set(lowerName, syntax);

			const normalizedName = lowerName
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "");
			provinceMap.set(normalizedName, syntax);

			const joinedNormalizedName = normalizedName.replace(/[^a-z0-9]/g, "");
			provinceMap.set(joinedNormalizedName, syntax);
		}
	});

	const sortedProvinceKeys = Array.from(provinceMap.keys()).sort(
		(a, b) => b.length - a.length,
	);

	let processedProvinceText = cleanValue;
	for (const key of sortedProvinceKeys) {
		if (key.length > 1) {
			const regex = new RegExp(`\\b${key}\\b`, "gi");
			processedProvinceText = processedProvinceText.replace(regex, () => {
				return ` ${provinceMap.get(key)} `;
			});
		}
	}

	// ==========================================
	// XỬ LÝ DẤU CHẤM & BẢO VỆ TUYỆT ĐỐI 0.5
	// ==========================================

	// 0. Xử lý các dạng số đánh dính dấu chấm ở giữa kiểu như 25.52 -> tách thành 25 52
	let refinedDecimalText = processedProvinceText.replace(
		/\b(\d+)\.(\d)(\d+)\b/g,
		"$1 $2$3",
	);

	// 1. Đổi toàn bộ các biến thể 0.5 / b0.5 / b0.5n sang chuỗi mã hóa tạm thời và tự động bỏ chữ n đi kèm
	refinedDecimalText = refinedDecimalText
		.replace(/\b([a-zA-Z]+)0\.5[nN]?\b/g, "$1___DECIMAL_ZERO_FIVE___")
		.replace(/\b0\.5[nN]?\b/g, "___DECIMAL_ZERO_FIVE___")
		.replace(/\b0\.5[nN]?([a-zA-ZÀ-ỹ]+)/g, "___DECIMAL_ZERO_FIVE___$1");

	// 2. Tách số dính với chữ/phím cược có dấu chấm ở giữa (VD: 98.b20 -> 98 b20)
	refinedDecimalText = refinedDecimalText
		.replace(/(\d+)\.([a-zA-ZÀ-ỹ]+\d*)/g, "$1 $2")
		.replace(/([a-zA-ZÀ-ỹ]+\d*)\.(\d+)/g, "$1 $2");

	// 3. Xử lý các chuỗi số dài dính nhau bằng dấu chấm (VD: 400.545.568 -> 400 545 568)
	refinedDecimalText = refinedDecimalText.replace(
		/\b(\d+)\.(\d+)\.(\d+)/g,
		"$1 $2 $3",
	);

	// 4. Xử lý các trường hợp còn lại có dấu chấm
	refinedDecimalText = refinedDecimalText.replace(
		/(?:(\.[a-zA-ZÀ-ỹ]+\d*)|([a-zA-ZÀ-ỹ]+\d*)\s*\.\s*([^\s]*)|(\d+)\s*\.\s*(\d+))/g,
		(match, dotSyntax, p1, p2, num1, num2) => {
			if (dotSyntax !== undefined) {
				return ` ${dotSyntax.slice(1)}`;
			}
			if (p1 !== undefined) {
				if (p2 === "5" || /^5[a-zA-ZÀ-ỹ]+/u.test(p2)) {
					return `${p1}.5${p2.slice(1)}`;
				}
				return `${p1} ${p2}`;
			}
			if (num1 !== undefined && num2 !== undefined) {
				if (num2 === "5") {
					return `${num1}.${num2}`;
				}
				if (num2.length > 1 && num2.startsWith("5")) {
					return `${num1}.5 ${num2.slice(1)}`;
				}
				return `${num1} ${num2}`;
			}
			return match;
		},
	);

	// 5. Chuẩn hóa b0.5 / b 0.5
	refinedDecimalText = refinedDecimalText
		.replace(/([a-zA-Z]+\d*\.5)[nN]\b/g, "$1")
		.replace(/([a-zA-Z]+)\s+(\d+\.5)/g, "$1$2");

	// TÁCH VÀ LỌC THÔNG MINH CHO CÁC CHUỖI DÍNH LIỀN
	const initialSplit = refinedDecimalText
		.split(/\s+/)
		.filter(Boolean)
		.flatMap((word) => {
			if (/^[nN]$/.test(word)) {
				return [];
			}

			const complexMatched = word.match(
				/([a-zA-ZÀ-ỹ]+|\d+(?:\.5)?|___DECIMAL_ZERO_FIVE___)/g,
			);
			if (
				complexMatched &&
				complexMatched.length > 1 &&
				!/^\d+(?:\.5)?$/.test(word) &&
				!word.includes("___DECIMAL_ZERO_FIVE___")
			) {
				return complexMatched.map((token) => token.toLowerCase());
			}

			const dotNumberAndLetterNum = word.match(
				/^(\d+)\.([a-zA-Z]+)(\d+(\.5)?)$/i,
			);
			if (dotNumberAndLetterNum) {
				return [
					dotNumberAndLetterNum[1],
					dotNumberAndLetterNum[2].toLowerCase(),
					dotNumberAndLetterNum[3],
				];
			}

			const numberFollowedByBOrBl = word.match(/^(\d+)(bl|[bB])$/);
			if (numberFollowedByBOrBl) {
				return [
					numberFollowedByBOrBl[1],
					numberFollowedByBOrBl[2].toLowerCase(),
				];
			}

			const blFollowedByNum = word.match(
				/^(bl|b)(\d+(\.5)?|___DECIMAL_ZERO_FIVE___)$/i,
			);
			if (blFollowedByNum) {
				return [blFollowedByNum[1].toLowerCase(), blFollowedByNum[2]];
			}

			const combinedDecimalMatch = word.match(
				/^([a-zA-ZÀ-ỹ]+)(\d+\.5|___DECIMAL_ZERO_FIVE___)$/u,
			);
			if (combinedDecimalMatch) {
				return [combinedDecimalMatch[1].toLowerCase(), combinedDecimalMatch[2]];
			}

			if (/^b.*___DECIMAL_ZERO_FIVE___/i.test(word)) {
				return [word.replace(/[nN]$/, "")];
			}
			if (/^b\d+\.5[nN]$/i.test(word)) {
				return [word.replace(/[nN]$/, "")];
			}
			if (/([a-zA-ZÀ-ỹ]+\d+\.5|\d+\.5)[nN]$/.test(word)) {
				return [word.replace(/[nN]$/, "")];
			}

			return [word];
		});

	const splitValue = initialSplit.flatMap((currentValue) => {
		let sanitizedValue = currentValue.trim();

		sanitizedValue = sanitizedValue.replace(/^\.+|\.+$/g, "");
		if (!sanitizedValue) return [];

		if (sanitizedValue.includes("___DECIMAL_ZERO_FIVE___")) {
			return [sanitizedValue];
		}

		if (/^[a-zA-ZÀ-ỹ]+\d+\.\d{2,}$/.test(sanitizedValue)) {
			return [sanitizedValue];
		}

		const combinedMatch = sanitizedValue.match(/[dD]\d+/g);
		if (combinedMatch && combinedMatch.length > 1) {
			return combinedMatch;
		}

		if (/^\d+(\.5)?[dD]$/.test(sanitizedValue)) {
			return [sanitizedValue];
		}

		const textNumberMatch = sanitizedValue.match(/^([a-zA-ZÀ-ỹ]+)(\d+\.5)?$/u);
		if (textNumberMatch) {
			const prefix = textNumberMatch[1].toLowerCase();
			const num = textNumberMatch[2] || "";
			if (["dui", "du"].includes(prefix)) {
				return [`duoi${num}`];
			}
			return num ? [prefix, num] : [prefix];
		}

		if (
			/[a-zA-Z]+\d+(\.5)?[a-zA-Z]$/i.test(sanitizedValue) &&
			!sanitizedValue.includes("___DECIMAL_ZERO_FIVE___")
		) {
			sanitizedValue = sanitizedValue.replace(/[a-zA-Z]$/i, "");
		}

		if (/^[dD]\d+(\.5)?$/.test(sanitizedValue)) {
			return [sanitizedValue];
		}

		const match = sanitizedValue.match(/^(\d+)([\p{L}a-zA-Z]+\d+(\.5)?)$/u);
		if (match) {
			return [match[1], match[2]];
		}

		return [sanitizedValue];
	});

	// XỬ LÝ THÔNG MINH CHO "bl"
	const processedBlValues: string[] = [];
	for (let i = 0; i < splitValue.length; i++) {
		const item = splitValue[i];
		if (item.toLowerCase() === "bl") {
			const prev = splitValue[i - 1];
			const next = splitValue[i + 1];

			const isPrevNumber =
				prev &&
				(/^\d+(\.5)?$/.test(prev) || prev.includes("___DECIMAL_ZERO_FIVE___"));
			const isNextNumber =
				next &&
				(/^\d+(\.5)?$/.test(next) || next.includes("___DECIMAL_ZERO_FIVE___"));

			if (isPrevNumber && isNextNumber) {
				processedBlValues.push("b");
			} else {
				processedBlValues.push("bli");
			}
		} else {
			processedBlValues.push(item);
		}
	}

	let dCount = 0;

	const parsedKeywords = processedBlValues
		.map((item) => {
			let cleanItem = item;

			if (/([a-zA-ZÀ-ỹ]+\d+\.5|\d+\.5)[nN]$/.test(cleanItem)) {
				cleanItem = cleanItem.replace(/[nN]$/, "");
			}

			const lowerItem = cleanItem.toLowerCase();

			if (lowerItem === "dui" || lowerItem === "du") {
				return "duoi";
			}

			if (/^[dD]\d+(\.5)?$/.test(lowerItem)) {
				dCount++;
				const num = lowerItem.replace(/^[dD]/, "");
				const mappedKey = dCount % 2 !== 0 ? `dau${num}` : `duoi${num}`;
				return mappedKey;
			}

			if (provinceMap.has(lowerItem)) {
				return provinceMap.get(lowerItem) ?? "";
			}

			for (const [key, words] of Object.entries(betPairSyntaxes)) {
				if (words.includes(lowerItem)) {
					return key;
				}
			}
			return cleanItem;
		})
		.filter(Boolean);

	const finalResult: string[] = [];
	for (let i = 0; i < parsedKeywords.length; i++) {
		const currentValue = parsedKeywords[i];
		const nextValue = parsedKeywords[i + 1];
		const prevValue = parsedKeywords[i - 1];

		const isPrevPureNumber =
			prevValue &&
			(/^\d+(\.5)?$/.test(prevValue) ||
				prevValue.includes("___DECIMAL_ZERO_FIVE___"));
		const isPrevBetKeyWithNumber =
			prevValue &&
			(/^[a-zA-ZÀ-ỹ]+\d+(\.5)?$/.test(prevValue) ||
				prevValue.includes("___DECIMAL_ZERO_FIVE___"));

		const isBKey =
			currentValue === "b" || betPairSyntaxes.b?.includes(currentValue);

		const isNumber =
			/^\d+(\.5)?$/.test(currentValue) ||
			currentValue.includes("___DECIMAL_ZERO_FIVE___");
		const isStandaloneD = nextValue && /^d$/i.test(nextValue) && isNumber;

		if (isStandaloneD) {
			finalResult.push(`${currentValue}d`);
			i++;
		} else if (
			validKeysToCombine.includes(currentValue) &&
			nextValue &&
			(/^\d+(\.5)?$/.test(nextValue) ||
				nextValue.includes("___DECIMAL_ZERO_FIVE___")) &&
			(isPrevPureNumber || isPrevBetKeyWithNumber) &&
			!/^\d+(\.5)?d$/i.test(currentValue) &&
			!/^[dD]\d+(\.5)?$/.test(currentValue)
		) {
			finalResult.push(`${currentValue}${nextValue}`);
			i++;
		} else if (
			isBKey &&
			nextValue &&
			(/^\d+(\.5)?$/.test(nextValue) ||
				nextValue.includes("___DECIMAL_ZERO_FIVE___")) &&
			(isPrevPureNumber || isPrevBetKeyString(prevValue))
		) {
			finalResult.push(`${currentValue}${nextValue}`);
			i++;
		} else {
			if (finalResult[finalResult.length - 1] !== currentValue) {
				finalResult.push(currentValue);
			}
		}
	}

	// 6. GIẢI MÃ TRẢ LẠI 0.5 TRƯỚC KHI XUẤT KẾT QUẢ CUỐI CÙNG
	const restoredResult = finalResult.map((item) =>
		item.replace(/___DECIMAL_ZERO_FIVE___/g, "0.5"),
	);

	return restoredResult.join(" ");
}

function isPrevBetKeyString(val: string): boolean {
	return (
		/^[a-zA-ZÀ-ỹ]+\d+(\.5)?$/.test(val) ||
		val.includes("___DECIMAL_ZERO_FIVE___")
	);
}
