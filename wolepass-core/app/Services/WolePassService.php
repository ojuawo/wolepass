<?php

namespace App\Services;

use App\Models\User;
use App\Models\Unit;
use App\Models\Visit;
use App\Models\Visitor;

class WolePassService
{
    protected $sendchamp;

    public function __construct(SendchampService $sendchamp)
    {
        $this->sendchamp = $sendchamp;
    }

    /**
     * Generate a WolePass for a visitor and alert them natively.
     *
     * @param array $data
     * @param User $host
     * @return Visit
     */
    public function generate(array $data, User $host)
    {
        $visitorId = null;

        // 1. Resolve or Create Visitor
        if (!empty($data['phone_number'])) {
            $visitor = Visitor::firstOrCreate(
                [
                    'tenant_id' => $host->tenant_id,
                    'phone_number' => $data['phone_number'],
                ],
                [
                    'full_name' => $data['full_name'] ?? null,
                ]
            );
            $visitorId = $visitor->id;
        }

        // 2. Generate OTP
        $otp = (string) random_int(100000, 999999);

        // 3. Create Event Visit
        $visit = Visit::create([
            'tenant_id' => $host->tenant_id,
            'unit_id' => $host->unit_id,
            'host_id' => $host->id,
            'visitor_id' => $visitorId,
            'visit_type' => $data['visit_type'],
            'otp_code' => $otp,
            'status' => 'pending',
            'expected_arrival' => $data['expected_arrival'],
        ]);

        // 4. Send Message via Notification Dispatching Hook
        if (!empty($data['phone_number'])) {
            $unitLabel = 'Your Unit';
            $unit = Unit::find($host->unit_id);
            if ($unit) {
                $unitLabel = $unit->unit_label;
            }

            $message = "Your WolePass for {$unitLabel} is: {$otp}. Show this at the gate.";
            
            $this->sendchamp->sendWhatsApp($data['phone_number'], $message);
        }

        return $visit;
    }
}
