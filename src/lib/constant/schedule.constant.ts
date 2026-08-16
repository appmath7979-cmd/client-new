import { provinceList } from "#/data/provinces.data";

interface IScheduleItem {
	label: string;
	syntax: string;
}

interface ISchedule {
	MB: IScheduleItem[];
	MT: IScheduleItem[];
	MN: IScheduleItem[];
}

// Tách bạch rõ 3 danh sách theo đúng region từ mảng gốc
const mbList = provinceList.filter((item) => item.region === "MB");
const mtList = provinceList.filter((item) => item.region === "MT");
const mnList = provinceList.filter((item) => item.region === "MN");

// Hàm helper tìm kiếm biệt lập cho từng miền
const getMB = (code: string) => {
	const found = mbList.find((item) => item.code === code);
	return { label: found?.label ?? "", syntax: found?.syntax ?? "" };
};

const getMT = (code: string) => {
	const found = mtList.find((item) => item.code === code);
	return { label: found?.label ?? "", syntax: found?.syntax ?? "" };
};

const getMN = (code: string) => {
	const found = mnList.find((item) => item.code === code);
	return { label: found?.label ?? "", syntax: found?.syntax ?? "" };
};

const schedule: ISchedule[] = [
	// Chủ Nhật (Đứng đầu mảng)
	{
		MB: [getMB("MB")],
		MT: [getMT("KH"), getMT("KT")],
		MN: [getMN("TG"), getMN("KG"), getMN("DL")],
	},
	// Thứ 2
	{
		MB: [getMB("MB")],
		MT: [getMT("TH"), getMT("PY")],
		MN: [getMN("HCM"), getMN("DT"), getMN("CM")],
	},
	// Thứ 3
	{
		MB: [getMB("MB")],
		MT: [getMT("QNA"), getMT("DL")],
		MN: [getMN("BT"), getMN("VT"), getMN("BLI")],
	},
	// Thứ 4
	{
		MB: [getMB("MB")],
		MT: [getMT("DN"), getMT("KH")],
		MN: [getMN("DN"), getMN("CT"), getMN("ST")],
	},
	// Thứ 5
	{
		MB: [getMB("MB")],
		MT: [getMT("BD"), getMT("QB"), getMT("QT")],
		MN: [getMN("TN"), getMN("AG"), getMN("BTH")],
	},
	// Thứ 6
	{
		MB: [getMB("MB")],
		MT: [getMT("GL"), getMT("NT")],
		MN: [getMN("VL"), getMN("BD"), getMN("TV")],
	},
	// Thứ 7
	{
		MB: [getMB("MB")],
		MT: [getMT("DN"), getMT("QN"), getMT("DNO")],
		MN: [getMN("HCM"), getMN("LA"), getMN("HG"), getMN("BP")],
	},
];

export { type IScheduleItem, type ISchedule, schedule };