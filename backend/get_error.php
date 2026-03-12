<?php
$lines = file(__DIR__ . '/storage/logs/laravel.log');
$exceptions = [];
$currentException = [];
$inException = false;

foreach ($lines as $line) {
    if (preg_match('/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] local\.ERROR:/', $line)) {
        if (!empty($currentException)) {
            $exceptions[] = $currentException;
        }
        $currentException = [$line];
        $inException = true;
    } elseif ($inException) {
        $currentException[] = $line;
        if (strpos($line, '"}') === 0 || preg_match('/Stack trace:/', $line) === false && count($currentException) > 50) {
            // we probably got enough of the stack trace
        }
    }
}
if (!empty($currentException)) {
    $exceptions[] = $currentException;
}

if (!empty($exceptions)) {
    $lastException = end($exceptions);
    echo implode("", array_slice($lastException, 0, 30));
} else {
    echo "No exceptions found in log.\n";
}
