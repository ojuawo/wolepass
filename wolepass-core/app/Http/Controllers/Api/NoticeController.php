<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notice;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class NoticeController extends Controller
{
    /**
     * List all notices for the tenant (pinned first, then by date).
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $notices = Notice::with(['author:id,name', 'pollOptions.votes'])
            ->orderByDesc('pinned')
            ->orderByDesc('published_at')
            ->get()
            ->map(fn($notice) => $this->formatNotice($notice, $userId));

        return response()->json(['data' => $notices]);
    }

    /**
     * Create a new notice or poll (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->global_role !== 'tenant_admin') {
            return response()->json(['message' => 'Only estate admins can post notices.'], 403);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'body'        => 'required|string',
            'type'        => 'required|in:announcement,poll',
            'pinned'      => 'boolean',
            'expires_at'  => 'nullable|date|after:now',
            'poll_options' => 'required_if:type,poll|array|min:2|max:6',
            'poll_options.*' => 'required|string|max:120',
        ]);

        try {
            $notice = DB::transaction(function () use ($validated, $request) {
                $notice = Notice::create([
                    'tenant_id'  => $request->user()->tenant_id,
                    'author_id'  => $request->user()->id,
                    'title'      => $validated['title'],
                    'body'       => $validated['body'],
                    'type'       => $validated['type'],
                    'pinned'     => $validated['pinned'] ?? false,
                    'expires_at' => $validated['expires_at'] ?? null,
                ]);

                if ($validated['type'] === 'poll') {
                    foreach ($validated['poll_options'] as $optionText) {
                        PollOption::create([
                            'notice_id'   => $notice->id,
                            'option_text' => $optionText,
                        ]);
                    }
                }

                return $notice->load(['author:id,name', 'pollOptions.votes']);
            });

            return response()->json([
                'message' => 'Notice posted successfully.',
                'data'    => $this->formatNotice($notice, $request->user()->id),
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to post notice.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cast a vote on a poll option.
     */
    public function vote(Request $request, Notice $notice): JsonResponse
    {
        if ($notice->type !== 'poll') {
            return response()->json(['message' => 'This notice is not a poll.'], 422);
        }

        if ($notice->isExpired()) {
            return response()->json(['message' => 'This poll has closed.'], 422);
        }

        $validated = $request->validate([
            'poll_option_id' => 'required|uuid|exists:poll_options,id',
        ]);

        $userId = $request->user()->id;

        // Check if user has already voted in this poll
        $existingVote = PollVote::whereHas('pollOption', fn($q) => $q->where('notice_id', $notice->id))
            ->where('user_id', $userId)
            ->first();

        if ($existingVote) {
            // Allow vote change: delete old vote
            $existingVote->delete();
        }

        PollVote::create([
            'poll_option_id' => $validated['poll_option_id'],
            'user_id'        => $userId,
        ]);

        $notice->load(['author:id,name', 'pollOptions.votes']);

        return response()->json([
            'message' => 'Vote recorded.',
            'data'    => $this->formatNotice($notice, $userId),
        ]);
    }

    /**
     * Delete a notice (Admin only).
     */
    public function destroy(Request $request, Notice $notice): JsonResponse
    {
        if ($request->user()->global_role !== 'tenant_admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $notice->delete();

        return response()->json(['message' => 'Notice deleted.']);
    }

    /**
     * Format a notice for the API response, including poll results.
     */
    private function formatNotice(Notice $notice, string $userId): array
    {
        $data = [
            'id'           => $notice->id,
            'title'        => $notice->title,
            'body'         => $notice->body,
            'type'         => $notice->type,
            'pinned'       => $notice->pinned,
            'published_at' => $notice->published_at?->toISOString(),
            'expires_at'   => $notice->expires_at?->toISOString(),
            'is_expired'   => $notice->isExpired(),
            'author'       => $notice->relationLoaded('author') ? [
                'id'   => $notice->author->id,
                'name' => $notice->author->name,
            ] : null,
        ];

        if ($notice->type === 'poll' && $notice->relationLoaded('pollOptions')) {
            $totalVotes = $notice->pollOptions->sum(fn($o) => $o->votes->count());
            $userVoteOptionId = null;

            foreach ($notice->pollOptions as $option) {
                if ($option->votes->contains('user_id', $userId)) {
                    $userVoteOptionId = $option->id;
                    break;
                }
            }

            $data['poll'] = [
                'total_votes'        => $totalVotes,
                'user_voted_option'  => $userVoteOptionId,
                'options'            => $notice->pollOptions->map(fn($o) => [
                    'id'          => $o->id,
                    'text'        => $o->option_text,
                    'votes'       => $o->votes->count(),
                    'percentage'  => $totalVotes > 0 ? round(($o->votes->count() / $totalVotes) * 100) : 0,
                ])->toArray(),
            ];
        }

        return $data;
    }
}
