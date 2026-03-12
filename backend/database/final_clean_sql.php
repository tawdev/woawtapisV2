<?php
$inputFile = 'c:/Users/pc/Downloads/u627894251_wowtapis.sql';
$outputFile = 'c:/xampp/htdocs/Tapis/backend/database/final_clean_import.sql';

$header = "SET FOREIGN_KEY_CHECKS = 0;\nSET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';\nSET time_zone = '+00:00';\n\n";
file_put_contents($outputFile, $header);

$in = fopen($inputFile, 'r');
$out = fopen($outputFile, 'a');

while (($line = fgets($in)) !== false) {
    $trimmed = trim($line);
    // Skip problematic session variables and metadata
    if (
        preg_match('/^(SET |\/|!|--)/i', $trimmed) ||
        stripos($trimmed, 'START TRANSACTION') === 0 ||
        stripos($trimmed, 'COMMIT') === 0
    ) {
        continue;
    }
    fwrite($out, $line);
}

fclose($in);
fclose($out);
echo "Final cleaning finished.\n";
