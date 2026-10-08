<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'court_id' => 'required|integer|exists:courts,id',
            'booking_date' => 'required|date',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => [
                'required',
                'date_format:H:i:s',
                'after:start_time',
            ],
            // 'start_time' => [
            //     'required',
            //     'date_format:H:i:s',
            //     'after_or_equal:08:00:00',
            // ],
            // 'end_time' => [
            //     'required',
            //     'date_format:H:i:s',
            //     'after:start_time',
            //     'before_or_equal:22:00:00',
            // ],
        ];
    }
}
