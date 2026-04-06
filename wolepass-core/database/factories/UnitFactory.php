<?php

namespace Database\Factories;

use App\Models\Tenant;
use Illuminate\Database\Eloquent\Factories\Factory;

class UnitFactory extends Factory
{
    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'unit_label' => fake()->bothify('Unit-####'),
            'payment_status' => 'cleared',
        ];
    }
}
