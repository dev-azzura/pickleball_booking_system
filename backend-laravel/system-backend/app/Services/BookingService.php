<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Court;
use Illuminate\Support\Carbon;

class BookingService
{
    public function getAllBookings()
    {
        return Booking::all();
    }

    public function getBookingById(int $id)
    {
        return Booking::findOrFail($id);
    }

    public function createBooking(array $bookingData)
    {
        $court = Court::findOrFail($bookingData['court_id']);

        $existingBooking = Booking::where('court_id', $bookingData['court_id'])
            ->where('booking_date', $bookingData['booking_date'])
            ->where('start_time', '<', $bookingData['end_time'])
            ->where('end_time', '>', $bookingData['start_time'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if ($existingBooking) {
            throw new \Exception('The court is already booked for this time.');
        }

        $startTime = Carbon::createFromFormat('H:i:s', $bookingData['start_time']);
        $endTime = Carbon::createFromFormat('H:i:s', $bookingData['end_time']);

        $duration = $startTime->diffInMinutes($endTime) / 60;

       $totalAmount = $court->hourly_rate * $duration;

        return Booking::create([
            'user_id' => $bookingData['user_id'],
            'court_id' => $bookingData['court_id'],
            'booking_date' => $bookingData['booking_date'],
            'start_time' => $bookingData['start_time'],
            'end_time' => $bookingData['end_time'],
            'status' => 'pending',
            'total_amount' => $totalAmount,
        ]);
    }
    public function updateBooking(Booking $booking, array $bookingData)
    {
        $booking->update($bookingData);

        return $booking;
    }
    public function deleteBooking(Booking $booking)
    {
        $booking->delete();
    }
}
