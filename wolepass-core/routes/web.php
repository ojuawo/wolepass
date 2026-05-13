<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// Temporary deployment route - DELETE AFTER USE
Route::get('/init-db', function () {
    try {
        Artisan::call('migrate:fresh --seed');
        return "✅ Database migrated and seeded successfully!";
    } catch (\Exception $e) {
        return "❌ Error: " . $e->getMessage();
    }
});
