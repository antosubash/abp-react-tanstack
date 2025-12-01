import type { Icon } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubTrigger,
	SidebarMenuSubItem,
	useSidebar,
} from "@/shared/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
		items?: { title: string; url: string }[];
	}[];
}) {
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<Collapsible key={item.title} asChild defaultOpen={false}>
							<SidebarMenuItem>
								{item.items ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton tooltip={item.title}>
												{item.icon && <item.icon className="size-4 shrink-0" />}
												<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
													{item.title}
												</span>
												<ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0 shrink-0" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										{!isCollapsed && (
											<CollapsibleContent>
												<SidebarMenuSub>
													{item.items.map((subItem) => (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubTrigger asChild>
																<Link to={subItem.url}>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubTrigger>
														</SidebarMenuSubItem>
													))}
												</SidebarMenuSub>
											</CollapsibleContent>
										)}
									</>
								) : (
									<SidebarMenuButton asChild tooltip={item.title}>
										<Link to={item.url}>
											{item.icon && <item.icon className="size-4 shrink-0" />}
											<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden">
												{item.title}
											</span>
										</Link>
									</SidebarMenuButton>
								)}
							</SidebarMenuItem>
						</Collapsible>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
