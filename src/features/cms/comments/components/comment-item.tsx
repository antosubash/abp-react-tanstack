import {
	IconDots,
	IconMessage,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { COMMENT_BUTTON_LABELS } from "../constants";
import type { CommentNode } from "../hooks/use-comments-tree";

interface CommentItemProps {
	comment: CommentNode;
	depth?: number;
	maxDepth?: number;
	onReply?: (comment: CommentNode) => void;
	onEdit?: (comment: CommentNode) => void;
	onDelete?: (commentId: string) => void;
	canEdit?: boolean;
	canDelete?: boolean;
	canReply?: boolean;
}

export function CommentItem({
	comment,
	depth = 0,
	maxDepth = 3,
	onReply,
	onEdit,
	onDelete,
	canEdit = false,
	canDelete = false,
	canReply = true,
}: CommentItemProps) {
	const formattedDate = comment.creationTime
		? new Date(comment.creationTime).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			})
		: "";

	const hasActions = canEdit || canDelete || (canReply && depth < maxDepth);

	return (
		<div className="space-y-3">
			<div
				className={`flex gap-3 p-4 rounded-lg border bg-card ${
					depth > 0 ? "ml-8" : ""
				}`}
				data-testid="comment-item"
			>
				{/* Avatar placeholder */}
				<div className="flex-shrink-0">
					<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
						<span className="text-sm font-medium text-primary">
							{comment.author?.userName?.charAt(0).toUpperCase() || "U"}
						</span>
					</div>
				</div>

				{/* Comment content */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="flex-1">
							<div className="flex items-center gap-2">
								<span className="font-medium text-sm">
									{comment.author?.userName || "Anonymous"}
								</span>
								<span className="text-xs text-muted-foreground">
									{formattedDate}
								</span>
							</div>
							<p className="mt-1 text-sm text-foreground whitespace-pre-wrap break-words">
								{comment.text}
							</p>
						</div>

						{/* Actions menu */}
						{hasActions && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0"
										data-testid="btn-comment-actions"
									>
										<IconDots className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									{canReply && depth < maxDepth && onReply && (
										<DropdownMenuItem
											onClick={() => onReply(comment)}
											data-testid="btn-reply-comment"
										>
											<IconMessage className="mr-2 h-4 w-4" />
											{COMMENT_BUTTON_LABELS.REPLY}
										</DropdownMenuItem>
									)}
									{canEdit && onEdit && (
										<>
											{canReply && depth < maxDepth && (
												<DropdownMenuSeparator />
											)}
											<DropdownMenuItem
												onClick={() => onEdit(comment)}
												data-testid="btn-edit-comment"
											>
												<IconPencil className="mr-2 h-4 w-4" />
												{COMMENT_BUTTON_LABELS.EDIT}
											</DropdownMenuItem>
										</>
									)}
									{canDelete && onDelete && (
										<>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => onDelete(comment.id || "")}
												className="text-destructive focus:text-destructive"
												data-testid="btn-delete-comment"
											>
												<IconTrash className="mr-2 h-4 w-4" />
												{COMMENT_BUTTON_LABELS.DELETE}
											</DropdownMenuItem>
										</>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
				</div>
			</div>

			{/* Render nested replies */}
			{comment.children && comment.children.length > 0 && depth < maxDepth && (
				<div className="space-y-3">
					{comment.children.map((child) => (
						<CommentItem
							key={child.id}
							comment={child}
							depth={depth + 1}
							maxDepth={maxDepth}
							onReply={onReply}
							onEdit={onEdit}
							onDelete={onDelete}
							canEdit={canEdit}
							canDelete={canDelete}
							canReply={canReply}
						/>
					))}
				</div>
			)}
		</div>
	);
}
