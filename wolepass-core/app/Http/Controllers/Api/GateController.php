<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\Request;

class GateController extends Controller
{
    /**
     * Validate a WolePass OTP at the gate.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validatePass(Request $request)
    {
        $request->validate([
            'otp_code' => 'required|string|size:6',
        ]);

        // Ensure the authenticated user is a security guard
        $guard = $request->user();
        if ($guard->global_role !== 'guard') {
            abort(403, 'Access denied. Only security guards can validate passes.');
        }

        // Query within the guard's estate only — prevents cross-estate code guessing
        $visit = Visit::withoutGlobalScope('tenant_id')
            ->with(['visitor', 'unit', 'host'])
            ->where('otp_code', $request->otp_code)
            ->where('tenant_id', $guard->tenant_id)
            ->first();

        if (! $visit) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or Expired WolePass.',
            ], 404);
        }

        if ($visit->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'This pass has already been used.',
            ], 400);
        }

        // Grant access — update the visit record atomically
        $visit->update([
            'status'       => 'checked_in',
            'checked_in_at' => now(),
            'checked_in_by' => $guard->id,
        ]);

        return response()->json([
            'success' => true,
            'action'  => 'GRANT_ACCESS',
            'data'    => [
                'visitor_name' => $visit->visitor?->full_name ?? 'Dispatch/Guest',
                'destination'  => $visit->unit?->unit_label,
                'host_name'    => $visit->host?->name,
                'visit_type'   => $visit->visit_type,
                'checked_in_at' => $visit->checked_in_at->toDateTimeString(),
            ],
        ], 200);
    }
}
