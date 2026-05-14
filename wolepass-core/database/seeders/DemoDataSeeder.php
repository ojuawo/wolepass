<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Seeding WolePass Demo Data...');

        // 1. Create a Demo Tenant (Estate)
        $tenant = Tenant::updateOrCreate(
            ['slug' => 'wolepass-demo'],
            [
                'name' => 'WolePass Demo Estate',
                'tenant_type' => 'residential',
                'subscription_status' => 'active',
            ]
        );

        // 2. Create a Demo Unit
        $unit = Unit::updateOrCreate(
            [
                'tenant_id' => $tenant->id,
                'unit_label' => 'Block A, Suite 101'
            ],
            [
                'payment_status' => 'cleared'
            ]
        );

        // 3. Create Demo Users
        $password = 'password'; 

        $users = [
            [
                'email' => 'admin@wolepass.com',
                'name' => 'Estate Admin',
                'password' => $password,
                'global_role' => 'tenant_admin',
                'tenant_id' => $tenant->id,
            ],
            [
                'email' => 'guard@wolepass.com',
                'name' => 'Security Guard',
                'password' => $password,
                'global_role' => 'guard',
                'tenant_id' => $tenant->id,
            ],
            [
                'email' => 'resident@wolepass.com',
                'name' => 'Demo Resident',
                'password' => $password,
                'global_role' => 'resident',
                'tenant_id' => $tenant->id,
                'unit_id' => $unit->id,
            ]
        ];

        foreach ($users as $userData) {
            // updateOrCreate will trigger the 'hashed' cast in the model correctly
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
            $this->command->info('User updated/created: ' . $user->email);
        }

        $this->command->info('✅ Seeding completed!');
    }
}
