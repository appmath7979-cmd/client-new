import { useAppStore } from "@lavaz/store";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { CircleCheckBigIcon, SendIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { RegionDropdown } from "#/components/base/dropdown/RegionDropdown";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";
import { useCreateMessage } from "#/hooks/query/use-message-mutation";
import { useDebounce } from "#/hooks/use-debounce";
import {
	betPairSyntaxes,
	validKeysToCombine,
} from "#/lib/constant/betpair.constant";
import { schedule } from "#/lib/constant/schedule.constant";
import { formatDate } from "#/lib/format-date";
import { expandChunks } from "#/lib/helper/expand-chunk";
import { formatChunkSubmit } from "#/lib/helper/format-chunk-submit";
import { formatMessage } from "#/lib/helper/format-message";
import { splitMessageToChunks } from "#/lib/helper/split-message-to-chunk";
import { cn } from "#/lib/utils";
import { store } from "#/store/store";
import type { CreateOrder } from "#/types/api/order.type";
import type { IValidateStatus } from "#/types/message.type";

export const Route = createFileRoute("/khach-hang/$customerId/tin-nhan")({
	staticData: { title: "Xử lý Tin nhắn", isShowBack: true },
	component: RouteComponent,
});

function RouteComponent() {
	const { customerId } = useParams({
		from: "/khach-hang/$customerId/tin-nhan",
	});
	const { mutate } = useCreateMessage(customerId);
	const [region] = useAppStore(store.region, (s) => s.region);
	const [date] = useAppStore(store.date, (s) => s.date);
	const [value, setValue] = useState<string>("");
	const [parsedText, setParsedText] = useState<string>("");
	const [notice, setNotice] = useState<IValidateStatus>({
		message: "Chưa nhập tin nhắn!",
		status: "error",
	});
	const [chunks, setChunks] = useState<Array<string[]>>([]);
	const [checkedMessage, setCheckedMessage] = useState<Array<string[]>>([]);
	const [isChecked, setIsChecked] = useState<boolean>(false);
	const debounced = useDebounce(value);
	const rewardSchedule = schedule[date.getDay()];

	const handleCheckMessage = () => {
		const value = expandChunks(chunks, rewardSchedule, region);
		setCheckedMessage(value);
		setIsChecked(true);
	};

	useEffect(() => {
		const resultString = formatMessage(
			debounced,
			betPairSyntaxes,
			validKeysToCombine,
		);

		setParsedText(resultString);
		setValue(resultString);
	}, [debounced]);

	useEffect(() => {
		const { status, message, chunks } = splitMessageToChunks(
			parsedText,
			rewardSchedule,
			region,
		);

		setNotice({ message, status });
		setChunks(chunks);
	}, [parsedText, region, rewardSchedule]);

	const handleSubmit = () => {
		const details = formatChunkSubmit(checkedMessage, region);
		const release = formatDate(date);

		const data: CreateOrder = {
			region,
			message: value,
			isLayoff: false,
			release,
			details: details,
			customerId,
		};
		mutate(data);
	};

	return (
		<div className="py-4 space-y-6">
			<div className="flex justify-end items-center gap-4">
				<RegionDropdown />
				<Button
					onClick={handleCheckMessage}
					disabled={isChecked || notice.status !== "success"}
					className={cn(isChecked && "bg-secondary text-secondary-foreground")}
				>
					<CircleCheckBigIcon />
					<span>Kiểm tra tin nhắn</span>
				</Button>
				<Button
					disabled={!isChecked}
					onClick={handleSubmit}
					className={cn(!isChecked && "bg-secondary text-secondary-foreground")}
				>
					<SendIcon />
					<span>Gửi tin nhắn</span>
				</Button>
			</div>
			<div className="space-y-2">
				<div className="space-y-2">
					<Label htmlFor="message">Nhập tin nhắn</Label>
					<Textarea
						id="message"
						className="min-h-24"
						value={value}
						onChange={(e) => {
							setValue(e.target.value);
							if (isChecked) setIsChecked(false);
						}}
					/>
				</div>
				<em
					className={cn(
						"text-xs inline-flex px-2 py-1.5 rounded-md",
						notice.status === "error"
							? "text-destructive bg-destructive/5"
							: "text-emerald-600 bg-emerald-50",
					)}
				>
					{notice.message}
				</em>
			</div>
			{!isChecked ? (
				<Card>
					<CardContent>
						{chunks.map((chunk, index) => {
							const key = `${chunk}-${index}`;
							return <div key={key}>{chunk.join(" ")}</div>;
						})}
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent className="grid grid-cols-2 gap-4">
						{checkedMessage.map((checked, i) => {
							const key = `${checked}-${i}`;
							return (
								<div key={key} className="p-4 py-6 rounded-md border">
									{checked.join(" ")}
								</div>
							);
						})}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
