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
        try {
            Schema::table('products', function (Blueprint $table) {
                $table->index('name');
                $table->index('material');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('categories', function (Blueprint $table) {
                $table->index('name');
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('types', function (Blueprint $table) {
                $table->index('name');
            });
        } catch (\Exception $e) {}
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            Schema::table('products', function (Blueprint $table) {
                $table->dropIndex(['name']);
                $table->dropIndex(['material']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('categories', function (Blueprint $table) {
                $table->dropIndex(['name']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('types', function (Blueprint $table) {
                $table->dropIndex(['name']);
            });
        } catch (\Exception $e) {}
    }
};
