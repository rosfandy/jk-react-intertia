<?php

namespace App\Http\Controllers;

use App\Models\Squad;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class SquadController extends Controller
{
    public function store(Request $request)
    {

        try {
            Log::info($request);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'general_project_id' => 'required|exists:general_projects,id',
                'anggota' => 'required|array',
            ]);
            $squad = Squad::create([
                'Name' => $validated['name'],
                'general_project_id' => $validated['general_project_id'],
                'anggota' => $validated['anggota'],
            ]);

            return back()->with('success', 'Squad created successfully.');
        } catch (Exception $e) {
            Log::error('Failed to create squad: ' . $e->getMessage());

            return back()->with('error', 'Failed to create squad. Please try again.');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'general_project_id' => 'nullable|exists:general_projects,id',
                'anggota' => 'nullable|array',
                'anggota.*' => 'exists:users,id'
            ]);


            $squad = Squad::findOrFail($id);

            $squad->update([
                'Name' => $validated['name'],
                'general_project_id' => $validated['general_project_id'],
                'anggota' => $validated['anggota'] ?? []
            ]);

            return redirect()->back()->with('success', 'Squad berhasil diupdate');
        } catch (ValidationException $e) {
            Log::error('Validation error: ', $e->errors());
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (ModelNotFoundException $e) {
            Log::error('Squad not found: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Squad tidak ditemukan');
        } catch (\Throwable $th) {
            Log::error('Error updating squad: ' . $th->getMessage());
            return redirect()->back()->with('error', 'Terjadi kesalahan saat mengupdate squad');
        }
    }


    public function delete($id)
    {
        $squad = Squad::find($id);

        if (!$squad) {
            return redirect()->back()->with('error', 'Squad tidak ditemukan.');
        }

        $squad->delete();

        return redirect()->route('squad')->with('success', 'Squad berhasil dihapus.');
    }
}
