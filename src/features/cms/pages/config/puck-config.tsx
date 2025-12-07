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
