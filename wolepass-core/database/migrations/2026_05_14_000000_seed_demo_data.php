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
        $tenantId = (string) Str::uuid();
        $unitId = (string) Str::uuid();

        // 1. Create a Demo Tenant (Estate)
        DB::table('tenants')->insert([
            'id' => $tenantId,
            'name' => 'WolePass Demo Estate',
            'slug' => 'wolepass-demo',
            'tenant_type' => 'residential',
            'subscription_status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Create a Demo Unit
        DB::table('units')->insert([
            'id' => $unitId,
            'tenant_id' => $tenantId,
            'unit_label' => 'Block A, Suite 101',
            'payment_status' => 'cleared',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Create Demo Users with password: password123
        $password = Hash::make('password123');

        DB::table('users')->insert([
            [
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenantId,
                'unit_id' => null,
                'name' => 'Estate Admin',
                'email' => 'admin@wolepass.com',
                'password' => $password,
                'global_role' => 'tenant_admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenantId,
                'unit_id' => null,
                'name' => 'Security Guard',
                'email' => 'guard@wolepass.com',
                'password' => $password,
                'global_role' => 'guard',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => (string) Str::uuid(),
                'tenant_id' => $tenantId,
                'unit_id' => $unitId,
                'name' => 'Demo Resident',
                'email' => 'resident@wolepass.com',
                'password' => $password,
                'global_role' => 'resident',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Find the demo tenant to clean up related data
        $tenant = DB::table('tenants')->where('slug', 'wolepass-demo')->first();
        
        if ($tenant) {
            DB::table('users')->where('tenant_id', $tenant->id)->delete();
            DB::table('units')->where('tenant_id', $tenant->id)->delete();
            DB::table('tenants')->where('id', $tenant->id)->delete();
        }
    }
};
