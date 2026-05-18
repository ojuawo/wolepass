<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceTicket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

class TicketController extends Controller
{
    /**
     * List tickets scoped to the tenant.
     * Residents only see their own tickets, Admins see all.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = MaintenanceTicket::with(['reporter:id,name,email', 'unit:id,unit_label', 'assignee:id,name']);

        if ($user->global_role === 'resident') {
            $query->where('reporter_id', $user->id);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $tickets]);
    }

    /**
     * Create a new maintenance ticket.
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'priority'    => 'required|in:low,medium,high,urgent',
            'photo'       => 'nullable|image|max:5120', // Max 5MB
        ]);

        if ($user->global_role === 'resident' && !$user->unit_id) {
            return response()->json(['message' => 'You must be assigned to a unit to file tickets.'], 400);
        }

        try {
            $photoUrl = null;
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('tickets', 'public');
                $photoUrl = Storage::url($path);
            }

            $ticket = MaintenanceTicket::create([
                'tenant_id'   => $user->tenant_id,
                'unit_id'     => $user->global_role === 'tenant_admin' ? $request->input('unit_id') : $user->unit_id,
                'reporter_id' => $user->id,
                'title'       => $validated['title'],
                'description' => $validated['description'],
                'priority'    => $validated['priority'],
                'photo_url'   => $photoUrl,
                'status'      => 'open',
            ]);

            return response()->json([
                'message' => 'Ticket submitted successfully.',
                'data'    => $ticket->load(['reporter:id,name', 'unit:id,unit_label']),
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to create ticket.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Show detailed ticket with comment thread.
     */
    public function show(Request $request, MaintenanceTicket $ticket): JsonResponse
    {
        $user = $request->user();
        if ($user->global_role === 'resident' && $ticket->reporter_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $ticket->load([
            'reporter:id,name,email',
            'unit:id,unit_label',
            'assignee:id,name',
            'comments.author:id,name,global_role'
        ]);

        return response()->json(['data' => $ticket]);
    }

    /**
     * Update ticket status or assign it (Admin only).
     */
    public function update(Request $request, MaintenanceTicket $ticket): JsonResponse
    {
        $user = $request->user();
        if ($user->global_role !== 'tenant_admin') {
            return response()->json(['message' => 'Only estate admins can update tickets.'], 403);
        }

        $validated = $request->validate([
            'status'      => 'nullable|in:open,in_progress,resolved,closed',
            'assignee_id' => 'nullable|uuid|exists:users,id',
            'priority'    => 'nullable|in:low,medium,high,urgent',
        ]);

        try {
            $updates = [];
            if (isset($validated['status'])) {
                $updates['status'] = $validated['status'];
                if ($validated['status'] === 'resolved') {
                    $updates['resolved_at'] = now();
                }
            }
            if (isset($validated['assignee_id'])) {
                $updates['assignee_id'] = $validated['assignee_id'];
            }
            if (isset($validated['priority'])) {
                $updates['priority'] = $validated['priority'];
            }

            $ticket->update($updates);

            return response()->json([
                'message' => 'Ticket updated successfully.',
                'data'    => $ticket->load(['reporter:id,name', 'assignee:id,name']),
            ]);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to update ticket.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Add a comment to the ticket.
     */
    public function addComment(Request $request, MaintenanceTicket $ticket): JsonResponse
    {
        $user = $request->user();
        if ($user->global_role === 'resident' && $ticket->reporter_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $validated = $request->validate([
            'body'  => 'required|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        try {
            $photoUrl = null;
            if ($request->hasFile('photo')) {
                $path = $request->file('photo')->store('ticket_comments', 'public');
                $photoUrl = Storage::url($path);
            }

            $comment = TicketComment::create([
                'ticket_id' => $ticket->id,
                'author_id' => $user->id,
                'body'      => $validated['body'],
                'photo_url' => $photoUrl,
            ]);

            return response()->json([
                'message' => 'Comment added.',
                'data'    => $comment->load('author:id,name,global_role'),
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Failed to add comment.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * List all technicians / staff available for assignment (Admin only).
     */
    public function staff(Request $request): JsonResponse
    {
        if ($request->user()->global_role !== 'tenant_admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Return admins and guards as available assignees
        $staff = User::where('tenant_id', $request->user()->tenant_id)
            ->whereIn('global_role', ['tenant_admin', 'guard'])
            ->select('id', 'name', 'global_role')
            ->get();

        return response()->json(['data' => $staff]);
    }
}
