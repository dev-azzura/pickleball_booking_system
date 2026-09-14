<?php

namespace App\Services;

use App\Models\Court;

class CourtService
{
    public function getAllCourts()
    {
        return Court::all();
    }

    public function getCourtById(int $id)
    {
        return Court::findOrFail($id);
    }

    public function createCourt(array $courtData)
    {
        return Court::create($courtData);
    }
    public function updateCourt(Court $court, array $courtData)
    {
        $court->update($courtData);

        return $court;
    }
    public function deleteCourt(Court $court)
    {
        $court->delete();
    }
}
