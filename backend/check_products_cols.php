<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$cols = DB::getSchemaBuilder()->getColumnListing('products');
foreach ($cols as $col) {
    $type = DB::getSchemaBuilder()->getColumnType('products', $col);
    echo "$col : $type\n";
}
