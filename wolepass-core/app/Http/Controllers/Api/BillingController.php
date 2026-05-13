<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\PaystackService;
use Illuminate\Http\Request;

class BillingController extends Controller
{
    // Subscription price in kobo — ₦50,000
    const PLAN_AMOUNT_KOBO = 5_000_000;

    protected PaystackService $paystack;

    public function __construct(PaystackService $paystack)
    {
        $this->paystack = $paystack;
    }

    /**
     * Initialize a Paystack checkout for the authenticated admin's estate.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function initialize(Request $request)
    {
        $user = $request->user();

        if (! in_array($user->global_role, ['tenant_admin', 'super_admin'])) {
            abort(403, 'Only estate admins can initiate billing.');
        }

        $authorizationUrl = $this->paystack->initializePayment(
            email:    $user->email,
            amount:   self::PLAN_AMOUNT_KOBO,
            tenantId: $user->tenant_id,
        );

        if (! $authorizationUrl) {
            return response()->json([
                'success' => false,
                'message' => 'Could not initialize payment. Please try again.',
            ], 502);
        }

        return response()->json([
            'success'           => true,
            'authorization_url' => $authorizationUrl,
            'amount_naira'      => self::PLAN_AMOUNT_KOBO / 100,
        ]);
    }

    /**
     * Handle incoming Paystack webhook events.
     * This route is PUBLIC — verify the signature before trusting any payload.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function webhook(Request $request)
    {
        $rawBody   = $request->getContent();
        $signature = $request->header('x-paystack-signature', '');

        // 1. Verify the request genuinely came from Paystack
        if (! $this->paystack->verifyWebhookSignature($rawBody, $signature)) {
            return response()->json(['message' => 'Invalid signature.'], 401);
        }

        $payload = json_decode($rawBody, true);
        $event   = $payload['event'] ?? null;

        // 2. Handle charge.success
        if ($event === 'charge.success') {
            $tenantId = $payload['data']['metadata']['tenant_id'] ?? null;

            if ($tenantId) {
                $tenant = Tenant::find($tenantId);

                if ($tenant) {
                    $tenant->update([
                        'subscription_status' => 'active',
                        'subscription_ends_at' => now()->addDays(30),
                        // Store the customer code if Paystack returns one
                        'paystack_customer_code' => $payload['data']['customer']['customer_code'] ?? $tenant->paystack_customer_code,
                    ]);
                }
            }
        }

        // Always return 200 — Paystack retries if we don't acknowledge promptly
        return response()->noContent();
    }
}
