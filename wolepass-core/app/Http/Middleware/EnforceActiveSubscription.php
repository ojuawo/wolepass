<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnforceActiveSubscription
{
    /**
     * Block requests from estates with a suspended subscription.
     * Returns 402 Payment Required so the frontend can redirect to billing.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->tenant_id) {
            $tenant = Tenant::find($user->tenant_id);

            if ($tenant && $tenant->subscription_status === 'suspended') {
                return response()->json([
                    'success' => false,
                    'message' => 'Estate subscription is suspended. Please renew your plan.',
                    'code'    => 'SUBSCRIPTION_SUSPENDED',
                ], 402);
            }
        }

        return $next($request);
    }
}
