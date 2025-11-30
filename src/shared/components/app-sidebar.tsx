import {
	IconCode,
	IconDashboard,
	IconFunction,
	IconHome,
	IconInnerShadowTop,
	IconNetwork,
	IconNote,
	IconShield,
	IconUsers,
	IconBuilding,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { NavMain } from "@/shared/components/nav-main";
import { NavUser } from "@/shared/components/nav-user";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
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
	SidebarMenuSubTrigger,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/shared/components/ui/sidebar";

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
		{
			title: "Users",
			url: "/users",
			icon: IconUsers,
		},
		{
			title: "Roles",
			url: "/roles",
			icon: IconShield,
		},
		{
			title: "Tenants",
			url: "/tenants",
			icon: IconBuilding,
		},
	],
	demos: [
		{
			title: "API Client",
			url: "/demo/client",
			icon: IconCode,
		},
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
		<Sidebar data-collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<div className="flex items-center gap-2">
								<IconInnerShadowTop className="!size-5" />
								<span className="text-base font-semibold group-data-[collapsible=icon]:hidden">
									TanStack Start
								</span>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />

				<SidebarGroup>
					<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
						Demos
					</SidebarGroupLabel>
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
														<span className="group-data-[collapsible=icon]:hidden">
															{item.title}
														</span>
														<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
													</SidebarMenuButton>
												</CollapsibleTrigger>
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
											</>
										) : (
											<SidebarMenuButton asChild tooltip={item.title}>
												<Link to={item.url}>
													<item.icon />
													<span className="group-data-[collapsible=icon]:hidden">
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
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
