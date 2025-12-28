import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Data } from "@measured/puck";
import { ErrorBoundary } from "@/shared/components/error-boundary";
import { puckConfig, defaultPuckData } from "../config/puck-config";
import { PAGE_BUTTON_LABELS } from "../constants";

// Lazy load Puck editor to reduce initial bundle size (~180KB)
const Puck = lazy(() =>
	import("@measured/puck").then((module) => {
		// Also import the CSS
		import("@measured/puck/puck.css");
		return { default: module.Puck };
	})
);

interface PuckEditorProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function PuckEditor({ value, onChange, disabled }: PuckEditorProps) {
	const [puckData, setPuckData] = useState<Data>(defaultPuckData);
	const lastSerializedRef = useRef<string>("");
	const onChangeRef = useRef(onChange);

	// Keep onChange ref up to date
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	// Parse initial value from JSON string to Puck data
	useEffect(() => {
		// Skip if value hasn't actually changed
		if (value === lastSerializedRef.current) {
			return;
		}

		if (value) {
			try {
				const parsed = JSON.parse(value);
				if (
					parsed &&
					typeof parsed === "object" &&
					"content" in parsed &&
					"root" in parsed
				) {
					// Create a new object reference to ensure React detects the change
					const newPuckData = {
						content: Array.isArray(parsed.content) ? [...parsed.content] : [],
						root: { ...parsed.root },
					};
					setPuckData(newPuckData);
					lastSerializedRef.current = value;
				} else {
					const defaultSerialized = JSON.stringify(defaultPuckData);
					setPuckData({ ...defaultPuckData });
					lastSerializedRef.current = defaultSerialized;
					if (value !== defaultSerialized) {
						onChangeRef.current(defaultSerialized);
					}
				}
			} catch {
				const defaultSerialized = JSON.stringify(defaultPuckData);
				setPuckData({ ...defaultPuckData });
				lastSerializedRef.current = defaultSerialized;
				if (value !== defaultSerialized) {
					onChangeRef.current(defaultSerialized);
				}
			}
		} else {
			const defaultSerialized = JSON.stringify(defaultPuckData);
			setPuckData({ ...defaultPuckData });
			lastSerializedRef.current = defaultSerialized;
			onChangeRef.current(defaultSerialized);
		}
	}, [value]);

	const handleSave = (data: Data) => {
		// Create a new object reference to ensure state update
		const newPuckData = {
			content: Array.isArray(data.content) ? [...data.content] : [],
			root: { ...data.root },
		};
		setPuckData(newPuckData);
		const jsonString = JSON.stringify(data);
		lastSerializedRef.current = jsonString;
		onChangeRef.current(jsonString);
	};

	// Update publish button text to "Save" after render
	useEffect(() => {
		if (disabled) return;

		const updateButtonText = () => {
			const editor = document.querySelector('[data-testid="puck-editor"]');
			if (!editor) return;

			// Find all buttons in the Puck header
			const buttons = editor.querySelectorAll("button");
			buttons.forEach((button) => {
				if (button.textContent?.trim() === "Publish") {
					button.textContent = PAGE_BUTTON_LABELS.SAVE;
				}
			});
		};

		// Update immediately and after a short delay to catch dynamically rendered buttons
		updateButtonText();
		const timeoutId = setTimeout(updateButtonText, 100);

		return () => clearTimeout(timeoutId);
	}, [disabled]);

	return (
		<ErrorBoundary
			errorMessage="Failed to load the page editor. Please refresh the page and try again."
			onError={(error, errorInfo) => {
				// Log to error tracking service (e.g., Sentry)
				console.error("Puck Editor Error:", error, errorInfo);
			}}
		>
			<div
				className="border rounded-lg overflow-hidden"
				data-testid="puck-editor"
			>
				{disabled ? (
					<div className="p-8 text-center text-muted-foreground">
						Editor is disabled
					</div>
				) : (
					<Suspense fallback={<PuckEditorSkeleton />}>
						<Puck
							config={puckConfig}
							data={puckData}
							onChange={(newData) => {
								setPuckData(newData);
								onChangeRef.current(JSON.stringify(newData));
							}}
							onPublish={handleSave}
						/>
					</Suspense>
				)}
			</div>
		</ErrorBoundary>
	);
}

/**
 * Loading skeleton for Puck editor
 * Displays while the Puck library is being lazy loaded
 */
function PuckEditorSkeleton() {
	return (
		<div className="flex h-[600px]" role="status" aria-label="Loading editor">
			{/* Left sidebar skeleton */}
			<div className="w-64 border-r bg-muted/10 p-4 space-y-4">
				<div className="h-8 bg-muted rounded animate-pulse" />
				<div className="space-y-2">
					{[...Array(8)].map((_, i) => (
						<div key={i} className="h-12 bg-muted rounded animate-pulse" />
					))}
				</div>
			</div>

			{/* Main canvas skeleton */}
			<div className="flex-1 p-8 space-y-4">
				<div className="h-12 bg-muted rounded animate-pulse" />
				<div className="h-32 bg-muted rounded animate-pulse" />
				<div className="h-24 bg-muted rounded animate-pulse" />
				<div className="h-40 bg-muted rounded animate-pulse" />
			</div>

			{/* Right sidebar skeleton */}
			<div className="w-80 border-l bg-muted/10 p-4 space-y-4">
				<div className="h-8 bg-muted rounded animate-pulse" />
				<div className="space-y-3">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="space-y-2">
							<div className="h-4 bg-muted rounded animate-pulse w-1/3" />
							<div className="h-10 bg-muted rounded animate-pulse" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
