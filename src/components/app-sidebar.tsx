import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
	IconDashboard,
	IconHome,
	IconInnerShadowTop,
	IconNetwork,
	IconNote,
	IconFunction,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

const data = {
	navMain: [
		{
			title: "Home",
			url: "/",
			icon: IconHome,
		},
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconDashboard,
		},
	],
	demos: [
		{
			title: "Server Functions",
			url: "/demo/start/server-funcs",
			icon: IconFunction,
		},
		{
			title: "API Request",
			url: "/demo/start/api-request",
			icon: IconNetwork,
		},
		{
			title: "SSR Demos",
			url: "/demo/start/ssr",
			icon: IconNote,
			items: [
				{
					title: "SPA Mode",
					url: "/demo/start/ssr/spa-mode",
				},
				{
					title: "Full SSR",
					url: "/demo/start/ssr/full-ssr",
				},
				{
					title: "Data Only",
					url: "/demo/start/ssr/data-only",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<div>
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold">TanStack Start</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />

				<SidebarGroup>
					<SidebarGroupLabel>Demos</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.demos.map((item) => (
								<Collapsible key={item.title} asChild defaultOpen={false}>
									<SidebarMenuItem>
										{item.items ? (
											<>
												<CollapsibleTrigger asChild>
													<SidebarMenuButton tooltip={item.title}>
														<item.icon />
														<span>{item.title}</span>
														<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
													</SidebarMenuButton>
												</CollapsibleTrigger>
												<CollapsibleContent>
													<SidebarMenuSub>
														{item.items.map((subItem) => (
															<SidebarMenuSubItem key={subItem.title}>
																<SidebarMenuSubButton asChild>
																	<Link to={subItem.url}>
																		<span>{subItem.title}</span>
																	</Link>
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</CollapsibleContent>
											</>
										) : (
											<SidebarMenuButton asChild tooltip={item.title}>
												<Link to={item.url}>
													<item.icon />
													<span>{item.title}</span>
												</Link>
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								</Collapsible>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
		</Sidebar>
	);
}
