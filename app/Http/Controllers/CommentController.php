<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Issue;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Issue $issue)
    {
        $comments = $issue->comments()->with('user')->get();
        return response()->json($comments);
    }

    public function store(Request $request, Issue $issue)
    {
        $validated = $request->validate([
            'body' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240'
        ]);

        if (empty($validated['body']) && !$request->hasFile('attachment')) {
            return response()->json(['message' => 'Comment or attachment is required'], 422);
        }

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments', 'public');
        }

        $comment = $issue->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'] ?? '',
            'attachment' => $attachmentPath,
        ]);

        $comment->load('user');

        return response()->json($comment, 201);
    }

    public function update(Request $request, Issue $issue, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'body' => 'required|string'
        ]);

        $comment->update($validated);

        return response()->json($comment);
    }

    public function destroy(Request $request, Issue $issue, Comment $comment)
    {
        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(null, 204);
    }
}
