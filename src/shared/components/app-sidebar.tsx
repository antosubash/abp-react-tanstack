import {
	IconBuilding,
	IconCode,
	IconDashboard,
	IconFunction,
	IconHome,
	IconInnerShadowTop,
	IconNetwork,
	IconNote,
	IconSettings,
	IconShield,
	IconUsers,
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
	SidebarMenuSubItem,
	SidebarMenuSubTrigger,
	SidebarRail,
	useSidebar,
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
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
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
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";

	return (
		<Sidebar {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							tooltip="TanStack Start"
							className="data-[slot=sidebar-menu-button]:!p-1.5 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-2"
						>
							<div className="flex items-center gap-2 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
								<IconInnerShadowTop className="!size-5 shrink-0" />
								<span className="text-base font-semibold group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
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
					<SidebarGroupLabel className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:opacity-0">
						Demos
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{data.demos.map((item) => (
								<Collapsible key={item.title} asChild defaultOpen={false}>
									<SidebarMenuItem>
										{item.items ? (
											<>
												<div className="relative flex items-center group/nav-item">
													<SidebarMenuButton
														asChild
														tooltip={item.title}
														className="flex-1"
													>
														<Link to={item.url}>
															<item.icon className="size-4 shrink-0" />
															<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
																{item.title}
															</span>
														</Link>
													</SidebarMenuButton>
													<CollapsibleTrigger asChild>
														<button
															type="button"
															className="absolute right-2 p-1 hover:bg-sidebar-accent rounded-sm group-data-[collapsible=icon]:hidden"
														>
															<ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 shrink-0" />
														</button>
													</CollapsibleTrigger>
												</div>
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
													<item.icon className="size-4 shrink-0" />
													<span className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-0">
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
