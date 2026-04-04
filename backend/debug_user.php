<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('email', 'admin@waootapis.com')->first();
if ($user) {
    echo "USER FOUND: " . $user->email . "\n";
    echo "HASH: " . $user->password . "\n";
    echo "CHECK PASS 'admin123': " . (Illuminate\Support\Facades\Hash::check('admin123', $user->password) ? 'YES' : 'NO') . "\n";
} else {
    echo "USER NOT FOUND\n";
}
