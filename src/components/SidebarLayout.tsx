import { useLocation } from "@tanstack/react-router";
import { AppSidebar } from "@/components/app-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface SidebarLayoutProps {
	children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
	const location = useLocation();

	const getPageTitle = (pathname: string) => {
		if (pathname === "/dashboard") return "Dashboard";
		if (pathname.startsWith("/demo/start/server-funcs"))
			return "Server Functions";
		if (pathname.startsWith("/demo/start/api-request")) return "API Request";
		if (pathname.startsWith("/demo/start/ssr")) return "SSR Demos";
		return "Page";
	};

	const pageTitle = getPageTitle(location.pathname);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<BreadcrumbLink href="/">TanStack Start</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>{pageTitle}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
