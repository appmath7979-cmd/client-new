import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
	CircleQuestionMarkIcon,
	CopyIcon,
	EditIcon,
	EllipsisVerticalIcon,
	Trash2Icon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import { ButtonGroup } from "#/components/ui/button-group";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Field, FieldLabel } from "#/components/ui/field";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import { Textarea } from "#/components/ui/textarea";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "#/components/ui/tooltip";
import { useDebounce } from "#/hooks/use-debounce";
import {
	betPairSyntaxes,
	validKeysToCombine,
} from "#/lib/constant/betpair.constant";
import { schedule } from "#/lib/constant/schedule.constant";
import { convertDate } from "#/lib/format-date";
import { expandChunks } from "#/lib/helper/expand-chunk";
import { formatMessage } from "#/lib/helper/format-message";
import { splitMessageToChunks } from "#/lib/helper/split-message-to-chunk";
import { cn } from "#/lib/utils";
import { orderQueryById } from "#/services/order.service";
import type { IValidateStatus } from "#/types/message.type";

export const Route = createFileRoute(
	"/khach-hang/$customerId/$orderId/chi-tiet",
)({
	staticData: { isShowBack: true },
	component: RouteComponent,
	loader: async ({ context, params }) =>
		await context.queryClient.ensureQueryData(orderQueryById(params)),
});

function RouteComponent() {
	const params = useParams({
		from: "/khach-hang/$customerId/$orderId/chi-tiet",
	});
	const { data, isPending } = useSuspenseQuery(orderQueryById(params));

	const [value, setValue] = useState<string>(data.order.message ?? "");
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [parsedText, setParsedText] = useState<string>("");
	const [chunks, setChunks] = useState<Array<string[]>>([]);
	const [notice, setNotice] = useState<IValidateStatus>({
		message: "Tin nhắn hợp lệ!",
		status: "success",
	});
	const [checkedMessage, setCheckedMessage] = useState<Array<string[]>>([]);
	const [isChecked, setIsChecked] = useState<boolean>(false);

	const day = data.order.release
		? convertDate(data.order.release)
		: new Date().getDate();
	const rewardSchedule = schedule[day];

	const isGuest = data.order.customer.type === "GUEST";
	const debounced = useDebounce(value);

	const orderDetails = useMemo(() => {
		if (!data.order.details) return [];
		const results = data.order.details.map((item) => {
			const result = (item.co - item.trung) * (isGuest ? 1 : -1);
			const { createdAt, customerId, updatedAt, date, ...rest } = item;
			return { ...rest, result };
		});

		const sorted = [...results].sort((a, b) => a.result - b.result);
		return sorted;
	}, [data.order.details]);

	const handleCancel = () => {
		setValue(data.order.message ?? "");
		setIsEdit(false);
		setNotice({
			message: "Tin nhắn hợp lệ!",
			status: "success",
		});
		setIsChecked(false);
	};

	const handleCheckMessage = () => {
		const value = expandChunks(chunks, rewardSchedule, data?.order?.region);
		setCheckedMessage(value);
		setIsChecked(true);
	};

	useEffect(() => {
		if (!isEdit) return;
		const resultString = formatMessage(
			debounced,
			betPairSyntaxes,
			validKeysToCombine,
		);

		setParsedText(resultString);
		setValue(resultString);
	}, [debounced, isEdit]);

	useEffect(() => {
		if (!isEdit) return;
		const { status, message, chunks } = splitMessageToChunks(
			parsedText,
			rewardSchedule,
			data?.order?.region,
		);

		setNotice({ message, status });
		setChunks(chunks);
	}, [parsedText, data?.order?.region, rewardSchedule, isEdit]);

	return (
		<div className="space-y-8 py-4">
			<div className="flex justify-between items-center p-4 rounded-md border">
				<h1>{data?.order?.customer?.fullName ?? ""}</h1>
				<div className="md:hidden">
					<DropdownMenu>
						<Tooltip>
							<TooltipTrigger asChild>
								<DropdownMenuTrigger asChild>
									<Button variant={"ghost"} size={"icon"}>
										<EllipsisVerticalIcon />
									</Button>
								</DropdownMenuTrigger>
							</TooltipTrigger>
							<TooltipContent>Tùy chọn xử lý tin nhắn</TooltipContent>
						</Tooltip>
						<DropdownMenuContent className="w-auto">
							<DropdownMenuItem disabled={isEdit}>
								<CopyIcon />
								<span>Sao chép tin</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<EditIcon />
								<span>Sửa tin</span>
							</DropdownMenuItem>
							<DropdownMenuItem variant="destructive" disabled={isEdit}>
								<Trash2Icon />
								<span>Xóa tin</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<ButtonGroup className="max-md:hidden">
					<Button variant={"outline"} disabled={isEdit}>
						<CopyIcon />
						<span>Sao chép tin</span>
					</Button>
					<Button
						variant={"outline"}
						onClick={() => setIsEdit((prev) => !prev)}
					>
						<EditIcon />
						<span>Sửa tin</span>
					</Button>
					<Button variant={"destructive"} disabled={isEdit}>
						<Trash2Icon />
						<span>Xóa tin</span>
					</Button>
				</ButtonGroup>
			</div>

			<Field>
				<div className="flex justify-between items-center">
					<FieldLabel>
						<span>Sửa tin nhắn</span>
						<Tooltip>
							<TooltipTrigger>
								<CircleQuestionMarkIcon className="size-4" />
							</TooltipTrigger>
							<TooltipContent>
								Để sửa tin nhắn vui lòng bấm chọn sửa tin
							</TooltipContent>
						</Tooltip>
					</FieldLabel>
					<ButtonGroup
						className={cn(!isEdit && "opacity-50 pointer-events-none")}
					>
						<Button variant={"destructive"} onClick={handleCancel}>
							Hủy bỏ
						</Button>
						<Button
							variant={"outline"}
							onClick={handleCheckMessage}
							disabled={isChecked}
						>
							Kiểm tra tin nhắn
						</Button>
						<Button variant={"outline"} disabled={!isChecked}>
							Gửi tin nhắn
						</Button>
					</ButtonGroup>
				</div>
				<Textarea
					readOnly={!isEdit}
					className="min-h-30"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<p
					className={cn(
						"text-sm font-semibold p-4 border rounded-md",
						notice.status === "success" &&
							"text-emerald-500 border-emerald-500 bg-emerald-500/10",
						notice.status === "error" &&
							"text-destructive border-destructive bg-destructive/10",
					)}
				>
					{notice.message}
				</p>
			</Field>

			<div className="pb-20 space-y-4">
				<h2>Chi tiết</h2>
				<div className="border rounded-md">
					<Table className="overflow-x-auto">
						<TableHeader>
							<TableRow className="[&_th]:text-center">
								<TableHead className="w-20">STT</TableHead>
								<TableHead className="sticky left-0 z-20 max-md:bg-background">
									Đài
								</TableHead>
								<TableHead className="sticky left-20 z-20 max-md:bg-background">
									Số đánh
								</TableHead>
								<TableHead>Cú pháp</TableHead>
								<TableHead>Điểm</TableHead>
								<TableHead>Cò</TableHead>
								<TableHead>Trúng</TableHead>
								<TableHead>Kết quả</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{orderDetails.length > 0 ? (
								orderDetails.map((item, i) => (
									<TableRow
										key={item.id}
										className={cn(
											"[&_td]:text-center",
											item.result < 0 && "text-destructive",
											item.result > 0 && "text-emerald-600",
										)}
									>
										<TableCell className="w-20">{i + 1}</TableCell>
										<TableCell className="sticky left-0 z-20 max-md:bg-background">
											{item.stationCode}
										</TableCell>
										<TableCell className="sticky left-20 z-20 max-md:bg-background">
											{item.number}
										</TableCell>
										<TableCell>{item.type}</TableCell>
										<TableCell>{item.xac.toLocaleString("vi")}</TableCell>
										<TableCell>{item.co.toLocaleString("vi")}</TableCell>
										<TableCell>{item.trung.toLocaleString("vi")}</TableCell>
										<TableCell>{item.result.toLocaleString("vi")}</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={7}>Chưa có tin</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
