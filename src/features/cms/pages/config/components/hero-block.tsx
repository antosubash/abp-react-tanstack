import type { ComponentConfig } from "@measured/puck";
import {
	getAlignmentClass,
	getAnimationClass,
	getBackgroundStyle,
	getButtonClass,
	getContentWidthClass,
	getHeightClass,
	getImageWidthClass,
	getPaddingClass,
	getShapeDivider,
	getSubtitleSizeClass,
	getTitleSizeClass,
	getVerticalAlignClass,
} from "./hero-block-helpers";
import { heroBlockFields } from "./hero-block-fields";

export type HeroBlockProps = {
	// Content
	title: string;
	subtitle: string;
	description: string;
	badge: string;
	showBadge: boolean;

	// Buttons
	showButton: boolean;
	buttonText: string;
	buttonLink: string;
	buttonStyle: "default" | "primary" | "secondary" | "outline" | "ghost";
	buttonSize: "sm" | "md" | "lg";
	showSecondaryButton: boolean;
	secondaryButtonText: string;
	secondaryButtonLink: string;
	secondaryButtonStyle:
		| "default"
		| "primary"
		| "secondary"
		| "outline"
		| "ghost";

	// Background
	backgroundType: "color" | "gradient" | "image";
	backgroundColor: string;
	backgroundImage: string;
	gradientFrom: string;
	gradientTo: string;
	gradientDirection:
		| "to-r"
		| "to-br"
		| "to-b"
		| "to-bl"
		| "to-l"
		| "to-tl"
		| "to-t"
		| "to-tr";
	showOverlay: boolean;
	overlayOpacity: number;

	// Layout
	layout: "stacked" | "split" | "centered";
	alignment: "left" | "center" | "right";
	verticalAlign: "top" | "center" | "bottom";
	contentWidth: "narrow" | "medium" | "wide" | "full";
	height: "small" | "medium" | "large" | "full";
	padding: "sm" | "md" | "lg" | "xl";

	// Typography
	titleSize: "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
	subtitleSize: "sm" | "md" | "lg" | "xl";
	textColor: string;

	// Media
	showImage: boolean;
	imageUrl: string;
	imagePosition: "left" | "right";
	imageWidth: "1/3" | "1/2" | "2/3";
	imageRounded: boolean;

	// Features/Stats
	showStats: boolean;
	stats: Array<{
		value: string;
		label: string;
	}>;

	// Effects
	animation:
		| "none"
		| "fade-in"
		| "slide-up"
		| "zoom-in"
		| "slide-in-left"
		| "slide-in-right";
	showScrollIndicator: boolean;

	// Advanced
	preset: "default" | "modern" | "minimal" | "bold" | "startup" | "agency";
	shapeDivider: "none" | "wave" | "curve" | "slant" | "triangle";
};

export const HeroBlock: ComponentConfig<HeroBlockProps> = {
	fields: heroBlockFields,
	render: (props) => {
		// Main render
		return (
			<div
				className={`relative ${getHeightClass(props.height)} ${getAnimationClass(props.animation)} flex ${getVerticalAlignClass(props.verticalAlign)} overflow-hidden`}
				style={getBackgroundStyle(
					props.backgroundType,
					props.backgroundColor,
					props.gradientFrom,
					props.gradientTo,
					props.gradientDirection,
					props.backgroundImage,
				)}
			>
				{/* Overlay */}
				{props.showOverlay && (
					<div
						className="absolute inset-0 bg-black"
						style={{ opacity: props.overlayOpacity }}
					/>
				)}

				{/* Content */}
				<div
					className={`relative z-10 w-full ${getPaddingClass(props.padding)}`}
				>
					<div
						className={`mx-auto ${getContentWidthClass(props.contentWidth)}`}
					>
						{props.layout === "split" && props.showImage ? (
							// Split Layout
							<div
								className={`flex flex-col ${props.imagePosition === "left" ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-12`}
							>
								<div
									className={`flex-1 ${getAlignmentClass(props.alignment)} flex flex-col space-y-6`}
								>
									{props.showBadge && props.badge && (
										<span
											className="inline-block px-4 py-2 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm"
											style={{ color: props.textColor }}
										>
											{props.badge}
										</span>
									)}
									<h1
										className={`${getTitleSizeClass(props.titleSize)} font-bold leading-tight`}
										style={{ color: props.textColor }}
									>
										{props.title}
									</h1>
									{props.subtitle && (
										<p
											className={`${getSubtitleSizeClass(props.subtitleSize)} opacity-90`}
											style={{ color: props.textColor }}
										>
											{props.subtitle}
										</p>
									)}
									{props.description && (
										<p
											className="text-base opacity-80"
											style={{ color: props.textColor }}
										>
											{props.description}
										</p>
									)}

									{/* Buttons */}
									{(props.showButton || props.showSecondaryButton) && (
										<div
											className={`flex flex-wrap gap-4 ${props.alignment === "center" ? "justify-center" : props.alignment === "right" ? "justify-end" : ""}`}
										>
											{props.showButton && props.buttonText && (
												<a
													href={props.buttonLink}
													className={getButtonClass(
														props.buttonStyle,
														props.buttonSize,
													)}
												>
													{props.buttonText}
												</a>
											)}
											{props.showSecondaryButton &&
												props.secondaryButtonText && (
													<a
														href={props.secondaryButtonLink}
														className={getButtonClass(
															props.secondaryButtonStyle,
															props.buttonSize,
														)}
													>
														{props.secondaryButtonText}
													</a>
												)}
										</div>
									)}

									{/* Stats */}
									{props.showStats && props.stats && props.stats.length > 0 && (
										<div
											className={`grid grid-cols-2 md:grid-cols-${Math.min(props.stats.length, 4)} gap-8 pt-8 border-t border-white/20`}
										>
											{props.stats.map((stat) => (
												<div key={`${stat.value}-${stat.label}`}>
													<div
														className="text-3xl font-bold"
														style={{ color: props.textColor }}
													>
														{stat.value}
													</div>
													<div
														className="text-sm opacity-80"
														style={{ color: props.textColor }}
													>
														{stat.label}
													</div>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Side Image */}
								{props.imageUrl && (
									<div
										className={`${getImageWidthClass(props.imageWidth)} w-full`}
									>
										<img
											src={props.imageUrl}
											alt={props.title}
											className={`w-full h-auto shadow-2xl ${props.imageRounded ? "rounded-2xl" : ""}`}
										/>
									</div>
								)}
							</div>
						) : (
							// Stacked/Centered Layout
							<div
								className={`${getAlignmentClass(props.alignment)} flex flex-col space-y-6`}
							>
								{props.showBadge && props.badge && (
									<span
										className="inline-block px-4 py-2 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm w-fit"
										style={{ color: props.textColor }}
									>
										{props.badge}
									</span>
								)}
								<h1
									className={`${getTitleSizeClass(props.titleSize)} font-bold leading-tight`}
									style={{ color: props.textColor }}
								>
									{props.title}
								</h1>
								{props.subtitle && (
									<p
										className={`${getSubtitleSizeClass(props.subtitleSize)} opacity-90 ${props.contentWidth === "narrow" ? "max-w-2xl" : "max-w-3xl"}`}
										style={{ color: props.textColor }}
									>
										{props.subtitle}
									</p>
								)}
								{props.description && (
									<p
										className={`text-base opacity-80 ${props.contentWidth === "narrow" ? "max-w-2xl" : "max-w-3xl"}`}
										style={{ color: props.textColor }}
									>
										{props.description}
									</p>
								)}

								{/* Buttons */}
								{(props.showButton || props.showSecondaryButton) && (
									<div
										className={`flex flex-wrap gap-4 ${props.alignment === "center" ? "justify-center" : props.alignment === "right" ? "justify-end" : ""}`}
									>
										{props.showButton && props.buttonText && (
											<a
												href={props.buttonLink}
												className={getButtonClass(
													props.buttonStyle,
													props.buttonSize,
												)}
											>
												{props.buttonText}
											</a>
										)}
										{props.showSecondaryButton && props.secondaryButtonText && (
											<a
												href={props.secondaryButtonLink}
												className={getButtonClass(
													props.secondaryButtonStyle,
													props.buttonSize,
												)}
											>
												{props.secondaryButtonText}
											</a>
										)}
									</div>
								)}

								{/* Stats */}
								{props.showStats && props.stats && props.stats.length > 0 && (
									<div
										className={`grid grid-cols-2 md:grid-cols-${Math.min(props.stats.length, 4)} gap-8 pt-8 mt-8 border-t border-white/20 ${props.contentWidth === "narrow" ? "max-w-2xl" : "max-w-3xl"}`}
									>
										{props.stats.map((stat) => (
											<div
												key={`${stat.value}-${stat.label}`}
												className={
													props.alignment === "center" ? "text-center" : ""
												}
											>
												<div
													className="text-3xl font-bold"
													style={{ color: props.textColor }}
												>
													{stat.value}
												</div>
												<div
													className="text-sm opacity-80"
													style={{ color: props.textColor }}
												>
													{stat.label}
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Scroll Indicator */}
				{props.showScrollIndicator && (
					<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke={props.textColor}
							viewBox="0 0 24 24"
							aria-label="Scroll down indicator"
							role="img"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 14l-7 7m0 0l-7-7m7 7V3"
							/>
						</svg>
					</div>
				)}

				{/* Shape Divider */}
				{getShapeDivider(props.shapeDivider, props.textColor)}
			</div>
		);
	},
	defaultProps: {
		// Content
		title: "Build Something Amazing",
		subtitle: "Create stunning experiences with our powerful platform",
		description: "",
		badge: "New",
		showBadge: false,

		// Buttons
		showButton: true,
		buttonText: "Get Started",
		buttonLink: "#",
		buttonStyle: "primary",
		buttonSize: "lg",
		showSecondaryButton: true,
		secondaryButtonText: "Learn More",
		secondaryButtonLink: "#",
		secondaryButtonStyle: "outline",

		// Background
		backgroundType: "gradient",
		backgroundColor: "#1f2937",
		backgroundImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop",
		gradientFrom: "#3b82f6",
		gradientTo: "#8b5cf6",
		gradientDirection: "to-br",
		showOverlay: false,
		overlayOpacity: 0.4,

		// Layout
		layout: "stacked",
		alignment: "center",
		verticalAlign: "center",
		contentWidth: "medium",
		height: "large",
		padding: "md",

		// Typography
		titleSize: "6xl",
		subtitleSize: "lg",
		textColor: "#ffffff",

		// Media
		showImage: false,
		imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
		imagePosition: "right",
		imageWidth: "1/2",
		imageRounded: true,

		// Stats
		showStats: false,
		stats: [
			{ value: "10K+", label: "Active Users" },
			{ value: "50+", label: "Countries" },
			{ value: "99.9%", label: "Uptime" },
		],

		// Effects
		animation: "fade-in",
		showScrollIndicator: false,

		// Advanced
		preset: "default",
		shapeDivider: "none",
	},
};
