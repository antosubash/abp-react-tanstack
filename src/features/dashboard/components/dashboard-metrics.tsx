import {
	IconCircleCheckFilled,
	IconClock,
	IconTarget,
	IconTrendingUp,
} from "@tabler/icons-react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";

interface DashboardMetricsProps {
	totalTasks: number;
	doneTasks: number;
	inProcessTasks: number;
	completionRate: number;
}

export function DashboardMetrics({
	totalTasks,
	doneTasks,
	inProcessTasks,
	completionRate,
}: DashboardMetricsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg text-white">Total Tasks</CardTitle>
						<IconTarget className="w-5 h-5 text-cyan-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-cyan-400 mb-2">
						{totalTasks}
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
						<CardTitle className="text-lg text-white">Completed</CardTitle>
						<IconCircleCheckFilled className="w-5 h-5 text-green-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-green-400 mb-2">
						{doneTasks}
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-slate-400">Completion rate</span>
						<span className="text-green-400 font-medium">
							{completionRate.toFixed(1)}%
						</span>
					</div>
					<Progress value={completionRate} className="mt-2 h-2 bg-slate-700" />
				</CardContent>
			</Card>

			<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg text-white">In Progress</CardTitle>
						<IconClock className="w-5 h-5 text-yellow-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-yellow-400 mb-2">
						{inProcessTasks}
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-slate-400">Remaining</span>
						<span className="text-yellow-400 font-medium">
							{inProcessTasks}
						</span>
					</div>
					<Progress
						value={(inProcessTasks / totalTasks) * 100}
						className="mt-2 h-2 bg-slate-700"
					/>
				</CardContent>
			</Card>

			<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg text-white">
							Completion Rate
						</CardTitle>
						<IconTrendingUp className="w-5 h-5 text-purple-400" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-3xl font-bold text-purple-400 mb-2">
						{completionRate.toFixed(1)}%
					</div>
					<div className="flex items-center text-sm text-slate-400">
						<IconTrendingUp className="w-4 h-4 mr-1" />
						<span>Overall progress</span>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
