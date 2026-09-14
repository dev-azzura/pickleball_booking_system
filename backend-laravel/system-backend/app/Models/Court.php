<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Court extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
        'description',
        'hourly_rate',
        'status',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
