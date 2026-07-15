<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GateKeepService;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    protected $gateKeepService;

    public function __construct(GateKeepService $gateKeepService)
    {
        $this->gateKeepService = $gateKeepService;
    }

    /**
     * Store a newly created GateKeep Pass (Visit) in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone_number'     => 'nullable|string|max:20',
            'full_name'        => 'nullable|string|max:100',
            'visit_type'       => 'required|in:personal,dispatch,service,meeting,interview,vendor,maintenance',
            'expected_arrival' => 'required|date|after:now',
        ]);

        $visit = $this->gateKeepService->generate($validated, $request->user());

        $unitLabel = 'Your Unit';
        if ($request->user()->unit_id) {
            $unit = \App\Models\Unit::find($request->user()->unit_id);
            if ($unit) {
                $unitLabel = $unit->unit_label;
            }
        }

        $shareableText = "Your GateKeep Pass for {$unitLabel} is: {$visit->otp_code}. Show this at the gate.";

        return response()->json([
            'visit' => $visit,
            'shareable_text' => $shareableText,
        ], 201);
    }

    /**
     * Get dynamic dashboard stats and recent activity based on user role.
     */
    public function dashboardData(Request $request)
    {
        $user = $request->user();
        $role = $user->global_role;
        $tenantId = $user->tenant_id;

        $stats = [];
        $recentVisits = [];

        if ($role === 'tenant_admin' || $role === 'super_admin') {
            // Admin stats
            $activePassesToday = \App\Models\Visit::where('tenant_id', $tenantId)
                ->whereDate('expected_arrival', now()->toDateString())
                ->count();

            $totalResidents = \App\Models\User::where('tenant_id', $tenantId)
                ->where('global_role', 'resident')
                ->count();

            $pendingApprovals = \App\Models\User::where('tenant_id', $tenantId)
                ->where('is_approved', 0)
                ->count();

            $stats = [
                ['id' => 1, 'title' => 'Active Passes Today', 'value' => (string)$activePassesToday, 'color' => 'blue'],
                ['id' => 2, 'title' => 'Total Residents', 'value' => (string)$totalResidents, 'color' => 'green'],
                ['id' => 3, 'title' => 'Pending Approvals', 'value' => (string)$pendingApprovals, 'color' => 'amber']
            ];

            $recentVisits = \App\Models\Visit::where('tenant_id', $tenantId)
                ->with(['visitor', 'unit', 'host'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($visit) {
                    return [
                        'id' => $visit->id,
                        'visitor' => $visit->visitor ? $visit->visitor->full_name : 'Unknown',
                        'unit' => $visit->unit ? $visit->unit->unit_label : 'N/A',
                        'type' => ucfirst($visit->visit_type),
                        'time' => $visit->created_at->format('H:i A'),
                        'status' => ucfirst(str_replace('_', ' ', $visit->status))
                    ];
                });

        } else if ($role === 'guard') {
            // Guard stats
            $checkedInToday = \App\Models\Visit::where('tenant_id', $tenantId)
                ->where('status', 'checked_in')
                ->whereDate('checked_in_at', now()->toDateString())
                ->count();

            $checkedOutToday = \App\Models\Visit::where('tenant_id', $tenantId)
                ->where('status', 'checked_out')
                ->whereDate('updated_at', now()->toDateString())
                ->count();

            $activeOnsite = \App\Models\Visit::where('tenant_id', $tenantId)
                ->where('status', 'checked_in')
                ->count();

            $stats = [
                ['id' => 1, 'title' => 'Checked-In Today', 'value' => (string)$checkedInToday, 'color' => 'blue'],
                ['id' => 2, 'title' => 'Checked-Out Today', 'value' => (string)$checkedOutToday, 'color' => 'green'],
                ['id' => 3, 'title' => 'Active Onsite', 'value' => (string)$activeOnsite, 'color' => 'purple']
            ];

            $recentVisits = \App\Models\Visit::where('tenant_id', $tenantId)
                ->with(['visitor', 'unit', 'host'])
                ->whereIn('status', ['checked_in', 'checked_out'])
                ->orderBy('updated_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($visit) {
                    return [
                        'id' => $visit->id,
                        'visitor' => $visit->visitor ? $visit->visitor->full_name : 'Unknown',
                        'unit' => $visit->unit ? $visit->unit->unit_label : 'N/A',
                        'type' => ucfirst($visit->visit_type),
                        'time' => $visit->updated_at->format('H:i A'),
                        'status' => ucfirst(str_replace('_', ' ', $visit->status))
                    ];
                });

        } else {
            // Resident stats
            $myActivePasses = \App\Models\Visit::where('host_id', $user->id)
                ->where('status', 'pending')
                ->count();

            $totalInvitesMonth = \App\Models\Visit::where('host_id', $user->id)
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();

            $stats = [
                ['id' => 1, 'title' => 'My Active Passes', 'value' => (string)$myActivePasses, 'color' => 'blue'],
                ['id' => 2, 'title' => 'Total Invites (Month)', 'value' => (string)$totalInvitesMonth, 'color' => 'green'],
                ['id' => 3, 'title' => 'Account Status', 'value' => $user->is_approved ? 'Approved' : 'Pending', 'color' => 'purple']
            ];

            $recentVisits = \App\Models\Visit::where('host_id', $user->id)
                ->with(['visitor', 'unit'])
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($visit) {
                    return [
                        'id' => $visit->id,
                        'visitor' => $visit->visitor ? $visit->visitor->full_name : 'Unknown',
                        'unit' => 'My Unit',
                        'type' => ucfirst($visit->visit_type),
                        'time' => $visit->created_at->format('H:i A'),
                        'status' => ucfirst(str_replace('_', ' ', $visit->status))
                    ];
                });
        }

        return response()->json([
            'stats' => $stats,
            'recent_visits' => $recentVisits
        ]);
    }
}
