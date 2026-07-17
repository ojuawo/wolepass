<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create the estate (tenant)
        $tenant = Tenant::firstOrCreate(
            ['slug' => 'sunrise-gwarinpa-estate'],
            [
                'name'                => 'Sunrise Gwarinpa Estate',
                'tenant_type'         => 'residential',
                'subscription_status' => 'active',
            ]
        );

        // 2. Create the first unit inside that estate
        $unit = Unit::firstOrCreate(
            [
                'tenant_id'  => $tenant->id,
                'unit_label' => 'Block A, Flat 1',
            ],
            [
                'payment_status' => 'cleared',
            ]
        );

        // 2b. Create a unique Admin Unit for this estate
        $adminUnit = Unit::firstOrCreate(
            [
                'tenant_id'  => $tenant->id,
                'unit_label' => 'Management Office',
            ],
            [
                'payment_status' => 'cleared',
            ]
        );

        // 3. Create the tenant admin account
        User::firstOrCreate(
            ['email' => 'admin@gatekeep.com.ng'],
            [
                'name'        => 'Olamide Admin',
                'tenant_id'   => $tenant->id,
                'unit_id'     => $adminUnit->id,
                'password'    => Hash::make('password'),
                'global_role' => 'tenant_admin',
                'phone'       => null,
                'is_approved' => true,
            ]
        );

        // 4. Create the security guard account
        User::firstOrCreate(
            ['email' => 'guard@gatekeep.com.ng'],
            [
                'name'        => 'Main Gate Guard',
                'tenant_id'   => $tenant->id,
                'unit_id'     => null,
                'password'    => Hash::make('password'),
                'global_role' => 'guard',
                'phone'       => null,
                'is_approved' => true,
            ]
        );

        $this->command->info('✅  Sunrise Gwarinpa Estate seeded successfully.');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['tenant_admin', 'admin@gatekeep.com.ng', 'password'],
                ['guard',        'guard@gatekeep.com.ng', 'password'],
            ]
        );
        $this->command->table(
            ['Resource', 'Detail'],
            [
                ['Tenant', $tenant->name . ' (id: ' . $tenant->id . ')'],
                ['Unit',   $unit->unit_label . ' (id: ' . $unit->id . ')'],
            ]
        );
    }
}
