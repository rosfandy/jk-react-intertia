<?php

namespace App\Http\Controllers;

use App\Models\GeneralProject;
use App\Models\Squad;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            DB::beginTransaction();
            $users = User::all();
            $squads = Squad::with('project')->get();
            DB::commit();

            Log::info('Squads:', ['data' => $squads->toArray()]);

            return Inertia::render('Dashboard', [
                'squads' => $squads->toArray(),
                'users' => $users->toArray()
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with('error', $th->getMessage());
        }
    }

    public function squad()
    {
        try {
            DB::beginTransaction();
            $users = User::all();
            $projects = GeneralProject::orderBy('created_at', 'asc')->get();
            $squads = Squad::with('project')->get();
            DB::commit();

            Log::info('Squads:', ['data' => $squads->toArray()]);

            return Inertia::render('Squad', [
                'squads' => $squads->toArray(),
                'users' => $users->toArray(),
                'projects' => $projects->toArray()
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return back()->with('error', $th->getMessage());
        }
    }
}
