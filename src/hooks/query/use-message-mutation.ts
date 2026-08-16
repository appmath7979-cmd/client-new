import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderApi } from "#/apis/order.api";
import type { CreateOrder } from "#/types/api/order.type";

function useCreateMessage(customerId: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateOrder) => orderApi.create(data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["order", customerId] });
			toast.success(data.message);
		},
	});
}

export { useCreateMessage };
