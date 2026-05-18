<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tenant;
use App\Models\Unit;
use App\Models\User;
use App\Models\Visitor;
use App\Models\Visit;

class DemoDataSeeder extends Seeder
{
    /**
     * Estate configuration — add or remove estates here freely.
     */
    private function estateConfig(): array
    {
        return [
            // ── Estate 1: WolePass Demo ─────────────────────────────────────────
            [
                'slug'   => 'wolepass-demo',
                'name'   => 'WolePass Demo Estate',
                'type'   => 'residential',
                'status' => 'active',
                'prefix' => 'demo',
                'units'  => ['Block A, Suite 101', 'Block B, Suite 202', 'Block C, Penthouse'],
            ],

            // ── Estate 2: Lekki Gardens ─────────────────────────────────────────
            [
                'slug'   => 'lekki-gardens',
                'name'   => 'Lekki Gardens Estate',
                'type'   => 'residential',
                'status' => 'active',
                'prefix' => 'lekki',
                'units'  => ['Villa 1', 'Villa 2', 'Villa 3', 'Villa 4'],
            ],

            // ── Estate 3: Parkview Heights ──────────────────────────────────────
            [
                'slug'   => 'parkview-heights',
                'name'   => 'Parkview Heights',
                'type'   => 'residential',
                'status' => 'active',
                'prefix' => 'parkview',
                'units'  => ['Flat 1A', 'Flat 2B', 'Flat 3C', 'Flat 4D', 'Penthouse'],
            ],

            // ── Estate 4: Harmony Business Park ────────────────────────────────
            [
                'slug'   => 'harmony-bizpark',
                'name'   => 'Harmony Business Park',
                'type'   => 'commercial',
                'status' => 'active',
                'prefix' => 'harmony',
                'units'  => ['Office 101', 'Office 202', 'Office 303'],
            ],
        ];
    }

    public function run(): void
    {
        $this->command->info('🌱 Seeding multi-estate WolePass demo data...');
        $password = 'password';

        $residentNames = [
            'Adebayo Okafor', 'Chioma Nwosu', 'Emeka Eze',
            'Fatima Musa', 'Gbenga Adeyemi', 'Helen Obi',
        ];

        foreach ($this->estateConfig() as $config) {
            $this->command->line("  → Provisioning: {$config['name']}");
            $prefix = $config['prefix'];

            // 1. Create Estate (Tenant)
            $tenant = Tenant::updateOrCreate(
                ['slug' => $config['slug']],
                [
                    'name'                => $config['name'],
                    'tenant_type'         => $config['type'],
                    'subscription_status' => $config['status'],
                ]
            );

            // 2. Create Units
            $units = [];
            foreach ($config['units'] as $label) {
                $units[] = Unit::updateOrCreate(
                    ['tenant_id' => $tenant->id, 'unit_label' => $label],
                    ['payment_status' => 'cleared']
                );
            }

            // 3. Estate Admin
            $admin = User::updateOrCreate(
                ['email' => "admin@{$prefix}.wolepass.com"],
                [
                    'name'        => "{$config['name']} Admin",
                    'password'    => $password,
                    'global_role' => 'tenant_admin',
                    'tenant_id'   => $tenant->id,
                ]
            );

            // 4. Security Guard
            $guard = User::updateOrCreate(
                ['email' => "guard@{$prefix}.wolepass.com"],
                [
                    'name'        => 'Gate Security',
                    'password'    => $password,
                    'global_role' => 'guard',
                    'tenant_id'   => $tenant->id,
                ]
            );

            // 5. Residents — one per unit
            $residents = [];
            foreach ($units as $i => $unit) {
                $name  = $residentNames[$i % count($residentNames)];
                $first = strtolower(explode(' ', $name)[0]);

                $residents[] = User::updateOrCreate(
                    ['email' => "{$first}.{$i}@{$prefix}.wolepass.com"],
                    [
                        'name'        => $name,
                        'password'    => $password,
                        'global_role' => 'resident',
                        'tenant_id'   => $tenant->id,
                        'unit_id'     => $unit->id,
                    ]
                );
            }

            // 6. Visitors
            $visitors = [];
            $visitorData = [
                ['full_name' => 'Bola Tinubu Jr.', 'phone_number' => "080{$prefix}1111"],
                ['full_name' => 'Ngozi Okonkwo',   'phone_number' => "080{$prefix}2222"],
                ['full_name' => 'James Delivery',  'phone_number' => "080{$prefix}3333"],
            ];
            foreach ($visitorData as $v) {
                $visitors[] = Visitor::updateOrCreate(
                    ['tenant_id' => $tenant->id, 'phone_number' => $v['phone_number']],
                    ['full_name' => $v['full_name']]
                );
            }

            // 7. Visit History (idempotent — skip if already seeded)
            if (Visit::where('tenant_id', $tenant->id)->count() === 0) {
                Visit::create([
                    'tenant_id'        => $tenant->id,
                    'unit_id'          => $units[0]->id,
                    'host_id'          => $residents[0]->id,
                    'visitor_id'       => $visitors[0]->id,
                    'visit_type'       => 'personal',
                    'otp_code'         => str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT),
                    'status'           => 'pending',
                    'expected_arrival' => now()->addHours(2),
                ]);

                Visit::create([
                    'tenant_id'        => $tenant->id,
                    'unit_id'          => $units[count($units) > 1 ? 1 : 0]->id,
                    'host_id'          => $residents[count($residents) > 1 ? 1 : 0]->id,
                    'visitor_id'       => $visitors[1]->id,
                    'visit_type'       => 'service',
                    'otp_code'         => str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT),
                    'status'           => 'checked_out',
                    'expected_arrival' => now()->subDay(),
                    'checked_in_at'    => now()->subDay()->subHours(2),
                ]);

                Visit::create([
                    'tenant_id'        => $tenant->id,
                    'unit_id'          => $units[0]->id,
                    'host_id'          => $residents[0]->id,
                    'visitor_id'       => $visitors[2]->id,
                    'visit_type'       => 'dispatch',
                    'otp_code'         => str_pad(rand(1, 999999), 6, '0', STR_PAD_LEFT),
                    'status'           => 'checked_in',
                    'expected_arrival' => now()->subHour(),
                    'checked_in_at'    => now()->subMinutes(20),
                    'checked_in_by'    => $guard->id,
                ]);
            }

            $this->command->info("    ✅ {$config['name']} done.");
        }

        $this->command->newLine();
        $this->command->info('🎉 All estates seeded! Login credentials:');
        $this->command->newLine();
        $this->command->line('  All passwords: password');
        $this->command->line('  ──────────────────────────────────────────────────────');
        $this->command->line('  WolePass Demo   → admin@demo.wolepass.com');
        $this->command->line('                  → guard@demo.wolepass.com');
        $this->command->line('                  → adebayo.0@demo.wolepass.com  (resident)');
        $this->command->line('  ──────────────────────────────────────────────────────');
        $this->command->line('  Lekki Gardens   → admin@lekki.wolepass.com');
        $this->command->line('                  → guard@lekki.wolepass.com');
        $this->command->line('                  → adebayo.0@lekki.wolepass.com  (resident)');
        $this->command->line('  ──────────────────────────────────────────────────────');
        $this->command->line('  Parkview Heights→ admin@parkview.wolepass.com');
        $this->command->line('                  → guard@parkview.wolepass.com');
        $this->command->line('                  → adebayo.0@parkview.wolepass.com  (resident)');
        $this->command->line('  ──────────────────────────────────────────────────────');
        $this->command->line('  Harmony Biz Park→ admin@harmony.wolepass.com');
        $this->command->line('                  → guard@harmony.wolepass.com');
        $this->command->line('                  → adebayo.0@harmony.wolepass.com  (resident)');
        $this->command->line('  ──────────────────────────────────────────────────────');
    }
}
