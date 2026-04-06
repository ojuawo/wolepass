<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VisitApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_resident_can_generate_pass_with_phone()
    {
        $tenant = Tenant::factory()->create();
        $unit = Unit::factory()->create(['tenant_id' => $tenant->id]);
        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'unit_id' => $unit->id,
            'global_role' => 'resident',
        ]);

        Sanctum::actingAs($user, ['*']);

        Http::fake([
            'api.sendchamp.com/*' => Http::response(['status' => 'success'], 200),
        ]);

        $payload = [
            'phone_number' => '+2348000000000',
            'full_name' => 'John Doe',
            'visit_type' => 'personal',
            'expected_arrival' => now()->addDay()->toDateTimeString(),
        ];

        $response = $this->postJson('/api/passes', $payload);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'visit' => [
                         'id',
                         'otp_code',
                     ],
                     'shareable_text',
                 ]);

        $this->assertDatabaseHas('visitors', [
            'tenant_id' => $tenant->id,
            'phone_number' => '+2348000000000',
        ]);

        $this->assertDatabaseHas('visits', [
            'tenant_id' => $tenant->id,
            'unit_id' => $unit->id,
            'host_id' => $user->id,
            'visit_type' => 'personal',
            'status' => 'pending',
        ]);

        $shareableText = "Your WolePass for {$unit->unit_label} is: {$response->json('visit.otp_code')}. Show this at the gate.";
        $response->assertJsonPath('shareable_text', $shareableText);
    }

    public function test_resident_can_generate_frictionless_dispatch_pass()
    {
        $tenant = Tenant::factory()->create();
        $unit = Unit::factory()->create(['tenant_id' => $tenant->id]);
        $user = User::factory()->create([
            'tenant_id' => $tenant->id,
            'unit_id' => $unit->id,
            'global_role' => 'resident',
        ]);

        Sanctum::actingAs($user, ['*']);

        $payload = [
            'visit_type' => 'dispatch',
            'expected_arrival' => now()->addMinutes(30)->toDateTimeString(),
        ];

        $response = $this->postJson('/api/passes', $payload);

        $response->assertStatus(201);

        $this->assertDatabaseHas('visits', [
            'tenant_id' => $tenant->id,
            'unit_id' => $unit->id,
            'host_id' => $user->id,
            'visitor_id' => null,
            'visit_type' => 'dispatch',
            'status' => 'pending',
        ]);
    }
}
