import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

const storageKey = "app-theme";

const getThemeServerFn = createServerFn().handler(
	() => (getCookie(storageKey) ?? "light") as Theme,
);

const setThemeValidator = z.enum(["light", "dark"]);
type Theme = z.infer<typeof setThemeValidator>;

const setThemeServerFn = createServerFn()
	.validator((data: Theme) => data)
	.handler(({ data }) => setCookie(storageKey, data));

export { getThemeServerFn, setThemeServerFn, type Theme };
