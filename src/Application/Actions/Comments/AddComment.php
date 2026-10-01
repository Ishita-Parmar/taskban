<?php

namespace Src\Application\Actions\Comments;

use App\Models\Comment;
use App\Models\Issue;
use Src\Domain\Events\CommentAdded;

class AddComment
{
    /**
     * Add a comment to an issue.
     */
    public function execute(int $issueId, int $userId, string $body): Comment
    {
        $issue = Issue::findOrFail($issueId);

        $comment = Comment::create([
            'issue_id' => $issueId,
            'user_id' => $userId,
            'body' => $body,
        ]);

        event(new CommentAdded(
            commentId: $comment->id,
            issueId: $issueId,
            projectId: $issue->project_id,
            userId: $userId,
            body: $body,
        ));

        return $comment->load('user');
    }
}
