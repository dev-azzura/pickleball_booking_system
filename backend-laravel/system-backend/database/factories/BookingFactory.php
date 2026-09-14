<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\User;
use App\Models\Court;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('08:00', '20:00');
        $endTime = (clone $startTime)->modify('+1 hour');

        return [
            'user_id' => User::factory(),
            'court_id' => Court::factory(),

            'booking_date' => fake()->dateTimeBetween('today', '+30 days')
                ->format('Y-m-d'),

            'start_time' => $startTime->format('H:i:s'),
            'end_time' => $endTime->format('H:i:s'),

            'status' => fake()->randomElement([
                'pending',
                'confirmed',
                'cancelled',
            ]),

            'total_amount' => fake()->randomElement([
                200,
                250,
                300,
                350,
            ]),
        ];
    }
}
