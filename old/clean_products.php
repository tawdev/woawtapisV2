<?php
$lines = file('products.php');
// Indices are 0-based. Line 790 is index 789.
// Chunk 2: Line 1057 to 1164 (inclusive). Indices 1056 to 1163.
// Chunk 1: Line 790 to 1056 (inclusive). Indices 789 to 1055.

// Remove Chunk 2 (Later chunk first to preserve earlier indices)
// array_splice removes elements and reindexes.
// Length = 1163 - 1056 + 1 = 108 lines.
array_splice($lines, 1056, 1163 - 1056 + 1);

// Remove Chunk 1
// Length = 1055 - 789 + 1 = 267 lines.
array_splice($lines, 789, 1055 - 789 + 1);

file_put_contents('products.php', implode('', $lines));
echo "Done cleaning products.php. New line count: " . count($lines);
?>