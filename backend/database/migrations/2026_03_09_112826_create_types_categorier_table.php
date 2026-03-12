<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('types_categorier', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('types_categorier');
    }
};
