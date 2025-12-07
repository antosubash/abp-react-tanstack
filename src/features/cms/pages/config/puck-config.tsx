import type { Config } from "@measured/puck";

// Import individual components
import { HeadingBlock } from "./components/heading-block";
import { TextBlock } from "./components/text-block";
import { ButtonBlock } from "./components/button-block";
import { ImageBlock } from "./components/image-block";
import { CardBlock } from "./components/card-block";
import { ListBlock } from "./components/list-block";
import { QuoteBlock } from "./components/quote-block";
import { VideoBlock } from "./components/video-block";
import { DividerBlock } from "./components/divider-block";
import { ContainerBlock } from "./components/container-block";
import { GridBlock } from "./components/grid-block";
import { FormBlock } from "./components/form-block";
import { WelcomeBlock } from "./components/welcome-block";
import { SpacerBlock } from "./components/spacer-block";
import { HeroBlock } from "./components/hero-block";
import { TestimonialBlock } from "./components/testimonial-block";
import { CarouselBlock } from "./components/carousel-block";
import { TableBlock } from "./components/table-block";
import { GalleryBlock } from "./components/gallery-block";

export const puckConfig: Config = {
	components: {
		// Basic components
		HeadingBlock,
		TextBlock,
		ButtonBlock,
		ImageBlock,

		// Content components
		CardBlock,
		ListBlock,
		QuoteBlock,
		WelcomeBlock,
		SpacerBlock,
		TestimonialBlock,
		CarouselBlock,
		TableBlock,
		GalleryBlock,

		// Map 'Hero' to HeroBlock as per JSON requirements
		Hero: HeroBlock,

		// Media components
		VideoBlock,

		// Layout components
		DividerBlock,
		ContainerBlock,
		GridBlock,

		// Form components
		FormBlock,
	},
};

export const defaultPuckData = {
	content: [],
	root: { props: {} },
};
