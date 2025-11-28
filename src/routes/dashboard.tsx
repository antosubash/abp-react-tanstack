import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useId } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	IconCircleCheckFilled,
	IconClock,
	IconTarget,
	IconTrendingUp,
	IconChartBar,
	IconChartPie,
	IconActivity,
	IconBell,
	IconUser,
} from "@tabler/icons-react";
import dashboardData from "../app/dashboard/data.json";
import { DataTable } from "../components/data-table";
import { ProtectedRoute } from "../components/ProtectedRoute";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { type ChartConfig, ChartContainer } from "../components/ui/chart";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { useAuthState } from "../hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
	component: DashboardComponent,
});

interface ProjectTask {
	id: number;
	header: string;
	type: string;
	status: "Done" | "In Process";
	target: string;
	limit: string;
	reviewer: string;
}

const COLORS = {
	done: "#10b981", // green
	inProcess: "#f59e0b", // amber
};

function DashboardComponent() {
	const { user } = useAuthState();
	const gradientId = useId();

	const data = dashboardData as ProjectTask[];

	// Calculate metrics
	const metrics = useMemo(() => {
		const totalTasks = data.length;
		const doneTasks = data.filter((task) => task.status === "Done").length;
		const inProcessTasks = data.filter(
			(task) => task.status === "In Process",
		).length;
		const completionRate = Math.round((doneTasks / totalTasks) * 100);

		// Group by type
		const typeCounts = data.reduce(
			(acc, task) => {
				acc[task.type] = (acc[task.type] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		// Group by reviewer
		const reviewerCounts = data.reduce(
			(acc, task) => {
				acc[task.reviewer] = (acc[task.reviewer] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		return {
			totalTasks,
			doneTasks,
			inProcessTasks,
			completionRate,
			typeCounts,
			reviewerCounts,
		};
	}, [data]);

	// Chart data
	const statusChartData = [
		{ name: "Done", value: metrics.doneTasks, color: COLORS.done },
		{
			name: "In Process",
			value: metrics.inProcessTasks,
			color: COLORS.inProcess,
		},
	];

	const typeChartData = Object.entries(metrics.typeCounts)
		.map(([type, count]) => ({
			type,
			count,
		}))
		.sort((a, b) => b.count - a.count)
		.slice(0, 8); // Top 8 types

	const chartConfig: ChartConfig = {
		done: {
			label: "Done",
			color: COLORS.done,
		},
		inProcess: {
			label: "In Process",
			color: COLORS.inProcess,
		},
	};

	return (
		<ProtectedRoute>
			<div className="w-full bg-background">
				<div className="w-full px-6 py-8">
					{/* Header */}
					<div className="mb-8 flex items-center justify-between">
						<div>
							<h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
							<p className="text-slate-400">
								Welcome back, {user?.name || user?.preferred_username || "User"}
								!
							</p>
						</div>
						<div className="flex items-center gap-4">
							<Button variant="outline" size="sm">
								<IconBell className="w-4 h-4 mr-2" />
								Notifications
								<Badge variant="destructive" className="ml-2">
									3
								</Badge>
							</Button>
							<Avatar>
								<AvatarImage src="" alt={user?.name || "User"} />
								<AvatarFallback>
									<IconUser className="w-4 h-4" />
								</AvatarFallback>
							</Avatar>
						</div>
					</div>

					{/* Metrics Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg text-white">
										Total Tasks
									</CardTitle>
									<IconTarget className="w-5 h-5 text-cyan-400" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-cyan-400 mb-2">
									{metrics.totalTasks}
								</div>
								<div className="flex items-center text-sm text-slate-400">
									<IconTrendingUp className="w-4 h-4 mr-1" />
									<span>All project tasks</span>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg text-white">
										Completed
									</CardTitle>
									<IconCircleCheckFilled className="w-5 h-5 text-green-400" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-green-400 mb-2">
									{metrics.doneTasks}
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-400">
										{Math.round((metrics.doneTasks / metrics.totalTasks) * 100)}
										% of total
									</span>
									<Badge variant="secondary" className="text-green-400">
										+12%
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg text-white">
										In Progress
									</CardTitle>
									<IconClock className="w-5 h-5 text-amber-400" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-amber-400 mb-2">
									{metrics.inProcessTasks}
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-slate-400">
										{Math.round(
											(metrics.inProcessTasks / metrics.totalTasks) * 100,
										)}
										% of total
									</span>
									<Badge variant="secondary" className="text-amber-400">
										Active
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-lg text-white">
										Completion Rate
									</CardTitle>
									<IconChartBar className="w-5 h-5 text-purple-400" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-purple-400 mb-3">
									{metrics.completionRate}%
								</div>
								<Progress value={metrics.completionRate} className="mb-2" />
								<div className="flex items-center text-sm text-slate-400">
									<IconTrendingUp className="w-4 h-4 mr-1 text-green-400" />
									<span>+5.2% from last month</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
						{/* Status Distribution Pie Chart */}
						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-white flex items-center gap-2">
											<IconChartPie className="w-5 h-5 text-cyan-400" />
											Task Status Distribution
										</CardTitle>
										<CardDescription className="text-slate-400">
											Overview of completed vs in-progress tasks
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<ChartContainer config={chartConfig} className="h-[300px]">
									<PieChart>
										<Pie
											data={statusChartData}
											cx="50%"
											cy="50%"
											outerRadius={100}
											dataKey="value"
											label={({ name, percent }) =>
												`${name}: ${(percent * 100).toFixed(0)}%`
											}
											labelLine={false}
										>
											{statusChartData.map((entry, _index) => (
												<Cell
													key={`cell-${entry.name}`}
													fill={entry.color}
													stroke="#1e293b"
													strokeWidth={2}
												/>
											))}
										</Pie>
										<Tooltip
											contentStyle={{
												backgroundColor: "#1e293b",
												border: "1px solid #374151",
												borderRadius: "8px",
												color: "#f1f5f9",
											}}
											labelStyle={{ color: "#f1f5f9" }}
										/>
									</PieChart>
								</ChartContainer>
								{/* Legend */}
								<div className="flex justify-center gap-6 mt-4">
									{statusChartData.map((entry) => (
										<div key={entry.name} className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: entry.color }}
											/>
											<span className="text-sm text-slate-400">
												{entry.name} ({entry.value})
											</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Type Distribution Bar Chart */}
						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div>
										<CardTitle className="text-white flex items-center gap-2">
											<IconChartBar className="w-5 h-5 text-purple-400" />
											Task Types Distribution
										</CardTitle>
										<CardDescription className="text-slate-400">
											Number of tasks by type (top 8)
										</CardDescription>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<ChartContainer config={chartConfig} className="h-[300px]">
									<BarChart
										data={typeChartData}
										margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
										<XAxis
											dataKey="type"
											stroke="#9ca3af"
											fontSize={12}
											angle={-45}
											textAnchor="end"
											height={80}
											interval={0}
										/>
										<YAxis stroke="#9ca3af" />
										<Tooltip
											contentStyle={{
												backgroundColor: "#1e293b",
												border: "1px solid #374151",
												borderRadius: "8px",
												color: "#f1f5f9",
											}}
											labelStyle={{ color: "#f1f5f9" }}
											formatter={(value, _name) => [value, "Count"]}
										/>
										<Bar
											dataKey="count"
											fill={`url(#${gradientId})`}
											radius={[4, 4, 0, 0]}
											stroke="#06b6d4"
											strokeWidth={1}
										/>
										<defs>
											<linearGradient
												id={gradientId}
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="#06b6d4"
													stopOpacity={0.8}
												/>
												<stop
													offset="95%"
													stopColor="#06b6d4"
													stopOpacity={0.3}
												/>
											</linearGradient>
										</defs>
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>
					</div>

					{/* Recent Activity */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
						{/* Activity Timeline */}
						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors lg:col-span-2">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<IconActivity className="w-5 h-5 text-green-400" />
									Recent Activity
								</CardTitle>
								<CardDescription className="text-slate-400">
									Latest updates and task changes
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div className="flex gap-4">
										<div className="flex flex-col items-center">
											<div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
											<div className="w-px h-12 bg-slate-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<Avatar className="w-6 h-6">
													<AvatarFallback className="text-xs">
														EL
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-medium text-white">
													Eddie Lake
												</span>
												<span className="text-xs text-slate-400">
													2 hours ago
												</span>
											</div>
											<p className="text-sm text-slate-300">
												Completed task: "Executive summary" and moved to review
											</p>
											<Badge
												variant="secondary"
												className="text-green-400 mt-1"
											>
												Completed
											</Badge>
										</div>
									</div>

									<div className="flex gap-4">
										<div className="flex flex-col items-center">
											<div className="w-2 h-2 bg-amber-400 rounded-full" />
											<div className="w-px h-12 bg-slate-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<Avatar className="w-6 h-6">
													<AvatarFallback className="text-xs">
														JT
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-medium text-white">
													Jamik Tashpulatov
												</span>
												<span className="text-xs text-slate-400">
													4 hours ago
												</span>
											</div>
											<p className="text-sm text-slate-300">
												Updated progress on "Technical approach" - 85% complete
											</p>
											<Badge
												variant="secondary"
												className="text-amber-400 mt-1"
											>
												In Progress
											</Badge>
										</div>
									</div>

									<div className="flex gap-4">
										<div className="flex flex-col items-center">
											<div className="w-2 h-2 bg-blue-400 rounded-full" />
											<div className="w-px h-12 bg-slate-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<Avatar className="w-6 h-6">
													<AvatarFallback className="text-xs">
														MC
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-medium text-white">
													Maya Johnson
												</span>
												<span className="text-xs text-slate-400">
													6 hours ago
												</span>
											</div>
											<p className="text-sm text-slate-300">
												Assigned reviewer for "System Architecture Overview"
											</p>
											<Badge variant="secondary" className="text-blue-400 mt-1">
												Assigned
											</Badge>
										</div>
									</div>

									<div className="flex gap-4">
										<div className="flex flex-col items-center">
											<div className="w-2 h-2 bg-purple-400 rounded-full" />
											<div className="w-px h-0 bg-slate-600" />
										</div>
										<div className="flex-1">
											<div className="flex items-center gap-2 mb-1">
												<Avatar className="w-6 h-6">
													<AvatarFallback className="text-xs">
														RC
													</AvatarFallback>
												</Avatar>
												<span className="text-sm font-medium text-white">
													Carlos Rodriguez
												</span>
												<span className="text-xs text-slate-400">
													8 hours ago
												</span>
											</div>
											<p className="text-sm text-slate-300">
												Created new task: "Risk Management Plan"
											</p>
											<Badge
												variant="secondary"
												className="text-purple-400 mt-1"
											>
												Created
											</Badge>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Quick Stats */}
						<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
							<CardHeader>
								<CardTitle className="text-white flex items-center gap-2">
									<IconTrendingUp className="w-5 h-5 text-cyan-400" />
									Quick Stats
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-400">
											Tasks this week
										</span>
										<Badge variant="outline">+12</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-400">
											Completed today
										</span>
										<Badge variant="outline" className="text-green-400">
											3
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-400">
											Overdue tasks
										</span>
										<Badge variant="outline" className="text-red-400">
											2
										</Badge>
									</div>
									<Separator className="my-3" />
									<div className="flex items-center justify-between">
										<span className="text-sm text-slate-400">Team members</span>
										<div className="flex -space-x-2">
											<Avatar className="w-6 h-6 border-2 border-slate-800">
												<AvatarFallback className="text-xs">EL</AvatarFallback>
											</Avatar>
											<Avatar className="w-6 h-6 border-2 border-slate-800">
												<AvatarFallback className="text-xs">JT</AvatarFallback>
											</Avatar>
											<Avatar className="w-6 h-6 border-2 border-slate-800">
												<AvatarFallback className="text-xs">MJ</AvatarFallback>
											</Avatar>
											<div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center">
												<span className="text-xs text-slate-300">+3</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Data Table */}
					<Card className="bg-slate-800/50 border-slate-700">
						<CardHeader>
							<CardTitle className="text-white">Project Tasks</CardTitle>
							<CardDescription className="text-slate-400">
								Complete overview of all project tasks and their current status
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DataTable data={data} />
						</CardContent>
					</Card>
				</div>
			</div>
		</ProtectedRoute>
	);
}
