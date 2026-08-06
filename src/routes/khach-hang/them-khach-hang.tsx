import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { Award, RotateCcwIcon, SendIcon, Settings2, User } from "lucide-react";
import { RadioField } from "#/components/customer/create/RadioField";
import { TextField } from "#/components/customer/create/TextField";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Switch } from "#/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { customerData } from "#/data/create-customer.data";
import { regions } from "#/data/region.data";
import { CreateCustomerSchema } from "#/schema/create-customer.schema";

export const Route = createFileRoute("/khach-hang/them-khach-hang")({
	staticData: { title: "Thêm khách hàng", isShowBack: true },
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm({
		defaultValues: customerData,
		validators: { onChange: CreateCustomerSchema },
		onSubmit: ({ value }) => {
			console.log(value);
		},
	});

	return (
		<div className="max-w-xl mx-auto py-8 px-4">
			{/* Tiêu đề trang */}
			<div className="mb-6 text-center space-y-1">
				<h1 className="text-2xl font-bold uppercase tracking-tight text-primary">
					Thêm khách hàng mới
				</h1>
				<p className="text-xs text-muted-foreground">
					Thiết lập thông tin tài khoản và cấu hình tỷ lệ cược chi tiết
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-5"
			>
				{/* Phần 1: Thông tin cá nhân */}
				<Card className="shadow-none border border-border/60">
					<CardContent>
						<div className="flex items-center gap-2 pb-2 border-b border-border/40 text-primary font-semibold text-sm">
							<User className="size-4" />
							<span>Thông tin chung</span>
						</div>

						<FieldGroup className="space-y-4">
							<form.Field name="fullName">
								{({ name, state, handleChange }) => {
									const { value, meta } = state;
									return (
										<TextField
											id={name}
											label="Họ và tên"
											placeholder="Nguyen Van A..."
											value={value}
											onChange={(e) => handleChange(e.target.value)}
											error={
												meta.isDirty && meta.errors[0]
													? meta.errors[0].message
													: ""
											}
										/>
									);
								}}
							</form.Field>

							<form.Field name="phoneNumber">
								{({ name, state, handleChange }) => {
									const { value, meta } = state;
									return (
										<TextField
											id={name}
											label="Số điện thoại"
											type="tel"
											placeholder="Số điện thoại..."
											value={value}
											onChange={(e) => handleChange(e.target.value)}
											error={
												meta.isDirty && meta.errors[0]
													? meta.errors[0].message
													: ""
											}
										/>
									);
								}}
							</form.Field>

							<form.Field name="type">
								{({ handleChange }) => (
									<RadioField onValueChange={handleChange} />
								)}
							</form.Field>
						</FieldGroup>
					</CardContent>
				</Card>

				{/* Phần 2: Thiết lập Tỷ lệ theo Vùng Miền */}
				<Card className="shadow-none border border-border/60">
					<CardContent>
						<div className="flex items-center gap-2 pb-2 border-b border-border/40 text-primary font-semibold text-sm">
							<Settings2 className="size-4" />
							<span>Cấu hình tỷ lệ theo miền</span>
						</div>

						<form.Field name="settings">
							{() => (
								<Tabs defaultValue={regions[0].value} className="w-full">
									<TabsList className="w-full grid grid-cols-3 h-9 bg-muted/50 p-1 mb-4">
										{regions.map((region) => (
											<TabsTrigger
												key={`${region.id}-tab-trigger`}
												value={region.value}
												className="text-xs font-medium"
											>
												{region.label}
											</TabsTrigger>
										))}
									</TabsList>

									{regions.map((region) => (
										<TabsContent
											key={`${region.id}-tab-content`}
											value={region.value}
											className="space-y-3 mt-0"
										>
											<form.Subscribe
												selector={(state) => state.values.settings}
											>
												{(settings) =>
													settings.map((settingItem, index) => {
														const itemKey = settingItem.name;
														const itemLabel = itemKey;
														const cValue = settingItem.c[region.value];
														const tValue = settingItem.t[region.value];

														return (
															<div
																key={itemKey}
																className="p-3 rounded-lg border border-border/40 bg-secondary/20 space-y-3"
															>
																<div className="flex justify-between items-center">
																	<span className="text-xs font-bold uppercase tracking-wider text-primary">
																		{itemLabel}
																	</span>
																	<div className="flex items-center gap-2">
																		<Label
																			htmlFor={`switch-${itemKey}-${region.id}`}
																			className="text-xs text-muted-foreground"
																		>
																			{settingItem.type === "tile"
																				? "Tỉ lệ"
																				: "Thành tiền"}
																		</Label>
																		<Switch
																			id={`switch-${itemKey}-${region.id}`}
																			checked={settingItem.type === "thanhtien"}
																			onCheckedChange={(checked) => {
																				const updatedSettings = [
																					...form.getFieldValue("settings"),
																				];
																				if (updatedSettings[index]) {
																					updatedSettings[index] = {
																						...updatedSettings[index],
																						type: checked
																							? "thanhtien"
																							: "tile",
																					};
																					form.setFieldValue(
																						"settings",
																						updatedSettings,
																					);
																				}
																			}}
																		/>
																	</div>
																</div>

																<div className="grid grid-cols-2 gap-3">
																	<div className="space-y-1.5">
																		<Label className="text-xs text-muted-foreground">
																			Cò
																		</Label>
																		<Input
																			type="number"
																			value={cValue}
																			onChange={(e) => {
																				const val =
																					parseFloat(e.target.value) || 0;
																				const updatedSettings = [
																					...form.getFieldValue("settings"),
																				];
																				if (updatedSettings[index]) {
																					updatedSettings[index] = {
																						...updatedSettings[index],
																						c: {
																							...updatedSettings[index].c,
																							[region.value]: val,
																						},
																					};
																					form.setFieldValue(
																						"settings",
																						updatedSettings,
																					);
																				}
																			}}
																		/>
																	</div>

																	<div className="space-y-1.5">
																		<Label className="text-xs text-muted-foreground">
																			Trúng
																		</Label>
																		<Input
																			type="number"
																			value={tValue}
																			onChange={(e) => {
																				const val =
																					parseFloat(e.target.value) || 0;
																				const updatedSettings = [
																					...form.getFieldValue("settings"),
																				];
																				if (updatedSettings[index]) {
																					updatedSettings[index] = {
																						...updatedSettings[index],
																						t: {
																							...updatedSettings[index].t,
																							[region.value]: val,
																						},
																					};
																					form.setFieldValue(
																						"settings",
																						updatedSettings,
																					);
																				}
																			}}
																		/>
																	</div>
																</div>
															</div>
														);
													})
												}
											</form.Subscribe>
										</TabsContent>
									))}
								</Tabs>
							)}
						</form.Field>
					</CardContent>
				</Card>
				<Card className="shadow-none border border-border/60">
					<CardContent>
						<div className="flex items-center gap-2 pb-2 border-b border-border/40 text-primary font-semibold text-sm">
							<Award className="size-4" />
							<span>Tùy chọn trúng Đá Xiên</span>
						</div>

						<div className="space-y-4">
							<form.Field name="daxt">
								{({ handleChange }) => (
									<RadioGroup
										defaultValue="KY_RUOI"
										className="md:grid-cols-3"
										onValueChange={(val) =>
											handleChange(val as "MOT_LAN" | "NHIEU_CAP" | "KY_RUOI")
										}
									>
										<Field orientation={"horizontal"}>
											<RadioGroupItem value="MOT_LAN" id="mot-lan" />
											<FieldLabel htmlFor="mot-lan" className="font-normal">
												1 lần
											</FieldLabel>
										</Field>
										<Field orientation={"horizontal"}>
											<RadioGroupItem value="KY_RUOI" id="ky-ruoi" />
											<FieldLabel htmlFor="ky-ruoi" className="font-normal">
												ky rưỡi
											</FieldLabel>
										</Field>
										<Field orientation={"horizontal"}>
											<RadioGroupItem value="NHIEU_CAP" id="nhieu-cap" />
											<FieldLabel htmlFor="nhieu-cap" className="font-normal">
												nhiều cặp
											</FieldLabel>
										</Field>
									</RadioGroup>
								)}
							</form.Field>
						</div>
					</CardContent>
				</Card>

				{/* Thanh hành động cuối form */}
				<div className="flex items-center gap-3 pt-2 py-12">
					<Button
						variant="outline"
						size="default"
						type="reset"
						className="flex-1"
						onClick={(event) => {
							event.preventDefault();
							form.reset();
						}}
					>
						<RotateCcwIcon className="w-4 h-4 mr-2" />
						<span>Đặt lại</span>
					</Button>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
					>
						{([canSubmit, isSubmitting]) => (
							<Button
								disabled={!canSubmit}
								size="default"
								type="submit"
								className="flex-2"
							>
								<SendIcon className="w-4 h-4 mr-2" />
								<span>{isSubmitting ? "Đang xử lý..." : "Xác nhận tạo"}</span>
							</Button>
						)}
					</form.Subscribe>
				</div>
			</form>
		</div>
	);
}
