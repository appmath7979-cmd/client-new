interface IValidateStatus {
	message: string;
	status: "success" | "error" | "warning";
}

interface IValidateMessageResult extends IValidateStatus {
	chunks: string[][];
}

export type { IValidateStatus, IValidateMessageResult };
