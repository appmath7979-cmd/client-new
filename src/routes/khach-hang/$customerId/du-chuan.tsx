import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/khach-hang/$customerId/du-chuan")({
  staticData: { isShowBack: true },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/khach-hang/$customerId/du-chuan"!</div>;
}
