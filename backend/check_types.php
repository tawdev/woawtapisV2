<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$types = DB::table('types')->get();
foreach ($types as $t) {
    echo $t->id . ' | ' . $t->name . ' | ' . ($t->slug ?? 'no-slug') . PHP_EOL;
}
