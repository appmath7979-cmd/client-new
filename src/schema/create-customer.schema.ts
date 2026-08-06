import { z } from "zod";

const RegionValuesSchema = z.object({
	MB: z.number(),
	MT: z.number(),
	MN: z.number(),
});

const BetPairSchema = z.object({
	name: z.enum(["b2", "dd2", "da", "dax", "b3", "dd3", "b4"]),
	c: RegionValuesSchema,
	t: RegionValuesSchema,
	type: z.enum(["tile", "thanhtien"]),
});

const CreateCustomerSchema = z.object({
	fullName: z.string().min(1, "Họ và tên không được để trống!"),
	phoneNumber: z
		.string()
		.regex(
			/^(03|05|07|08|09)\d{8}$/,
			"Số điện thoại không hợp lệ (phải gồm 10 số)!",
		),
	type: z.enum(["OWNER", "GUEST"]),
	tinhUi: z.boolean(),
	xienMienBac: z.boolean(),
	settings: z.array(BetPairSchema),
	daxt: z.enum(["MOT_LAN", "KY_RUOI", "NHIEU_CAP"]),
});

type Customer = z.infer<typeof CreateCustomerSchema>;

export {
	CreateCustomerSchema,
	BetPairSchema,
	RegionValuesSchema,
	type Customer,
};
