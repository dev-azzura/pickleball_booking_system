<?php

use App\Http\Controllers\CourtController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

Route::get('/courts', [CourtController::class, 'index'])->name('courts.index');
Route::prefix('/courts')->group(function () {
    Route::get('/{id}', [CourtController::class, 'show'])->name('courts.show');
    Route::post('/', [CourtController::class, 'store'])->name('courts.store');
    Route::put('/{court}', [CourtController::class, 'update'])->name('courts.update');
    Route::delete('/{id}', [CourtController::class, 'destroy'])->name('courts.destroy');
});

Route::post('/bookings', [BookingController::class, 'store'])
    ->name('bookings.store');