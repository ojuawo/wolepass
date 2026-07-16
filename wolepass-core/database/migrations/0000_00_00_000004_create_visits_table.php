<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('unit_id')->nullable()->constrained('units')->cascadeOnDelete();
            $table->foreignUuid('host_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('visitor_id')->nullable()->constrained('visitors')->nullOnDelete();
            $table->enum('visit_type', ['personal', 'dispatch', 'service', 'meeting', 'interview']);
            $table->string('otp_code', 6);
            $table->enum('status', ['pending', 'checked_in', 'checked_out', 'expired'])->default('pending');
            $table->dateTime('expected_arrival');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
