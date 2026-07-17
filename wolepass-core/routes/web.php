<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return response()->json([
        'success' => false,
        'message' => 'Unauthenticated.',
        'code'    => 'UNAUTHENTICATED',
    ], 401);
})->name('login');

// Temporary deployment route - DELETE AFTER USE
Route::get('/init-db', function () {
    try {
        Artisan::call('migrate:fresh', [
            '--force' => true,
            '--seed' => true
        ]);
        return "✅ Database migrated and seeded successfully!";
    } catch (\Exception $e) {
        return "❌ Error: " . $e->getMessage();
    }
});
