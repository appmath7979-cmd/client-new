import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
	FieldTitle,
} from "#/components/ui/field";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";

export function RadioField({
	onValueChange,
}: {
	onValueChange: (val: "GUEST" | "OWNER") => void;
}) {
	return (
		<RadioGroup
			defaultValue="GUEST"
			onValueChange={onValueChange}
			className="md:grid-cols-2"
		>
			<FieldLabel htmlFor="GUEST-CUSTOMER">
				<Field orientation="horizontal">
					<FieldContent>
						<FieldTitle>Khách</FieldTitle>
						<FieldDescription>Khách hàng gửi tin cho bạn</FieldDescription>
					</FieldContent>
					<RadioGroupItem value="GUEST" id="GUEST-CUSTOMER" />
				</Field>
			</FieldLabel>
			<FieldLabel htmlFor="OWNER_CUSTOMER">
				<Field orientation="horizontal">
					<FieldContent>
						<FieldTitle>Chủ</FieldTitle>
						<FieldDescription>Chủ nhận tin của bạn</FieldDescription>
					</FieldContent>
					<RadioGroupItem value="OWNER" id="OWNER_CUSTOMER" />
				</Field>
			</FieldLabel>
		</RadioGroup>
	);
}
