import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
  ClientOnly,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Header } from "#/components/base/Header";
import { NavList } from "#/components/base/navigation/NavList";
import { AppPropvider } from "#/provider/AppPropvider";
import appCss from "../styles.css?url";
import { ThemeSync } from "#/components/base/ThemeSync";
import { Toaster } from "sonner";

interface RootRouteWithContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouteWithContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Toán học",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <AppPropvider>
          <ClientOnly fallback={null}>
            <ThemeSync />
          </ClientOnly>
          <Header />
          <main className="px-4">{children}</main>
          <NavList />
          <Toaster richColors closeButton />
        </AppPropvider>

        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: "Tanstack Form",
              render: <FormDevtoolsPanel />,
            },
            {
              name: "Tanstack Query",
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
