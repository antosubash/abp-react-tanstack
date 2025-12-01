import type { Config } from "@measured/puck";

export const puckConfig: Config = {
	components: {
		HeadingBlock: {
			fields: {
				text: {
					type: "text",
					label: "Text",
				},
				level: {
					type: "select",
					label: "Heading Level",
					options: [
						{ label: "H1", value: "1" },
						{ label: "H2", value: "2" },
						{ label: "H3", value: "3" },
						{ label: "H4", value: "4" },
						{ label: "H5", value: "5" },
						{ label: "H6", value: "6" },
					],
				},
			},
			defaultProps: {
				text: "Heading",
				level: "2",
			},
			render: ({ text, level }) => {
				const levelNum = parseInt(level, 10);
				if (levelNum === 1) return <h1>{text}</h1>;
				if (levelNum === 2) return <h2>{text}</h2>;
				if (levelNum === 3) return <h3>{text}</h3>;
				if (levelNum === 4) return <h4>{text}</h4>;
				if (levelNum === 5) return <h5>{text}</h5>;
				return <h6>{text}</h6>;
			},
		},
		TextBlock: {
			fields: {
				text: {
					type: "textarea",
					label: "Text",
				},
			},
			defaultProps: {
				text: "Enter your text here",
			},
			render: ({ text }) => {
				return <p className="mb-4">{text}</p>;
			},
		},
		ButtonBlock: {
			fields: {
				label: {
					type: "text",
					label: "Button Label",
				},
				href: {
					type: "text",
					label: "Link URL",
				},
				variant: {
					type: "select",
					label: "Variant",
					options: [
						{ label: "Default", value: "default" },
						{ label: "Outline", value: "outline" },
						{ label: "Destructive", value: "destructive" },
						{ label: "Secondary", value: "secondary" },
						{ label: "Ghost", value: "ghost" },
						{ label: "Link", value: "link" },
					],
				},
			},
			defaultProps: {
				label: "Click me",
				href: "#",
				variant: "default",
			},
			render: ({ label, href, variant }) => {
				return (
					<a
						href={href}
						className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
							variant === "default"
								? "bg-primary text-primary-foreground hover:bg-primary/90"
								: variant === "outline"
									? "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
									: variant === "destructive"
										? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
										: variant === "secondary"
											? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
											: variant === "ghost"
												? "hover:bg-accent hover:text-accent-foreground"
												: "text-primary underline-offset-4 hover:underline"
						}`}
					>
						{label}
					</a>
				);
			},
		},
		ImageBlock: {
			fields: {
				src: {
					type: "text",
					label: "Image URL",
				},
				alt: {
					type: "text",
					label: "Alt Text",
				},
				width: {
					type: "number",
					label: "Width",
				},
				height: {
					type: "number",
					label: "Height",
				},
			},
			defaultProps: {
				src: "",
				alt: "Image",
				width: 800,
				height: 600,
			},
			render: ({ src, alt, width, height }) => {
				if (!src) {
					return (
						<div className="flex items-center justify-center p-8 border border-dashed text-muted-foreground">
							No image URL provided
						</div>
					);
				}
				return (
					<img
						src={src}
						alt={alt}
						width={width}
						height={height}
						className="max-w-full h-auto"
					/>
				);
			},
		},
	},
};

export const defaultPuckData = {
	content: [],
	root: { props: {} },
};
