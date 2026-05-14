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
        // Use a fixed slug for the demo tenant
        $demoSlug = 'wolepass-demo';

        // 1. Ensure Demo Tenant exists and get its ID
        $tenant = DB::table('tenants')->where('slug', $demoSlug)->first();
        
        if (!$tenant) {
            $tenantId = (string) Str::uuid();
            DB::table('tenants')->insert([
                'id' => $tenantId,
                'name' => 'WolePass Demo Estate',
                'slug' => $demoSlug,
                'tenant_type' => 'residential',
                'subscription_status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $tenantId = $tenant->id;
        }

        // 2. Ensure Demo Unit exists and get its ID
        $unit = DB::table('units')->where('tenant_id', $tenantId)->where('unit_label', 'Block A, Suite 101')->first();
        
        if (!$unit) {
            $unitId = (string) Str::uuid();
            DB::table('units')->insert([
                'id' => $unitId,
                'tenant_id' => $tenantId,
                'unit_label' => 'Block A, Suite 101',
                'payment_status' => 'cleared',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $unitId = $unit->id;
        }

        // 3. Create Demo Users with password: password (from the common test hash)
        $password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; 

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
        $tenant = DB::table('tenants')->where('slug', 'wolepass-demo')->first();
        
        if ($tenant) {
            DB::table('users')->where('tenant_id', $tenant->id)->delete();
            DB::table('units')->where('tenant_id', $tenant->id)->delete();
            DB::table('tenants')->where('id', $tenant->id)->delete();
        }
    }
};
