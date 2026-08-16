import { useAppStore } from "@lavaz/store";
import { useEffect, useState } from "react";
import { store } from "#/store/store";
import type { Reward } from "#/types/api/reward.type";
import type { Region } from "#/types/region.type";
import { Field, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface RewardInputItemProps {
	label: string;
	provinceCode: string;
	region: Region;
	release: string;
	isReset: boolean;
}

function chunkValue(value: string, chunkSize: number): string[] {
	if (chunkSize <= 0 || !value) return [];
	const regex = new RegExp(`.{1,${chunkSize}}`, "g");
	return value.match(regex) ?? [];
}

/**
 * Hàm hỗ trợ bóc tách số giải linh hoạt:
 * - Hỗ trợ dữ liệu dạng dán dính liền (ví dụ: chuỗi dài 35 số của Giải tư)
 * - Hỗ trợ dữ liệu dán từng số rời rạc (ví dụ: 7 số riêng biệt của Giải tư)
 */
function extractPrizeNumbers(
	tokens: string[],
	pointer: { index: number },
	expectedCount: number,
	numLength: number,
): string[] {
	if (pointer.index >= tokens.length) return [];

	const currentToken = tokens[pointer.index];

	// Trường hợp 1: Dữ liệu dán bị dính liền thành 1 chuỗi dài
	if (currentToken.length > numLength) {
		pointer.index += 1;
		return chunkValue(currentToken, numLength);
	}

	// Trường hợp 2: Dữ liệu là các con số riêng lẻ cách nhau bởi khoảng trắng/xuống dòng
	const result: string[] = [];
	for (let i = 0; i < expectedCount && pointer.index < tokens.length; i++) {
		result.push(tokens[pointer.index]);
		pointer.index += 1;
	}
	return result;
}

export function RewardInputItem({
	label,
	provinceCode,
	region,
	release,
	isReset,
}: RewardInputItemProps) {
	const [, { setReward }] = useAppStore(store.reward, (s) => s.values);
	const [value, setValue] = useState<string>("");

	const handleFormat = (val: string) => {
		if (!val.trim()) return null;

		// Chuẩn hóa văn bản: Chuyển tab, xuống dòng thành khoảng trắng và lọc các chuỗi chứa chữ số
		const text = val.trim().replaceAll("\t", " ").replaceAll("\n", " ");
		const arrVal = text.split(" ").filter((item) => /^\d+$/.test(item));

		const payload: Reward = {
			provinceCode,
			region,
			release,
			gdb: [],
			g1: [],
			g2: [],
			g3: [],
			g4: [],
			g5: [],
			g6: [],
			g7: [],
			g8: [],
		};

		let formattedTxt = "";
		const pointer = { index: 0 };

		if (region === "MB") {
			// -----------------------------------------------------------------
			// MIỀN BẮC (MB):
			// GĐB (1 số 5 chữ số), G1 (1 số 5 chữ số), G2 (2 số 5 chữ số),
			// G3 (6 số 5 chữ số), G4 (4 số 4 chữ số), G5 (6 số 4 chữ số),
			// G6 (3 số 3 chữ số), G7 (4 số 2 chữ số)
			// -----------------------------------------------------------------
			payload.gdb = extractPrizeNumbers(arrVal, pointer, 1, 5);
			payload.g1 = extractPrizeNumbers(arrVal, pointer, 1, 5);
			payload.g2 = extractPrizeNumbers(arrVal, pointer, 2, 5);
			payload.g3 = extractPrizeNumbers(arrVal, pointer, 6, 5);
			payload.g4 = extractPrizeNumbers(arrVal, pointer, 4, 4);
			payload.g5 = extractPrizeNumbers(arrVal, pointer, 6, 4);
			payload.g6 = extractPrizeNumbers(arrVal, pointer, 3, 3);
			payload.g7 = extractPrizeNumbers(arrVal, pointer, 4, 2);

			formattedTxt = [
				`gdb: ${payload.gdb.join(" ")}`,
				`g1: ${payload.g1.join(" ")}`,
				`g2: ${payload.g2.join(" ")}`,
				`g3: ${payload.g3.join(" ")}`,
				`g4: ${payload.g4.join(" ")}`,
				`g5: ${payload.g5.join(" ")}`,
				`g6: ${payload.g6.join(" ")}`,
				`g7: ${payload.g7.join(" ")}`,
			]
				.filter((line) => !line.endsWith(": "))
				.join("\n");
		} else {
			// -----------------------------------------------------------------
			// MIỀN NAM (MN) / MIỀN TRUNG (MT):
			// G8 (1 số 2 chữ số), G7 (1 số 3 chữ số), G6 (3 số 4 chữ số),
			// G5 (1 số 4 chữ số), G4 (7 số 5 chữ số), G3 (2 số 5 chữ số),
			// G2 (1 số 5 chữ số), G1 (1 số 5 chữ số), GĐB (1 số 6 chữ số)
			// -----------------------------------------------------------------
			payload.g8 = extractPrizeNumbers(arrVal, pointer, 1, 2);
			payload.g7 = extractPrizeNumbers(arrVal, pointer, 1, 3);
			payload.g6 = extractPrizeNumbers(arrVal, pointer, 3, 4);
			payload.g5 = extractPrizeNumbers(arrVal, pointer, 1, 4);
			payload.g4 = extractPrizeNumbers(arrVal, pointer, 7, 5);
			payload.g3 = extractPrizeNumbers(arrVal, pointer, 2, 5);
			payload.g2 = extractPrizeNumbers(arrVal, pointer, 1, 5);
			payload.g1 = extractPrizeNumbers(arrVal, pointer, 1, 5);
			payload.gdb = extractPrizeNumbers(arrVal, pointer, 1, 6);

			formattedTxt = [
				`g8: ${payload.g8.join(" ")}`,
				`g7: ${payload.g7.join(" ")}`,
				`g6: ${payload.g6.join(" ")}`,
				`g5: ${payload.g5.join(" ")}`,
				`g4: ${payload.g4.join(" ")}`,
				`g3: ${payload.g3.join(" ")}`,
				`g2: ${payload.g2.join(" ")}`,
				`g1: ${payload.g1.join(" ")}`,
				`gdb: ${payload.gdb.join(" ")}`,
			]
				.filter((line) => !line.endsWith(": "))
				.join("\n");
		}

		return { formattedTxt, payload };
	};

	useEffect(() => {
		if (!isReset) return;
		setValue("");
	}, [isReset]);

	const handleBlurOrPaste = (text: string) => {
		const res = handleFormat(text);
		if (res) {
			setValue(res.formattedTxt);
			setReward(res.payload);
		}
	};

	return (
		<Field>
			<FieldLabel htmlFor={label}>{label}</FieldLabel>
			<Textarea
				id={label}
				placeholder="Nhập giải thưởng..."
				value={value}
				rows={10}
				onChange={(e) => setValue(e.target.value)}
				onBlur={(e) => handleBlurOrPaste(e.target.value)}
			/>
		</Field>
	);
}
