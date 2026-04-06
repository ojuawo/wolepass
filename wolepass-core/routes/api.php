<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GateController;
use App\Http\Controllers\Api\VisitController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/passes', [VisitController::class, 'store']);

    Route::post('/gate/validate', [GateController::class, 'validatePass']);
});
