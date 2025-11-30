import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import dashboardData from "../data/data.json";
import { DataTable, type DataTableSchema } from "./data-table";
import { ProtectedRoute } from "../../auth/components/protected-route";
import { Button } from "@/shared/components/ui/button";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/shared/components/ui/avatar";
import { useAuth } from "../../auth/hooks/use-auth";
import { DashboardMetrics } from "./dashboard-metrics";
import { DashboardCharts } from "./dashboard-charts";
import { DashboardActivity } from "./dashboard-activity";
import { Badge } from "@/shared/components/ui/badge";

// Type assertion for dashboardData
const typedDashboardData = dashboardData as DataTableSchema[];

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
});

export default function Dashboard() {
	const { authState } = useAuth();
	const { user } = authState;

	// Calculate metrics from the data
	const metrics = useMemo(() => {
		const totalTasks = typedDashboardData.length;
		const doneTasks = typedDashboardData.filter(
			(task) => task.status === "Done",
		).length;
		const inProcessTasks = typedDashboardData.filter(
			(task) => task.status === "In Process",
		).length;
		const completionRate = totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

		return {
			totalTasks,
			doneTasks,
			inProcessTasks,
			completionRate,
		};
	}, []);

	// Prepare data for charts
	const statusChartData = useMemo(
		() => [
			{
				name: "Completed",
				value: metrics.doneTasks,
				color: "#10b981",
			},
			{
				name: "In Progress",
				value: metrics.inProcessTasks,
				color: "#f59e0b",
			},
		],
		[metrics.doneTasks, metrics.inProcessTasks],
	);

	const typeChartData = useMemo(() => {
		const typeCount: Record<string, number> = {};
		typedDashboardData.forEach((task) => {
			typeCount[task.type] = (typeCount[task.type] || 0) + 1;
		});

		return Object.entries(typeCount).map(([type, count]) => ({
			type,
			count,
		}));
	}, []);

	// Prepare data for activity timeline
	const recentActivity = useMemo(() => {
		// Get 5 most recently updated tasks (Done tasks get fake completion dates)
		return typedDashboardData
			.filter((task) => task.status === "Done")
			.slice(0, 5)
			.map((task, index) => ({
				id: index,
				user: task.reviewer || "Unknown",
				action: "Completed task",
				target: task.header,
				time: new Date(
					Date.now() - index * 24 * 60 * 60 * 1000,
				).toLocaleDateString(), // Fake recent dates
				avatar: (task.reviewer || "Unknown")
					.split(" ")
					.map((n: string) => n[0])
					.join("")
					.toUpperCase(),
			}));
	}, []);

	// Prepare data for team members
	const teamMembers = useMemo(() => {
		const memberMap: Record<
			string,
			{
				name: string;
				tasksCompleted: number;
			}
		> = {};

		typedDashboardData.forEach((task) => {
			const reviewer = task.reviewer || "Unknown";

			if (!memberMap[reviewer]) {
				memberMap[reviewer] = {
					name: reviewer,
					tasksCompleted: 0,
				};
			}

			if (task.status === "Done") {
				memberMap[reviewer].tasksCompleted++;
			}
		});

		return Object.entries(memberMap).map(([name, data], index) => ({
			id: index,
			name,
			avatar: name
				.split(" ")
				.map((n: string) => n[0])
				.join("")
				.toUpperCase(),
			role: "Developer",
			status: (index % 3 === 0
				? "online"
				: index % 3 === 1
					? "away"
					: "offline") as "online" | "away" | "offline",
			tasksCompleted: data.tasksCompleted,
		}));
	}, []);

	return (
		<ProtectedRoute>
			<div
				className="min-h-screen text-slate-100 p-6"
				data-testid="dashboard-content"
			>
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-white mb-2">
							Project Dashboard
						</h1>
						<p className="text-slate-400">
							Track your project progress and team performance
						</p>
					</div>
					<div className="flex items-center gap-4">
						<Button
							variant="outline"
							size="sm"
							className="border-slate-600 text-slate-300 hover:bg-slate-700"
						>
							Export Report
						</Button>
						<Button className="bg-cyan-600 hover:bg-cyan-700">
							Create Task
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="text-slate-300 hover:bg-slate-800"
						>
							Notifications
							<Badge variant="destructive" className="ml-2">
								3
							</Badge>
						</Button>
						<Avatar>
							<AvatarImage src="" alt={user?.name || "User"} />
							<AvatarFallback>
								{user?.name?.substring(0, 2).toUpperCase() || "U"}
							</AvatarFallback>
						</Avatar>
					</div>
				</div>

				{/* Metrics Cards */}
				<DashboardMetrics
					totalTasks={metrics.totalTasks}
					doneTasks={metrics.doneTasks}
					inProcessTasks={metrics.inProcessTasks}
					completionRate={metrics.completionRate}
				/>

				{/* Charts */}
				<DashboardCharts
					statusChartData={statusChartData}
					typeChartData={typeChartData}
				/>

				{/* Activity and Team Members */}
				<DashboardActivity
					recentActivity={recentActivity}
					teamMembers={teamMembers}
				/>

				{/* Data Table */}
				<div
					className="bg-slate-800/50 rounded-lg border border-slate-700 p-6"
					data-testid="tasks-table"
				>
					<h2 className="text-xl font-semibold text-white mb-4">All Tasks</h2>
					<DataTable data={typedDashboardData} />
				</div>
			</div>
		</ProtectedRoute>
	);
}
