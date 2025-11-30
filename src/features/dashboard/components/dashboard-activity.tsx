import { IconActivity, IconUser } from "@tabler/icons-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";

interface ActivityItem {
	id: number;
	user: string;
	action: string;
	target: string;
	time: string;
	avatar: string;
}

interface TeamMember {
	id: number;
	name: string;
	avatar: string;
	role: string;
	status: "online" | "offline" | "away";
	tasksCompleted: number;
}

interface DashboardActivityProps {
	recentActivity: ActivityItem[];
	teamMembers: TeamMember[];
}

export function DashboardActivity({
	recentActivity,
	teamMembers,
}: DashboardActivityProps) {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
			{/* Activity Timeline */}
			<Card
				className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors lg:col-span-2"
				data-testid="recent-activity"
			>
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
						{recentActivity.map((activity, index) => (
							<div
								key={activity.id}
								className="flex gap-4"
								data-testid="activity-item"
							>
								<div className="flex flex-col items-center">
									<div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
									{index < recentActivity.length - 1 && (
										<div className="w-px h-12 bg-slate-600" />
									)}
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-2 mb-1">
										<Avatar className="w-6 h-6">
											<AvatarFallback className="text-xs">
												{activity.avatar}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm font-medium text-white">
											{activity.user}
										</span>
										<span className="text-xs text-slate-400">
											{activity.time}
										</span>
									</div>
									<p className="text-sm text-slate-300">
										{activity.action} "{activity.target}"
									</p>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Team Members */}
			<Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 hover:border-slate-600 transition-colors">
				<CardHeader>
					<CardTitle className="text-white flex items-center gap-2">
						<IconUser className="w-5 h-5 text-blue-400" />
						Team Members
					</CardTitle>
					<CardDescription className="text-slate-400">
						Active contributors
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{teamMembers.map((member) => {
							const memberTasksCompleted = member.tasksCompleted;
							return (
								<div key={member.id} className="flex items-center gap-3">
									<div className="relative">
										<Avatar className="w-10 h-10">
											<AvatarFallback className="text-sm">
												{member.avatar}
											</AvatarFallback>
										</Avatar>
										<div
											className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
												member.status === "online"
													? "bg-green-400"
													: member.status === "away"
														? "bg-yellow-400"
														: "bg-slate-400"
											}`}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium text-white truncate">
												{member.name}
											</p>
											<Badge
												variant="outline"
												className="text-xs border-slate-600 text-slate-400"
											>
												{member.role}
											</Badge>
										</div>
										<p className="text-xs text-slate-400">
											{memberTasksCompleted} tasks completed
										</p>
									</div>
								</div>
							);
						})}
					</div>
					<Separator className="my-4 bg-slate-700" />
					<Button
						variant="outline"
						size="sm"
						className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
					>
						View All Members
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
