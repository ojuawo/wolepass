<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Throwable;

class ResidentOnboardingController extends Controller
{
    /**
     * Public: List all registered estates so joining residents can choose.
     */
    public function estates(): JsonResponse
    {
        $estates = Tenant::where('subscription_status', 'active')
            ->select('id', 'name')
            ->get();
        return response()->json(['data' => $estates]);
    }

    /**
     * Public: List all units for a specific estate so joining residents can select theirs.
     */
    public function units(Tenant $tenant): JsonResponse
    {
        $units = Unit::where('tenant_id', $tenant->id)
            ->select('id', 'unit_label')
            ->get();
        return response()->json(['data' => $units]);
    }

    /**
     * Public: Register a resident request (is_approved defaults to false).
     */
    public function registerResident(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tenant_id' => 'required|uuid|exists:tenants,id',
            'unit_id'   => 'required|uuid|exists:units,id',
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'phone'     => 'required|string|max:30',
            'password'  => 'required|string|min:6',
        ]);

        try {
            $user = User::create([
                'tenant_id'   => $validated['tenant_id'],
                'unit_id'     => $validated['unit_id'],
                'name'        => $validated['name'],
                'email'       => $validated['email'],
                'phone'       => $validated['phone'],
                'password'    => Hash::make($validated['password']),
                'global_role' => 'resident',
                'is_approved' => false, // MUST start as pending approval
            ]);

            return response()->json([
                'message' => 'Your onboarding request has been submitted. Please wait for the estate administrator to approve your account.',
            ], 201);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Registration failed.', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Admin: List all pending residents for the current tenant.
     */
    public function pendingList(Request $request): JsonResponse
    {
        if ($request->user()->global_role !== 'tenant_admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $pending = User::with('unit:id,unit_label')
            ->where('tenant_id', $request->user()->tenant_id)
            ->where('global_role', 'resident')
            ->where('is_approved', false)
            ->get();

        return response()->json(['data' => $pending]);
    }

    /**
     * Admin: Approve a pending resident.
     */
    public function approve(Request $request, User $user): JsonResponse
    {
        if ($request->user()->global_role !== 'tenant_admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Verify the user belongs to the same estate
        if ($user->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Resident not found in your estate.'], 404);
        }

        $user->update(['is_approved' => true]);

        return response()->json(['message' => "{$user->name} has been approved successfully."]);
    }

    /**
     * Admin: Decline/Reject a pending resident.
     */
    public function reject(Request $request, User $user): JsonResponse
    {
        if ($request->user()->global_role !== 'tenant_admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($user->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Resident not found in your estate.'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Onboarding request declined.']);
    }
}
