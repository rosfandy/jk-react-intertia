<?php

namespace App\Http\Controllers;

use App\Models\GeneralProject;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function getAll()
    {
        try {
            $projects = GeneralProject::all();
            return response()->json($projects);
        } catch (\Throwable $th) {
            return response()->json($th->getMessage());
        }
    }
}
