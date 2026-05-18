<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BillingController;
use App\Http\Controllers\Api\GateController;
use App\Http\Controllers\Api\NoticeController;
use App\Http\Controllers\Api\SyncController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\TicketController;

// ── Public routes (no auth required) ─────────────────────────────────────────
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Paystack webhook — public, but signature-verified inside the controller
Route::post('/webhooks/paystack', [BillingController::class, 'webhook']);

// ── Authenticated routes (Sanctum token required) ────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Pass generation — additionally gated by active subscription check
    Route::post('/passes', [VisitController::class, 'store'])
        ->middleware('subscription.active');

    // Billing
    Route::post('/billing/initialize', [BillingController::class, 'initialize']);

    // Gate terminal — validate & offline sync
    Route::post('/gate/validate', [GateController::class, 'validatePass']);
    Route::get('/gate/sync',      [SyncController::class, 'download']);
    Route::post('/gate/sync',     [SyncController::class, 'upload']);

    // ── Community Noticeboard ──────────────────────────────────────────────────
    Route::get('/notices',                    [NoticeController::class, 'index']);
    Route::post('/notices',                   [NoticeController::class, 'store']);
    Route::delete('/notices/{notice}',        [NoticeController::class, 'destroy']);
    Route::post('/notices/{notice}/vote',     [NoticeController::class, 'vote']);

    // ── Maintenance Ticketing ──────────────────────────────────────────────────
    Route::get('/tickets',                    [TicketController::class, 'index']);
    Route::post('/tickets',                   [TicketController::class, 'store']);
    Route::get('/tickets/staff',              [TicketController::class, 'staff']);
    Route::get('/tickets/{ticket}',           [TicketController::class, 'show']);
    Route::post('/tickets/{ticket}',          [TicketController::class, 'update']); // Using POST for updates so multipart/form-data works easily in PHP
    Route::post('/tickets/{ticket}/comments', [TicketController::class, 'addComment']);
});
