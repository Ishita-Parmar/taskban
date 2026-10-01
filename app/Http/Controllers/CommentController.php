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
            'content' => 'required|string'
        ]);

        $comment = $issue->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
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
            'content' => 'required|string'
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
