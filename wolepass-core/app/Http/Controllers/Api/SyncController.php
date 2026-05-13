<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SyncController extends Controller
{
    /**
     * DOWNLINK — Download all pending passes for the guard's estate.
     * Gate tablets call this on startup / periodic refresh to hydrate their
     * local offline cache.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function download(Request $request)
    {
        $guard = $request->user();

        if ($guard->global_role !== 'guard') {
            abort(403, 'Access denied. Only security guards can access the sync endpoint.');
        }

        $visits = Visit::withoutGlobalScope('tenant_id')
            ->with(['visitor', 'host', 'unit'])
            ->where('tenant_id', $guard->tenant_id)
            ->where('status', 'pending')
            ->where('expected_arrival', '>=', Carbon::today())
            ->get()
            ->map(fn ($visit) => [
                'id'               => $visit->id,
                'otp_code'         => $visit->otp_code,
                'visit_type'       => $visit->visit_type,
                'expected_arrival' => $visit->expected_arrival,
                'status'           => $visit->status,
                'visitor_name'     => $visit->visitor?->full_name ?? 'Dispatch/Guest',
                'host_name'        => $visit->host?->name,
                'destination'      => $visit->unit?->unit_label,
            ]);

        return response()->json([
            'synced_at' => now()->toIso8601String(),
            'count'     => $visits->count(),
            'passes'    => $visits,
        ], 200);
    }

    /**
     * UPLINK — Upload batched offline check-in logs from the gate tablet.
     * Called when the tablet regains connectivity after operating offline.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upload(Request $request)
    {
        $guard = $request->user();

        if ($guard->global_role !== 'guard') {
            abort(403, 'Access denied. Only security guards can access the sync endpoint.');
        }

        $request->validate([
            'offline_logs'                      => 'required|array|min:1',
            'offline_logs.*.otp_code'           => 'required|string|size:6',
            'offline_logs.*.checked_in_at'      => 'required|date',
        ]);

        $synced  = 0;
        $skipped = [];

        foreach ($request->offline_logs as $log) {
            $visit = Visit::withoutGlobalScope('tenant_id')
                ->where('otp_code', $log['otp_code'])
                ->where('tenant_id', $guard->tenant_id)
                ->first();

            if (! $visit) {
                $skipped[] = ['otp_code' => $log['otp_code'], 'reason' => 'not_found'];
                continue;
            }

            if ($visit->status !== 'pending') {
                $skipped[] = ['otp_code' => $log['otp_code'], 'reason' => 'already_processed'];
                continue;
            }

            $visit->update([
                'status'        => 'checked_in',
                'checked_in_at' => Carbon::parse($log['checked_in_at']),
                'checked_in_by' => $guard->id,
            ]);

            $synced++;
        }

        return response()->json([
            'success'       => true,
            'synced_count'  => $synced,
            'skipped_count' => count($skipped),
            'skipped'       => $skipped,
        ], 200);
    }
}
