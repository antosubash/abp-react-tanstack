"use client";

import * as React from "react";
import { useSidebar } from "./sidebar-context";

export const SidebarRail = React.forwardRef<
	HTMLDivElement,
	React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();

	return (
		<div ref={ref} data-sidebar="rail" className={className} {...props}>
			<button
				type="button"
				onClick={toggleSidebar}
				aria-label="Toggle Sidebar"
				className="absolute top-3 flex h-6 w-6 items-center justify-center rounded-sm bg-slate-800 text-slate-400 transition-all hover:bg-slate-700 hover:text-slate-100 data-[state=collapsed]:rotate-180 data-[side=right]:rotate-0 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
			>
				<svg
					width="16"
					height="16"
					viewBox="0 0 16 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						fill="currentColor"
						d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708 0L8 8.707l-2.646 2.647a.5.5 0 0 1-.708 0M7.293 8l-2.647 2.646a.5.5 0 0 1-.708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708 0z"
					/>
				</svg>
			</button>
		</div>
	);
});
SidebarRail.displayName = "SidebarRail";
