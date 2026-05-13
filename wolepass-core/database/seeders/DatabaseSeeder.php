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

        // 3. Create the tenant admin account
        User::firstOrCreate(
            ['email' => 'admin@wolepass.com'],
            [
                'name'        => 'Olamide Admin',
                'tenant_id'   => $tenant->id,
                'unit_id'     => $unit->id,
                'password'    => Hash::make('password'),
                'global_role' => 'tenant_admin',
                'phone'       => null,
            ]
        );

        // 4. Create the security guard account
        User::firstOrCreate(
            ['email' => 'guard@wolepass.com'],
            [
                'name'        => 'Main Gate Guard',
                'tenant_id'   => $tenant->id,
                'unit_id'     => null,
                'password'    => Hash::make('password'),
                'global_role' => 'guard',
                'phone'       => null,
            ]
        );

        $this->command->info('✅  Sunrise Gwarinpa Estate seeded successfully.');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['tenant_admin', 'admin@wolepass.com', 'password'],
                ['guard',        'guard@wolepass.com', 'password'],
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
