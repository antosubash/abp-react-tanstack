import { Link } from "@tanstack/react-router";
import {
	ChevronDown,
	ChevronRight,
	Home,
	LogIn,
	LogOut,
	Menu,
	Network,
	SquareFunction,
	StickyNote,
	User,
	X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/use-auth";

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [groupedExpanded, setGroupedExpanded] = useState<
		Record<string, boolean>
	>({});
	const { user, isAuthenticated, isLoading, login, logout } = useAuth();

	return (
		<>
			<header className="p-4 flex items-center justify-between bg-gray-800 text-white shadow-lg">
				<div className="flex items-center">
					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
						aria-label="Open menu"
					>
						<Menu size={24} />
					</button>
					<h1 className="ml-4 text-xl font-semibold">
						<Link to="/">
							<img
								src="/tanstack-word-logo-white.svg"
								alt="TanStack Logo"
								className="h-10"
							/>
						</Link>
					</h1>
				</div>

				{/* User Menu */}
				<div className="flex items-center" data-testid="user-menu">
					{isLoading ? (
						<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
					) : isAuthenticated ? (
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								{user?.picture ? (
									<img
										src={user.picture}
										alt={user.name || "User"}
										className="w-8 h-8 rounded-full"
									/>
								) : (
									<div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center">
										<User size={16} />
									</div>
								)}
								<span className="text-sm font-medium">
									{user?.name || user?.preferred_username || "User"}
								</span>
							</div>
							<button
								type="button"
								onClick={logout}
								className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
								title="Logout"
							>
								<LogOut size={16} />
								<span className="hidden sm:inline">Logout</span>
							</button>
						</div>
					) : (
						<button
							type="button"
							onClick={login}
							className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
							title="Login"
						>
							<LogIn size={16} />
							<span className="hidden sm:inline">Login</span>
						</button>
					)}
				</div>
			</header>

			<aside
				className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<h2 className="text-xl font-bold">Navigation</h2>
					<button
						type="button"
						onClick={() => setIsOpen(false)}
						className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
						aria-label="Close menu"
					>
						<X size={24} />
					</button>
				</div>

				<nav className="flex-1 p-4 overflow-y-auto">
					<Link
						to="/"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Home size={20} />
						<span className="font-medium">Home</span>
					</Link>

					<Link
						to="/dashboard"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<User size={20} />
						<span className="font-medium">Dashboard</span>
					</Link>

					{/* Demo Links Start */}

					<Link
						to="/demo/start/server-funcs"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<SquareFunction size={20} />
						<span className="font-medium">Start - Server Functions</span>
					</Link>

					<Link
						to="/demo/start/api-request"
						onClick={() => setIsOpen(false)}
						className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
						activeProps={{
							className:
								"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
						}}
					>
						<Network size={20} />
						<span className="font-medium">Start - API Request</span>
					</Link>

					<div className="flex flex-row justify-between">
						<Link
							to="/demo/start/ssr"
							onClick={() => setIsOpen(false)}
							className="flex-1 flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
							activeProps={{
								className:
									"flex-1 flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
							}}
						>
							<StickyNote size={20} />
							<span className="font-medium">Start - SSR Demos</span>
						</Link>
						<button
							type="button"
							className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
							onClick={() =>
								setGroupedExpanded((prev) => ({
									...prev,
									StartSSRDemo: !prev.StartSSRDemo,
								}))
							}
						>
							{groupedExpanded.StartSSRDemo ? (
								<ChevronDown size={20} />
							) : (
								<ChevronRight size={20} />
							)}
						</button>
					</div>
					{groupedExpanded.StartSSRDemo && (
						<div className="flex flex-col ml-4">
							<Link
								to="/demo/start/ssr/spa-mode"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
								activeProps={{
									className:
										"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
								}}
							>
								<StickyNote size={20} />
								<span className="font-medium">SPA Mode</span>
							</Link>

							<Link
								to="/demo/start/ssr/full-ssr"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
								activeProps={{
									className:
										"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
								}}
							>
								<StickyNote size={20} />
								<span className="font-medium">Full SSR</span>
							</Link>

							<Link
								to="/demo/start/ssr/data-only"
								onClick={() => setIsOpen(false)}
								className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors mb-2"
								activeProps={{
									className:
										"flex items-center gap-3 p-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition-colors mb-2",
								}}
							>
								<StickyNote size={20} />
								<span className="font-medium">Data Only</span>
							</Link>
						</div>
					)}

					{/* Demo Links End */}
				</nav>
			</aside>
		</>
	);
}
