<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Use a fixed UUID for the demo tenant so we can reference it reliably
        $tenantId = 'd0000000-0000-0000-0000-000000000001';
        $unitId = 'd0000000-0000-0000-0000-000000000002';

        // 1. Create a Demo Tenant (Estate)
        DB::table('tenants')->updateOrInsert(
            ['slug' => 'wolepass-demo'],
            [
                'id' => $tenantId,
                'name' => 'WolePass Demo Estate',
                'tenant_type' => 'residential',
                'subscription_status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Create a Demo Unit
        DB::table('units')->updateOrInsert(
            ['id' => $unitId],
            [
                'tenant_id' => $tenantId,
                'unit_label' => 'Block A, Suite 101',
                'payment_status' => 'cleared',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 3. Create Demo Users with password: password123
        // We use a pre-calculated hash to avoid "No application encryption key" errors in some environments
        $password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // This is 'password'

        $users = [
            [
                'name' => 'Estate Admin',
                'email' => 'admin@wolepass.com',
                'password' => $password,
                'global_role' => 'tenant_admin',
                'tenant_id' => $tenantId,
                'unit_id' => null,
            ],
            [
                'name' => 'Security Guard',
                'email' => 'guard@wolepass.com',
                'password' => $password,
                'global_role' => 'guard',
                'tenant_id' => $tenantId,
                'unit_id' => null,
            ],
            [
                'name' => 'Demo Resident',
                'email' => 'resident@wolepass.com',
                'password' => $password,
                'global_role' => 'resident',
                'tenant_id' => $tenantId,
                'unit_id' => $unitId,
            ]
        ];

        foreach ($users as $userData) {
            if (!DB::table('users')->where('email', $userData['email'])->exists()) {
                DB::table('users')->insert(array_merge($userData, [
                    'id' => (string) Str::uuid(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tenantId = 'd0000000-0000-0000-0000-000000000001';
        
        DB::table('users')->where('tenant_id', $tenantId)->delete();
        DB::table('units')->where('tenant_id', $tenantId)->delete();
        DB::table('tenants')->where('id', $tenantId)->delete();
    }
};
