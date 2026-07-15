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
}
