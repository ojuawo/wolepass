<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('paystack_customer_code')->nullable()->after('subscription_status');
            $table->dateTime('subscription_ends_at')->nullable()->after('paystack_customer_code');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['paystack_customer_code', 'subscription_ends_at']);
        });
    }
};
