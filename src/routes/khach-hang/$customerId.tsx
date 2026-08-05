import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/khach-hang/$customerId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/khach-hang/$customerId"!</div>;
}
