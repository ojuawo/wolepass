<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class TenantFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'slug' => fake()->unique()->slug(),
            'tenant_type' => fake()->randomElement(['residential', 'commercial', 'mixed']),
            'subscription_status' => 'active',
        ];
    }
}
