import { useMemo } from "react";
import type { VoloCmsKitPublicCommentsCommentDto } from "@/infrastructure/api/types.gen";

export interface CommentNode extends VoloCmsKitPublicCommentsCommentDto {
	children: CommentNode[];
}

/**
 * Transform a flat list of comments into a tree structure
 * @param comments Flat array of comments
 * @returns Tree structure with nested replies
 */
export function useCommentsTree(
	comments: VoloCmsKitPublicCommentsCommentDto[],
): CommentNode[] {
	return useMemo(() => {
		if (!comments || comments.length === 0) return [];

		// Create a map for quick lookup
		const commentMap = new Map<string, CommentNode>();

		// Initialize all comments with empty children array
		for (const comment of comments) {
			if (comment.id) {
				commentMap.set(comment.id, { ...comment, children: [] });
			}
		}

		// Build the tree structure
		const rootComments: CommentNode[] = [];

		for (const comment of comments) {
			const node = commentMap.get(comment.id || "");
			if (!node) continue;

			if (comment.repliedCommentId) {
				// This is a reply, add it to parent's children
				const parent = commentMap.get(comment.repliedCommentId);
				if (parent) {
					parent.children.push(node);
				} else {
					// Parent not found, treat as root comment
					rootComments.push(node);
				}
			} else {
				// This is a root comment
				rootComments.push(node);
			}
		}

		// Sort root comments by creation time (newest first)
		rootComments.sort((a, b) => {
			const dateA = a.creationTime ? new Date(a.creationTime).getTime() : 0;
			const dateB = b.creationTime ? new Date(b.creationTime).getTime() : 0;
			return dateB - dateA;
		});

		// Recursively sort children
		const sortChildren = (node: CommentNode) => {
			node.children.sort((a, b) => {
				const dateA = a.creationTime ? new Date(a.creationTime).getTime() : 0;
				const dateB = b.creationTime ? new Date(b.creationTime).getTime() : 0;
				return dateA - dateB; // Oldest first for replies
			});
			for (const child of node.children) {
				sortChildren(child);
			}
		};

		for (const root of rootComments) {
			sortChildren(root);
		}

		return rootComments;
	}, [comments]);
}
