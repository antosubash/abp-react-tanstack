import { IconPlus, IconUsers } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";

interface UsersHeaderProps {
	totalCount: number;
	onCreateUser: () => void;
	isCreating: boolean;
}

export function UsersHeader({
	totalCount,
	onCreateUser,
	isCreating,
}: UsersHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<IconUsers className="h-5 w-5" />
				<span className="text-sm text-muted-foreground">
					{totalCount} users total
				</span>
			</div>
			<Button onClick={onCreateUser} disabled={isCreating}>
				<IconPlus className="mr-2 h-4 w-4" />
				{isCreating ? "Creating..." : "Add User"}
			</Button>
		</div>
	);
}
