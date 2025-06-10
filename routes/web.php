<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SquadController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/squad', [DashboardController::class, 'squad'])->name('squad');
    Route::post('/squad/store', [SquadController::class, 'store'])->name('squad.store');
    Route::put('/squad/store/{id}', [SquadController::class, 'update'])->name('squad.update');
    Route::delete('/squad/delete/{id}', [SquadController::class, 'delete'])->name('squad.delete');
});

require __DIR__ . '/auth.php';
