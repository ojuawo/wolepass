<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_approved')->default(false);
        });

        // Set existing admins and guards as approved
        DB::table('users')->whereIn('global_role', ['tenant_admin', 'guard', 'super_admin'])->update(['is_approved' => true]);
        // Also approve existing demo residents so seeding works seamlessly
        DB::table('users')->where('global_role', 'resident')->update(['is_approved' => true]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_approved');
        });
    }
};
