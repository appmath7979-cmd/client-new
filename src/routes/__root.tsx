import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Header } from "#/components/base/Header";
import { NavList } from "#/components/base/navigation/NavList";
import appCss from "../styles.css?url";
import { AppPropvider } from "#/provider/AppPropvider";
import { getThemeServerFn } from "#/lib/server/theme";
import { ThemeMode } from "#/components/base/ThemeMode";
import { createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

interface RootRouteWithContext {
  theme: "light" | "dark";
  queryClient: QueryClient; // 👈 add this
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
  beforeLoad: async () => ({ theme: await getThemeServerFn() }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AppPropvider>
          <Header />
          <ThemeMode />
          <main className="px-4">{children}</main>
          <NavList />
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
