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
        Schema::table('products', function (Blueprint $table) {
            // Specialized Runner / Bedside rugs
            $table->boolean('is_couloir')->default(false)->after('max_largeur');
            $table->boolean('is_tapis_de_lit')->default(false)->after('is_couloir');
            
            // Sub-category (moquita, kids, etc.)
            $table->string('sub_category')->nullable()->after('is_tapis_de_lit');
            
            // Adding index for performance
            $table->index(['is_couloir', 'is_tapis_de_lit', 'sub_category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['is_couloir', 'is_tapis_de_lit', 'sub_category']);
        });
    }
};
