import { useEffect, useState } from "react";

export function useDebounce(value: string, delay: number = 500) {
	const [debouncedValue, setDebouncedValue] = useState<string>(value);

	useEffect(() => {
		if (!value) return;
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}
