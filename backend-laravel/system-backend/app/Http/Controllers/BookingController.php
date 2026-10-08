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

    public function index(Request $request)
    {
        try {
            $bookings = $this->bookingService->getAllBookings();

            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $bookings
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return response()->json([
                'error' => $errorMessage
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function show(int $id)
    {
        // try {
            $booking = $this->bookingService->getBookingById($id);

            return response()->json([
                'status' => Response::HTTP_OK,
                'data' => $booking
            ], Response::HTTP_OK);

        // } catch (\Exception $e) {
        //     return response()->json([
        //         'error' => $e->getMessage()
        //     ], Response::HTTP_INTERNAL_SERVER_ERROR);
        // }
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
            return response()->json([
                'status' => Response::HTTP_CONFLICT,
                'message' => $e->getMessage()
            ], Response::HTTP_CONFLICT);
        }
    }
}
