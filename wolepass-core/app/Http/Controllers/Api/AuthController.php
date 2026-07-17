<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterEstateRequest;
use App\Models\Tenant;
use App\Models\User;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Throwable;

class AuthController extends Controller
{
    // Subscription price in kobo — ₦50,000
    const PLAN_AMOUNT_KOBO = 5_000_000;

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => 'required|email|string',
            'password' => 'required|string',
        ]);

        if (! Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user  = Auth::user();

        if (!$user->is_approved) {
            Auth::logout();
            return response()->json([
                'message' => 'Your onboarding request is pending approval by the estate administrator.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'global_role' => $user->global_role,
                'tenant_id'   => $user->tenant_id,
            ],
        ]);
    }

    /**
     * Zero-touch estate registration.
     * Creates the Tenant + Admin User atomically, issues a Sanctum token,
     * and immediately boots the Paystack checkout URL — all in one request.
     */
    public function register(RegisterEstateRequest $request, PaystackService $paystack)
    {
        try {
            $result = DB::transaction(function () use ($request, $paystack) {

                // 1. Provision the estate (tenant)
                $tenant = Tenant::create([
                    'name'                => $request->estate_name,
                    'slug'                => Str::slug($request->estate_name) . '-' . Str::random(5),
                    'tenant_type'         => 'residential',
                    'subscription_status' => 'pending',
                ]);

                // 1b. Create the Admin Unit for the estate
                $adminUnit = \App\Models\Unit::create([
                    'tenant_id'      => $tenant->id,
                    'unit_label'     => 'Management Office',
                    'payment_status' => 'cleared',
                ]);

                // 2. Create the admin user bound to the new estate
                $user = User::create([
                    'tenant_id'   => $tenant->id,
                    'unit_id'     => $adminUnit->id,
                    'name'        => $request->admin_full_name,
                    'email'       => $request->admin_email,
                    'phone'       => $request->admin_phone,
                    'password'    => Hash::make($request->password),
                    'global_role' => 'tenant_admin',
                ]);

                // 3. Issue a Sanctum token so the client is immediately authenticated
                $token = $user->createToken('auth_token')->plainTextToken;

                // 4. Boot the Paystack checkout
                $authorizationUrl = $paystack->initializePayment(
                    email:    $user->email,
                    amount:   self::PLAN_AMOUNT_KOBO,
                    tenantId: $tenant->id,
                );

                return compact('tenant', 'user', 'token', 'authorizationUrl');
            });

            return response()->json([
                'success'           => true,
                'message'           => 'Estate registered. Complete payment to activate your subscription.',
                'access_token'      => $result['token'],
                'token_type'        => 'Bearer',
                'authorization_url' => $result['authorizationUrl'],
                'user'              => [
                    'id'          => $result['user']->id,
                    'name'        => $result['user']->name,
                    'email'       => $result['user']->email,
                    'global_role' => $result['user']->global_role,
                    'tenant_id'   => $result['user']->tenant_id,
                ],
                'tenant'            => [
                    'id'                  => $result['tenant']->id,
                    'name'                => $result['tenant']->name,
                    'subscription_status' => $result['tenant']->subscription_status,
                ],
            ], 201);

        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error'   => app()->hasDebugModeEnabled() ? $e->getMessage() : null,
            ], 500);
        }
    }
}
