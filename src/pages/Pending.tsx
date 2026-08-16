import { useEffect, useState } from "react";
import { Progress } from "#/components/ui/progress";
import { Spinner } from "#/components/ui/spinner";

export function Pending() {
	const [progress, setProgress] = useState<number>(13);

	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 90) return 90;
				const diff = Math.random() * 15;
				return Math.min(prev + diff, 90);
			});
		}, 300);

		return () => clearInterval(timer);
	}, []);

	return (
		<div className="relative flex h-[calc(100dvh-132px)] w-full items-center justify-center overflow-hidden bg-linear-to-br from-background via-muted/30 to-background">
			{/* Hiệu ứng nền trang trí mờ ảo (Glow effects) */}
			<div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl pointer-events-none animate-pulse" />
			<div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none animate-pulse [animation-delay:1000ms]" />

			{/* Card chứa nội dung */}
			<div className="relative z-10 flex flex-col items-center justify-center gap-6 rounded-2xl border border-border/50 bg-card/60 px-8 py-10 shadow-xl backdrop-blur-xl transition-all duration-300">
				{/* Spinner với hiệu ứng glow nhẹ phía sau */}
				<div className="relative">
					<div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
					<Spinner className="relative size-14 text-primary" />
				</div>

				{/* Phần chữ thông báo */}
				<div className="flex flex-col items-center gap-1.5 text-center">
					<h3 className="font-semibold text-foreground tracking-tight text-lg">
						Đang tải dữ liệu
					</h3>
					<p className="text-sm text-muted-foreground">
						Vui lòng đợi trong giây lát...
					</p>
				</div>

				<Progress value={progress} />
			</div>
		</div>
	);
}
