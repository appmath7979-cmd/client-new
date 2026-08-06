import { provinceList } from "#/data/provinces.data";

interface IScheduleItem {
	label: string;
	syntax: string;
}

interface ISchedule {
	MB: Array<{ label: string; syntax: string }>;
	MT: Array<{ label: string; syntax: string }>;
	MN: Array<{ label: string; syntax: string }>;
}

const centrals = provinceList
	.filter((item) => item.region === "MT")
	.map((item) => ({ ...item, code: item.code.toLocaleLowerCase() }));
const souths = provinceList
	.filter((item) => item.region === "MN")
	.map((item) => ({ ...item, code: item.code.toLocaleLowerCase() }));

const schedule: ISchedule[] = [
	{
		MB: [{ label: "Miền Bắc", syntax: "mb" }],
		MT: [
			{
				label: centrals.find((central) => central.code === "kt")?.label ?? "",
				syntax: centrals.find((central) => central.code === "kt")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "th")?.label ?? "",
				syntax: centrals.find((central) => central.code === "th")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "kh")?.label ?? "",
				syntax: centrals.find((central) => central.code === "kh")?.syntax ?? "",
			},
		],
		MN: [
			{
				label: souths.find((central) => central.code === "kh")?.label ?? "",
				syntax: souths.find((central) => central.code === "kh")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "kg")?.label ?? "",
				syntax: souths.find((central) => central.code === "kg")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "dl")?.label ?? "",
				syntax: souths.find((central) => central.code === "dl")?.syntax ?? "",
			},
		],
	},
	{
		MB: [{ label: "Miền Bắc", syntax: "mb" }],
		MT: [
			{
				label: centrals.find((central) => central.code === "py")?.label ?? "",
				syntax: centrals.find((central) => central.code === "py")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "th")?.label ?? "",
				syntax: centrals.find((central) => central.code === "th")?.syntax ?? "",
			},
		],
		MN: [
			{
				label: souths.find((central) => central.code === "hcm")?.label ?? "",
				syntax: souths.find((central) => central.code === "hcm")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "dt")?.label ?? "",
				syntax: souths.find((central) => central.code === "dt")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "cm")?.label ?? "",
				syntax: souths.find((central) => central.code === "cm")?.syntax ?? "",
			},
		],
	},
	{
		MB: [{ label: "Miền Bắc", syntax: "mb" }],
		MT: [
			{
				label: centrals.find((central) => central.code === "dl")?.label ?? "",
				syntax: centrals.find((central) => central.code === "dl")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "qna")?.label ?? "",
				syntax:
					centrals.find((central) => central.code === "qna")?.syntax ?? "",
			},
		],
		MN: [
			{
				label: souths.find((central) => central.code === "bt")?.label ?? "",
				syntax: souths.find((central) => central.code === "bt")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "vt")?.label ?? "",
				syntax: souths.find((central) => central.code === "vt")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "bli")?.label ?? "",
				syntax: souths.find((central) => central.code === "bli")?.syntax ?? "",
			},
		],
	},
	{
		MB: [{ label: "Miền Bắc", syntax: "mb" }],
		MT: [
			{
				label: centrals.find((central) => central.code === "dn")?.label ?? "",
				syntax: centrals.find((central) => central.code === "dn")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "kh")?.label ?? "",
				syntax: centrals.find((central) => central.code === "kh")?.syntax ?? "",
			},
		],
		MN: [
			{
				label: souths.find((central) => central.code === "dn")?.label ?? "",
				syntax: souths.find((central) => central.code === "dn")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "ct")?.label ?? "",
				syntax: souths.find((central) => central.code === "ct")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "st")?.label ?? "",
				syntax: souths.find((central) => central.code === "st")?.syntax ?? "",
			},
		],
	},
	{
		MB: [{ label: "Miền Bắc", syntax: "mb" }],
		MT: [
			{
				label: centrals.find((central) => central.code === "bd")?.label ?? "",
				syntax: centrals.find((central) => central.code === "bd")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "qt")?.label ?? "",
				syntax: centrals.find((central) => central.code === "qt")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "qb")?.label ?? "",
				syntax: centrals.find((central) => central.code === "qb")?.syntax ?? "",
			},
		],
		MN: [
			{
				label: souths.find((central) => central.code === "tn")?.label ?? "",
				syntax: souths.find((central) => central.code === "tn")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "ag")?.label ?? "",
				syntax: souths.find((central) => central.code === "ag")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "bth")?.label ?? "",
				syntax: souths.find((central) => central.code === "bth")?.syntax ?? "",
			},
		],
	},
	{
		MB: [{ label: "Miền Bắc", syntax: "mb" }],
		MT: [
			{
				label: centrals.find((central) => central.code === "gl")?.label ?? "",
				syntax: centrals.find((central) => central.code === "gl")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "nt")?.label ?? "",
				syntax: centrals.find((central) => central.code === "nt")?.syntax ?? "",
			},
		],
		MN: [
			{
				label: souths.find((central) => central.code === "vl")?.label ?? "",
				syntax: souths.find((central) => central.code === "vl")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "bd")?.label ?? "",
				syntax: souths.find((central) => central.code === "bd")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "tv")?.label ?? "",
				syntax: souths.find((central) => central.code === "tv")?.syntax ?? "",
			},
		],
	},
	{
		MB: [{ label: "Miền Bắc", syntax: "mb" }],
		MT: [
			{
				label: centrals.find((central) => central.code === "dn")?.label ?? "",
				syntax: centrals.find((central) => central.code === "dn")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "qn")?.label ?? "",
				syntax: centrals.find((central) => central.code === "qn")?.syntax ?? "",
			},
			{
				label: centrals.find((central) => central.code === "dno")?.label ?? "",
				syntax:
					centrals.find((central) => central.code === "dno")?.syntax ?? "",
			},
		],
		MN: [
			{
				label: souths.find((central) => central.code === "hcm")?.label ?? "",
				syntax: souths.find((central) => central.code === "hcm")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "la")?.label ?? "",
				syntax: souths.find((central) => central.code === "la")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "bp")?.label ?? "",
				syntax: souths.find((central) => central.code === "bp")?.syntax ?? "",
			},
			{
				label: souths.find((central) => central.code === "hg")?.label ?? "",
				syntax: souths.find((central) => central.code === "hg")?.syntax ?? "",
			},
		],
	},
];

export { type IScheduleItem, type ISchedule, schedule };
