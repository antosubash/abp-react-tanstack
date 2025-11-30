import { useId } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import { IconChartBar, IconChartPie } from "@tabler/icons-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import type { ChartConfig } from "@/shared/components/ui/chart";
import { ChartContainer } from "@/shared/components/ui/chart";

interface ChartData {
	name: string;
	value: number;
	color: string;
}

interface RoleChartData {
	name: string;
	count: number;
}

interface DashboardChartsProps {
	usersChartData: ChartData[];
	rolesChartData: RoleChartData[];
}

export function DashboardCharts({
	usersChartData,
	rolesChartData,
}: DashboardChartsProps) {
	const gradientId = useId();

	const chartConfig: ChartConfig = {
		value: {
			label: "Value",
		},
	} satisfies ChartConfig;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
			{/* Status Distribution Pie Chart */}
			<Card
				className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors"
				data-testid="status-chart"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-white flex items-center gap-2">
								<IconChartPie className="w-5 h-5 text-blue-400" />
								Users Distribution
							</CardTitle>
							<CardDescription className="text-slate-400">
								Overview of active vs locked users
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={chartConfig}
						className="h-[250px] sm:h-[300px]"
					>
						<PieChart>
							<Pie
								data={usersChartData}
								cx="50%"
								cy="50%"
								outerRadius={100}
								dataKey="value"
								label={({ name, percent }) =>
									`${name}: ${(percent * 100).toFixed(0)}%`
								}
								labelLine={false}
							>
								{usersChartData.map((entry, _index) => (
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
						{usersChartData.map((entry) => (
							<div key={entry.name} className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-full"
									style={{ backgroundColor: entry.color }}
								/>
								<span className="text-sm text-slate-400">{entry.name}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Type Distribution Bar Chart */}
			<Card
				className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors"
				data-testid="type-chart"
			>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-white flex items-center gap-2">
								<IconChartBar className="w-5 h-5 text-cyan-400" />
								Roles Distribution
							</CardTitle>
							<CardDescription className="text-slate-400">
								Distribution of roles in the system
							</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<ChartContainer
						config={chartConfig}
						className="h-[250px] sm:h-[300px]"
					>
						<BarChart
							data={rolesChartData}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
							<XAxis
								dataKey="name"
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
								<linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
									<stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
								</linearGradient>
							</defs>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
