import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuthState } from "../hooks/use-auth";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { ChartContainer, type ChartConfig } from "../components/ui/chart";
import {
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";
import { DataTable } from "../components/data-table";
import dashboardData from "../app/dashboard/data.json";
import { useMemo } from "react";

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
			<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
				<div className="container mx-auto px-6 py-8">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
						<p className="text-slate-400">
							Welcome back, {user?.name || user?.preferred_username || "User"}!
						</p>
					</div>

					{/* Metrics Cards */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<Card className="bg-slate-800/50 border-slate-700">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg text-white">
									Total Tasks
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-cyan-400">
									{metrics.totalTasks}
								</div>
							</CardContent>
						</Card>

						<Card className="bg-slate-800/50 border-slate-700">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg text-white">Completed</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-green-400">
									{metrics.doneTasks}
								</div>
								<p className="text-sm text-slate-400 mt-1">
									{Math.round((metrics.doneTasks / metrics.totalTasks) * 100)}%
									of total
								</p>
							</CardContent>
						</Card>

						<Card className="bg-slate-800/50 border-slate-700">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg text-white">
									In Progress
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-amber-400">
									{metrics.inProcessTasks}
								</div>
								<p className="text-sm text-slate-400 mt-1">
									{Math.round(
										(metrics.inProcessTasks / metrics.totalTasks) * 100,
									)}
									% of total
								</p>
							</CardContent>
						</Card>

						<Card className="bg-slate-800/50 border-slate-700">
							<CardHeader className="pb-3">
								<CardTitle className="text-lg text-white">
									Completion Rate
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-purple-400">
									{metrics.completionRate}%
								</div>
								<Progress value={metrics.completionRate} className="mt-2" />
							</CardContent>
						</Card>
					</div>

					{/* Charts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
						{/* Status Distribution Pie Chart */}
						<Card className="bg-slate-800/50 border-slate-700">
							<CardHeader>
								<CardTitle className="text-white">
									Task Status Distribution
								</CardTitle>
								<CardDescription className="text-slate-400">
									Overview of completed vs in-progress tasks
								</CardDescription>
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
										>
											{statusChartData.map((entry) => (
												<Cell key={`cell-${entry.name}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ChartContainer>
							</CardContent>
						</Card>

						{/* Type Distribution Bar Chart */}
						<Card className="bg-slate-800/50 border-slate-700">
							<CardHeader>
								<CardTitle className="text-white">
									Task Types Distribution
								</CardTitle>
								<CardDescription className="text-slate-400">
									Number of tasks by type (top 8)
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer config={chartConfig} className="h-[300px]">
									<BarChart data={typeChartData}>
										<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
										<XAxis
											dataKey="type"
											stroke="#9ca3af"
											fontSize={12}
											angle={-45}
											textAnchor="end"
											height={80}
										/>
										<YAxis stroke="#9ca3af" />
										<Tooltip
											contentStyle={{
												backgroundColor: "#1e293b",
												border: "1px solid #374151",
												borderRadius: "8px",
											}}
										/>
										<Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
									</BarChart>
								</ChartContainer>
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
