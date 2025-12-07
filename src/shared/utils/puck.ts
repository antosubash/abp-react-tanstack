// biome-ignore lint/suspicious/noExplicitAny: Puck supports checkbox at runtime but types are missing from the library
export function createCheckboxField(label: string): any {
	return {
		type: "checkbox",
		label,
	};
}
