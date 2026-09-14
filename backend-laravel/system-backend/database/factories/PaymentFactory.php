<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),

            'amount' => fake()->randomElement([
                200,
                250,
                300,
                350,
            ]),

            'payment_method' => fake()->randomElement([
                'cash',
                'gcash',
                'online',
            ]),

            'payment_status' => fake()->randomElement([
                'pending',
                'paid',
                'failed',
            ]),

            'reference_number' => fake()->unique()->numerify('PAY-######'),

            'paid_at' => fake()->optional()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}
