<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$request = Illuminate\Http\Request::create('/api/products/some-slug', 'GET');
$request->headers->set('Accept', 'application/json');

$response = app()->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
if ($response->getStatusCode() !== 200) {
    echo $response->getContent() . "\n";
} else {
    echo "Product some-slug fetched successfully.\n";
}
