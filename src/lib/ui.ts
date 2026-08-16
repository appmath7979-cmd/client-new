import {
	createCollection,
	localStorageCollectionOptions,
} from "@tanstack/react-db";

interface UIPreference {
	id: string;
	theme: "light" | "dark";
}

const collections = createCollection<UIPreference, string>(
	localStorageCollectionOptions({
		id: "ui-pref",
		storageKey: "app-ui-pref",
		getKey: (item) => item.id,
	}),
);

export { collections };
