import { useAppStore } from "@lavaz/store";
import { createFileRoute } from "@tanstack/react-router";
import { RotateCcwIcon, SaveAllIcon } from "lucide-react";
import { useState } from "react";
import { RewardInputItem } from "#/components/reward/RewardInputItem";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
} from "#/components/ui/card";
import { useRewardMutation } from "#/hooks/query/use-reward-mutation";
import { schedule } from "#/lib/constant/schedule.constant";
import { formatDate } from "#/lib/format-date";
import { store } from "#/store/store";

export const Route = createFileRoute("/trang-chu/cap-nhat-ket-qua")({
	staticData: { isShowBack: true, title: "Cập nhật kết quả" },
	component: RouteComponent,
});

function RouteComponent() {
	const [date] = useAppStore(store.date, (s) => s.date);
	const [values, { setReset }] = useAppStore(store.reward, (s) => s.values);
	const [isReset, setIsReset] = useState<boolean>(false);

	const { mutate } = useRewardMutation();

	const release = formatDate(date);
	const rewardByDate = schedule[date.getDay()];

	const handleReset = () => {
		setIsReset(true);
		setReset();
	};

	return (
		<div className="py-4 space-y-8 pb-20">
			<h1 className="text-xl capitalize font-semibold text-primary text-center">
				Cập nhật kết quả {release}
			</h1>
			<Card className="max-w-5xl w-full mx-auto">
				<CardContent className="space-y-6">
					<RewardInputItem
						label="Miền Bắc"
						provinceCode="MB"
						region={"MB"}
						release={release}
						isReset={isReset}
					/>
					{rewardByDate.MT.map((reward) => (
						<RewardInputItem
							key={`input-${reward.label}`}
							label={reward.label}
							provinceCode={reward.syntax}
							region="MT"
							release={release}
							isReset={isReset}
						/>
					))}
					{rewardByDate.MN.map((reward) => (
						<RewardInputItem
							key={`input-${reward.label}`}
							label={reward.label}
							provinceCode={reward.syntax}
							region="MT"
							release={release}
							isReset={isReset}
						/>
					))}
				</CardContent>
				<CardFooter>
					<CardAction className="w-full flex items-center justify-end gap-2">
						<Button variant={"secondary"} onClick={handleReset}>
							<RotateCcwIcon />
							<span>Xóa thông tin</span>
						</Button>
						<Button onClick={() => mutate(values)}>
							<SaveAllIcon />
							<span>Lưu kết quả</span>
						</Button>
					</CardAction>
				</CardFooter>
			</Card>
		</div>
	);
}
