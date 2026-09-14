<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingRequest;
use Illuminate\Http\Request;
use App\Services\BookingService;
use Symfony\Component\HttpFoundation\Response;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function store(BookingRequest $request)
    {
        try {
            $bookingData = $request->validated();

            $booking = $this->bookingService->createBooking($bookingData);

            return response()->json([
                'status' => 200,
                'message' => 'Booking created successfully',
                'data' => $booking
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return response()->json([
                'error' => $errorMessage
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
