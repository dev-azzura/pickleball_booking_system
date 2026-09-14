<?php

namespace Database\Factories;

use App\Models\Court;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Court>
 */
class CourtFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Court ' . fake()->numberBetween(1, 10),
            'type' => fake()->randomElement(['Indoor', 'Outdoor']),
            'description' => fake()->sentence(),
            'hourly_rate' => fake()->randomElement([200, 250, 300, 350]),
            'status' => fake()->randomElement(['available', 'unavailable']),
        ];
    }
}
