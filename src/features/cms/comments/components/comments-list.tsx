import type { VoloCmsKitPublicCommentsCommentDto } from "@/infrastructure/api/types.gen";
import { Button } from "@/shared/components/ui/button";
import { COMMENT_BUTTON_LABELS } from "../constants";
import { type CommentNode, useCommentsTree } from "../hooks/use-comments-tree";
import { CommentItem } from "./comment-item";

interface CommentsListProps {
	comments: VoloCmsKitPublicCommentsCommentDto[];
	entityType: string;
	entityId: string;
	onReply?: (comment: CommentNode) => void;
	onEdit?: (comment: CommentNode) => void;
	onDelete?: (commentId: string) => void;
	canEdit?: boolean;
	canDelete?: boolean;
	canReply?: boolean;
	isLoading?: boolean;
	hasMore?: boolean;
	onLoadMore?: () => void;
}

export function CommentsList({
	comments,
	entityType: _entityType,
	entityId: _entityId,
	onReply,
	onEdit,
	onDelete,
	canEdit = false,
	canDelete = false,
	canReply = true,
	isLoading = false,
	hasMore = false,
	onLoadMore,
}: CommentsListProps) {
	const commentTree = useCommentsTree(comments);

	if (isLoading && comments.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">Loading comments...</p>
			</div>
		);
	}

	if (!isLoading && commentTree.length === 0) {
		return (
			<div className="text-center py-8">
				<p className="text-muted-foreground">
					No comments yet. Be the first to comment!
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{commentTree.map((comment) => (
				<CommentItem
					key={comment.id}
					comment={comment}
					onReply={onReply}
					onEdit={onEdit}
					onDelete={onDelete}
					canEdit={canEdit}
					canDelete={canDelete}
					canReply={canReply}
				/>
			))}

			{hasMore && onLoadMore && (
				<div className="flex justify-center pt-4">
					<Button
						variant="outline"
						onClick={onLoadMore}
						disabled={isLoading}
						data-testid="btn-load-more-comments"
					>
						{isLoading ? "Loading..." : COMMENT_BUTTON_LABELS.LOAD_MORE}
					</Button>
				</div>
			)}
		</div>
	);
}
