import { ScriptOnce } from "@tanstack/react-router";
import type React from "react";

const themeScript = `(function() {
  try {
    const theme = localStorage.getItem('theme') || 'auto';
    const resolved = theme === 'auto'
      ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;
    document.documentElement.classList.add(resolved);
  } catch (e) {}
})();`;

export function ThemeProvider({
	children,
}: {
	children: Readonly<React.ReactNode>;
}) {
	return (
		<>
			<ScriptOnce children={themeScript} />
			{children}
		</>
	);
}
