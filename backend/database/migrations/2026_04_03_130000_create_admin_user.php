<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if admin user exists, if not create one
        if (!User::where('email', 'admin@waootapis.com')->exists()) {
            User::create([
                'name' => 'Admin WoawTapis',
                'email' => 'admin@waootapis.com',
                'password' => Hash::make('admin123'), // Change this password after login
            ]);
            echo "Admin user created successfully.\n";
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No reverse needed
    }
};
