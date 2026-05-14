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
        $this->command->info('Seeding Rich WolePass Demo Data...');

        // 1. Ensure Demo Tenant exists
        $tenant = \App\Models\Tenant::updateOrCreate(
            ['slug' => 'wolepass-demo'],
            [
                'name' => 'WolePass Demo Estate',
                'tenant_type' => 'residential',
                'subscription_status' => 'active',
            ]
        );

        // 2. Create Multiple Units
        $unit1 = \App\Models\Unit::updateOrCreate(
            ['tenant_id' => $tenant->id, 'unit_label' => 'Block A, Suite 101'],
            ['payment_status' => 'cleared']
        );
        $unit2 = \App\Models\Unit::updateOrCreate(
            ['tenant_id' => $tenant->id, 'unit_label' => 'Block B, Suite 202'],
            ['payment_status' => 'cleared']
        );
        $unit3 = \App\Models\Unit::updateOrCreate(
            ['tenant_id' => $tenant->id, 'unit_label' => 'Block C, Penthouse'],
            ['payment_status' => 'cleared']
        );

        // 3. Create Demo Users (Staff & Residents)
        $password = 'password';

        // Estate Admin
        $admin = \App\Models\User::updateOrCreate(
            ['email' => 'admin@wolepass.com'],
            [
                'name' => 'Estate Admin',
                'password' => $password,
                'global_role' => 'tenant_admin',
                'tenant_id' => $tenant->id,
            ]
        );

        // Security Guard
        $guard = \App\Models\User::updateOrCreate(
            ['email' => 'guard@wolepass.com'],
            [
                'name' => 'Security Guard',
                'password' => $password,
                'global_role' => 'guard',
                'tenant_id' => $tenant->id,
            ]
        );

        // Residents for each unit
        $resident1 = \App\Models\User::updateOrCreate(
            ['email' => 'resident1@wolepass.com'],
            [
                'name' => 'John Doe',
                'password' => $password,
                'global_role' => 'resident',
                'tenant_id' => $tenant->id,
                'unit_id' => $unit1->id,
            ]
        );

        $resident2 = \App\Models\User::updateOrCreate(
            ['email' => 'resident2@wolepass.com'],
            [
                'name' => 'Jane Smith',
                'password' => $password,
                'global_role' => 'resident',
                'tenant_id' => $tenant->id,
                'unit_id' => $unit2->id,
            ]
        );

        // 4. Create some Visitors
        $visitors = [
            ['full_name' => 'Mike Tyson', 'phone_number' => '08011112222'],
            ['full_name' => 'Elon Musk', 'phone_number' => '08033334444'],
            ['full_name' => 'Serena Williams', 'phone_number' => '08055556666'],
        ];

        $visitorModels = [];
        foreach ($visitors as $v) {
            $visitorModels[] = \App\Models\Visitor::updateOrCreate(
                ['tenant_id' => $tenant->id, 'phone_number' => $v['phone_number']],
                $v
            );
        }

        // 5. Generate Visit History
        // Upcoming Visit (Pending)
        \App\Models\Visit::create([
            'tenant_id' => $tenant->id,
            'unit_id' => $unit1->id,
            'host_id' => $resident1->id,
            'visitor_id' => $visitorModels[0]->id,
            'visit_type' => 'personal',
            'otp_code' => '123456',
            'status' => 'pending',
            'expected_arrival' => now()->addHours(2),
        ]);

        // Past Visit (Checked out)
        \App\Models\Visit::create([
            'tenant_id' => $tenant->id,
            'unit_id' => $unit2->id,
            'host_id' => $resident2->id,
            'visitor_id' => $visitorModels[1]->id,
            'visit_type' => 'service',
            'otp_code' => '654321',
            'status' => 'checked_out',
            'expected_arrival' => now()->subDays(1),
            'checked_in_at' => now()->subDays(1)->subHours(2),
        ]);

        // Active Visit (Checked in)
        \App\Models\Visit::create([
            'tenant_id' => $tenant->id,
            'unit_id' => $unit1->id,
            'host_id' => $resident1->id,
            'visitor_id' => $visitorModels[2]->id,
            'visit_type' => 'meeting',
            'otp_code' => '987654',
            'status' => 'checked_in',
            'expected_arrival' => now()->subHour(),
            'checked_in_at' => now()->subMinutes(30),
            'checked_in_by' => $guard->id,
        ]);

        $this->command->info('✅ Rich demo seeding completed!');
    }
}
