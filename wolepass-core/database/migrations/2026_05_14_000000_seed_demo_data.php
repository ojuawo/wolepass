<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Tenant;
use App\Models\Unit;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create a Demo Tenant (Estate)
        // firstOrCreate handles duplicates automatically
        $tenant = Tenant::firstOrCreate(
            ['slug' => 'wolepass-demo'],
            [
                'name' => 'WolePass Demo Estate',
                'tenant_type' => 'residential',
                'subscription_status' => 'active',
            ]
        );

        // 2. Create a Demo Unit
        $unit = Unit::firstOrCreate(
            [
                'tenant_id' => $tenant->id,
                'unit_label' => 'Block A, Suite 101'
            ],
            [
                'payment_status' => 'cleared'
            ]
        );

        // 3. Create Demo Users with password: password
        // Using the common Laravel test hash for 'password'
        $password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

        User::firstOrCreate(
            ['email' => 'admin@wolepass.com'],
            [
                'name' => 'Estate Admin',
                'password' => $password,
                'global_role' => 'tenant_admin',
                'tenant_id' => $tenant->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'guard@wolepass.com'],
            [
                'name' => 'Security Guard',
                'password' => $password,
                'global_role' => 'guard',
                'tenant_id' => $tenant->id,
            ]
        );

        User::firstOrCreate(
            ['email' => 'resident@wolepass.com'],
            [
                'name' => 'Demo Resident',
                'password' => $password,
                'global_role' => 'resident',
                'tenant_id' => $tenant->id,
                'unit_id' => $unit->id,
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tenant = Tenant::where('slug', 'wolepass-demo')->first();
        
        if ($tenant) {
            User::where('tenant_id', $tenant->id)->delete();
            Unit::where('tenant_id', $tenant->id)->delete();
            $tenant->delete();
        }
    }
};
