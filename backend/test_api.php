<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$request = Illuminate\Http\Request::create('/api/admin/products/47', 'GET');
$request->headers->set('Accept', 'application/json');

$user = App\Models\User::first();
if ($user) {
    $request->setUserResolver(function () use ($user) {
        return $user;
    });
}
$response = app()->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
if ($response->getStatusCode() !== 200) {
    $data = json_decode($response->getContent(), true);
    if ($data) {
        echo "Error: " . $data['message'] . "\n";
        echo "Exception: " . $data['exception'] . "\n";
        echo "File: " . $data['file'] . " Line: " . $data['line'] . "\n";
    } else {
        echo "Response was not JSON:\n" . substr($response->getContent(), 0, 500) . "\n";
    }
} else {
    echo "Product 47 fetched successfully.\n";
}
