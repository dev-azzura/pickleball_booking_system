<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CourtRequest;
use App\Models\Court;
use App\Services\CourtService;
use Symfony\Component\HttpFoundation\File\Exception\NoTmpDirFileException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CourtController extends Controller
{
    protected CourtService $courtService;

    public function __construct(CourtService $courtService)
    {
        $this->courtService = $courtService;
    }

    public function index(Request $request)
    {
        try {
            $courts = $this->courtService->getAllCourts();

            return response()->json(
                $courts,
                Response::HTTP_OK
            );
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return response()->json([
                'error' => $errorMessage
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function show(int $id)
    {
        try {
            $court = $this->courtService->getCourtById($id);

            if (!$court) {
                return response()->json(['message' => 'Court not found'], Response::HTTP_NOT_FOUND);
            }

            return response()->json($court, Response::HTTP_OK);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return response()->json([
                'error' => $errorMessage
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function store(CourtRequest $request)
    {
        try {
            $courtData = $request->validated();

            $court = $this->courtService->createCourt($courtData);

            if ($court) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Court created succesfully'
                ], Response::HTTP_CREATED);
            } else {
                return response()->json([
                    'status' => 500,
                    'message' => 'Court creation failed'
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return response()->json([
                'error' => $errorMessage
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function update(CourtRequest $request, Court $court)
    {
        try {
            $courtData = $request->validated();

            $court = $this->courtService->updateCourt($court, $courtData);

            return response()->json([
                'status' => 200,
                'message' => 'Court updated successfully',
                'data' => $court
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return response()->json([
                'error' => $errorMessage
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function destroy(int $id)
    {
        try {
            $court = Court::findOrFail($id);

            $this->courtService->deleteCourt($court);

            return response()->json([
                'message' => 'Court deleted succesfully'
                ]);
        } catch (\Exception $e) {
            $errorMessage = $e->getMessage();

            return response()->json([
                'error' => $errorMessage
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
