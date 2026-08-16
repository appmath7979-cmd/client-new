import { useAppStore } from "@lavaz/store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { useMemo } from "react";
import { Button } from "#/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/ui/table";
import {
	northRewardConstant,
	othersRewardConstant,
	rewardConstant,
} from "#/lib/constant/reward.constant";
import { schedule } from "#/lib/constant/schedule.constant";
import { formatDate } from "#/lib/format-date";
import { rewardQuery } from "#/services/reward.service";
import { store } from "#/store/store";

export const Route = createFileRoute("/trang-chu/")({
	staticData: { title: "Kết quả xổ số" },
	loader: async ({ context }) =>
		await context.queryClient.ensureQueryData(rewardQuery()),
	component: RouteComponent,
});

function RouteComponent() {
	const [date] = useAppStore(store.date, (s) => s.date);
	const release = formatDate(date);
	const { data } = useSuspenseQuery(rewardQuery(release));
	const rewardByDay = schedule[date.getDay()];

	const { centralSchedule, southSchedule } = useMemo(() => {
		const centralSchedule = rewardByDay?.MT ?? [];
		const southSchedule = rewardByDay?.MN ?? [];
		return { centralSchedule, southSchedule };
	}, [rewardByDay]);

	const { northReward, centralReward, southReward } = useMemo(() => {
		if (!data.reward)
			return { northReward: [], centralReward: [], southReward: [] };

		const northReward = data.reward.filter((item) => item.region === "MB");

		const centralData = data.reward.filter((item) => item.region === "MT");
		const centralReward = centralSchedule
			.map((sch) =>
				centralData.find((item) => item.provinceCode === sch.syntax),
			)
			.filter(Boolean);

		const southData = data.reward.filter((item) => item.region === "MN");
		const southScheduleList = southSchedule
			.map((sch) => southData.find((item) => item.provinceCode === sch.syntax))
			.filter(Boolean);

		return {
			northReward,
			centralReward: centralReward as typeof centralData,
			southReward: southScheduleList as typeof southData,
		};
	}, [data.reward, centralSchedule, southSchedule]);

	return (
		<div className="py-6 space-y-10 pb-20">
			<div className="flex justify-between gap-2 border rounded-md p-4">
				<h2 className="text-lg font-bold uppercase text-primary text-center tracking-wide">
					Kết quả xổ số ngày {release}
				</h2>
				<Button asChild>
					<Link to="/trang-chu/cap-nhat-ket-qua">
						<PlusIcon />
						<span>Cập nhật kết quả</span>
					</Link>
				</Button>
			</div>

			<div className="space-y-8 max-w-5xl mx-auto ">
				{/* MIỀN BẮC */}
				<div className="space-y-3">
					<h2 className="capitalize text-lg font-bold text-slate-800 dark:text-slate-200 border-l-4 border-primary pl-3">
						Kết quả Miền Bắc
					</h2>
					<div className="border rounded-lg overflow-hidden shadow-sm bg-card">
						<Table>
							<TableHeader className="bg-muted/50">
								<TableRow className="[&_th]:text-center">
									<TableHead className="w-28 font-semibold">Giải</TableHead>
									<TableHead className="font-semibold">Miền Bắc</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{northRewardConstant.map((re) => {
									const rowKey = `north-${re}`;
									return (
										<TableRow key={rowKey} className="hover:bg-muted/30">
											<TableCell className="font-medium text-center bg-muted/20">
												{rewardConstant[re as keyof typeof rewardConstant]}
											</TableCell>
											<TableCell className="text-center">
												{northReward.map((item) => {
													const val = (item as any)[re] || [];
													const itemKey = `north-item-${item.id}`;
													return (
														<div
															key={itemKey}
															className="flex flex-wrap justify-center gap-2 py-1"
														>
															{val.map((num: string, numIdx: number) => {
																const numKey = `north-num-${num}-${numIdx}`;
																return (
																	<span
																		key={numKey}
																		className="px-2.5 py-1 bg-secondary/60 rounded text-sm font-semibold tracking-wider"
																	>
																		{num}
																	</span>
																);
															})}
														</div>
													);
												})}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* MIỀN TRUNG */}
				<div className="space-y-3">
					<h2 className="capitalize text-lg font-bold text-slate-800 dark:text-slate-200 border-l-4 border-primary pl-3">
						Kết quả Miền Trung
					</h2>
					<div className="border rounded-lg overflow-hidden shadow-sm bg-card overflow-x-auto">
						<Table className="min-w-150">
							<TableHeader className="bg-muted/50">
								<TableRow className="[&_th]:text-center">
									<TableHead className="w-28 font-semibold">Giải</TableHead>
									{centralSchedule.map((item, itemIdx) => {
										const headKey = `central-head-${item.syntax}-${itemIdx}`;
										return (
											<TableHead
												key={headKey}
												className="font-semibold text-primary"
											>
												{item.label}
											</TableHead>
										);
									})}
								</TableRow>
							</TableHeader>
							<TableBody>
								{othersRewardConstant.map((re, reIdx) => {
									const rowKey = `central-row-${re}-${reIdx}`;
									return (
										<TableRow key={rowKey} className="hover:bg-muted/30">
											<TableCell className="font-medium text-center bg-muted/20">
												{rewardConstant[re as keyof typeof rewardConstant]}
											</TableCell>
											{centralSchedule.map((sch, schIdx) => {
												const cellKey = `central-cell-${sch.syntax}-${re}-${schIdx}`;
												const item = centralReward.find(
													(r) => r?.provinceCode === sch.syntax,
												);
												const val = item ? (item as any)[re] || [] : [];
												return (
													<TableCell key={cellKey} className="text-center">
														<div className="flex flex-col items-center justify-center gap-1.5 py-1">
															{val.length > 0 ? (
																val.map((num: string, numIdx: number) => {
																	const numKey = `central-num-${sch.syntax}-${re}-${num}-${numIdx}`;
																	return (
																		<span
																			key={numKey}
																			className="px-2 py-0.5 bg-secondary/50 rounded text-sm font-medium tracking-wide"
																		>
																			{num}
																		</span>
																	);
																})
															) : (
																<span className="text-muted-foreground text-xs">
																	-
																</span>
															)}
														</div>
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* MIỀN NAM */}
				<div className="space-y-3">
					<h2 className="capitalize text-lg font-bold text-slate-800 dark:text-slate-200 border-l-4 border-primary pl-3">
						Kết quả Miền Nam
					</h2>
					<div className="border rounded-lg overflow-hidden shadow-sm bg-card overflow-x-auto">
						<Table className="min-w-150">
							<TableHeader className="bg-muted/50">
								<TableRow className="[&_th]:text-center">
									<TableHead className="w-28 font-semibold">Giải</TableHead>
									{southSchedule.map((item, itemIdx) => {
										const headKey = `south-head-${item.syntax}-${itemIdx}`;
										return (
											<TableHead
												key={headKey}
												className="font-semibold text-primary"
											>
												{item.label}
											</TableHead>
										);
									})}
								</TableRow>
							</TableHeader>
							<TableBody>
								{othersRewardConstant.map((re, reIdx) => {
									const rowKey = `south-row-${re}-${reIdx}`;
									return (
										<TableRow key={rowKey} className="hover:bg-muted/30">
											<TableCell className="font-medium text-center bg-muted/20">
												{rewardConstant[re as keyof typeof rewardConstant]}
											</TableCell>
											{southSchedule.map((sch, schIdx) => {
												const cellKey = `south-cell-${sch.syntax}-${re}-${schIdx}`;
												const item = southReward.find(
													(r) => r?.provinceCode === sch.syntax,
												);
												const val = item ? (item as any)[re] || [] : [];
												return (
													<TableCell key={cellKey} className="text-center">
														<div className="flex flex-col items-center justify-center gap-1.5 py-1">
															{val.length > 0 ? (
																val.map((num: string, numIdx: number) => {
																	const numKey = `south-num-${sch.syntax}-${re}-${num}-${numIdx}`;
																	return (
																		<span
																			key={numKey}
																			className="px-2 py-0.5 bg-secondary/50 rounded text-sm font-medium tracking-wide"
																		>
																			{num}
																		</span>
																	);
																})
															) : (
																<span className="text-muted-foreground text-xs">
																	-
																</span>
															)}
														</div>
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
