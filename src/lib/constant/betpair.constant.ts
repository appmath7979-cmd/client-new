const betPairSyntaxes = {
	b: ["bao", "lo", "lô", "baolo", "bl"],
	bd: ["baodao", "baođảo", "baođao"],
	db: ["de", "đặcb", "đặcbiệt", "dacbiet"],
	dd: ["đầuđuôi", "đauđuôi", "đđ"],
	dau: ["đầu", "đau"],
	duoi: ["đuôi", "đui", "dui", "duôi"],
	xc: ["xỉu", "xĩu", "xỉuchủ", "xĩuchủ"],
	xdau: ["xđầu", "xỉuđầu", "xỉuđau", "xdầu", "xỉudầu", "xĩudầu"],
	xduoi: ["xđui", "xdui", "xđuôi"],
	da: ["đã", "đá", "đa", "đat", "dat", "đát"],
	dax: ["đáx", "đax"],
	k: [
		"đến",
		"đen",
		"den",
		"dến",
		"dén",
		"keo",
		"kéo",
		"đẽn",
		"dẽn",
		"kẹo",
		"kẽo",
	],
};

const validKeysToCombine = [
	"b",
	"bd",
	"db",
	"dd",
	"dau",
	"duoi",
	"xc",
	"xdau",
	"xduoi",
	"da",
	"dax",
];

export { betPairSyntaxes, validKeysToCombine };
