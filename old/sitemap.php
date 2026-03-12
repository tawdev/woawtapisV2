<?php
/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap.xml for all products, categories, and pages
 */

header('Content-Type: application/xml; charset=utf-8');

require_once 'config/database.php';
require_once 'config/functions.php';

$db = getDB();
$baseUrl = rtrim(SITE_URL, '/');
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$domain = $protocol . $_SERVER['HTTP_HOST'];

// Get current date
$lastmod = date('Y-m-d');

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";

// Homepage
echo "  <url>\n";
echo "    <loc>" . htmlspecialchars($baseUrl . '/index.php') . "</loc>\n";
echo "    <lastmod>" . $lastmod . "</lastmod>\n";
echo "    <changefreq>daily</changefreq>\n";
echo "    <priority>1.0</priority>\n";
echo "  </url>\n";

// Products page
echo "  <url>\n";
echo "    <loc>" . htmlspecialchars($baseUrl . '/products.php') . "</loc>\n";
echo "    <lastmod>" . $lastmod . "</lastmod>\n";
echo "    <changefreq>daily</changefreq>\n";
echo "    <priority>0.9</priority>\n";
echo "  </url>\n";

// Categories page
echo "  <url>\n";
echo "    <loc>" . htmlspecialchars($baseUrl . '/categories.php') . "</loc>\n";
echo "    <lastmod>" . $lastmod . "</lastmod>\n";
echo "    <changefreq>weekly</changefreq>\n";
echo "    <priority>0.8</priority>\n";
echo "  </url>\n";

// About page
echo "  <url>\n";
echo "    <loc>" . htmlspecialchars($baseUrl . '/about.php') . "</loc>\n";
echo "    <lastmod>" . $lastmod . "</lastmod>\n";
echo "    <changefreq>monthly</changefreq>\n";
echo "    <priority>0.7</priority>\n";
echo "  </url>\n";

// Contact page
echo "  <url>\n";
echo "    <loc>" . htmlspecialchars($baseUrl . '/contact.php') . "</loc>\n";
echo "    <lastmod>" . $lastmod . "</lastmod>\n";
echo "    <changefreq>monthly</changefreq>\n";
echo "    <priority>0.7</priority>\n";
echo "  </url>\n";

// Get all active products
$stmt = $db->query("SELECT p.id, p.name, p.updated_at, 
                    (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
                    FROM products p 
                    WHERE p.status = 'active' 
                    ORDER BY p.updated_at DESC");
$products = $stmt->fetchAll();

foreach ($products as $product) {
    $productUrl = $baseUrl . '/product.php?id=' . $product['id'];
    $productLastmod = !empty($product['updated_at']) ? date('Y-m-d', strtotime($product['updated_at'])) : $lastmod;
    
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($productUrl) . "</loc>\n";
    echo "    <lastmod>" . $productLastmod . "</lastmod>\n";
    echo "    <changefreq>weekly</changefreq>\n";
    echo "    <priority>0.8</priority>\n";
    
    // Add product image if available
    if (!empty($product['image'])) {
        $imageUrl = $baseUrl . '/' . ltrim($product['image'], '/');
        echo "    <image:image>\n";
        echo "      <image:loc>" . htmlspecialchars($imageUrl) . "</image:loc>\n";
        echo "      <image:title>" . htmlspecialchars($product['name']) . "</image:title>\n";
        echo "      <image:caption>" . htmlspecialchars($product['name']) . "</image:caption>\n";
        echo "    </image:image>\n";
    }
    
    echo "  </url>\n";
}

// Get all categories
$stmt = $db->query("SELECT id, name, updated_at FROM categories ORDER BY name");
$categories = $stmt->fetchAll();

foreach ($categories as $category) {
    $categoryUrl = $baseUrl . '/products.php?category=' . $category['id'];
    $categoryLastmod = !empty($category['updated_at']) ? date('Y-m-d', strtotime($category['updated_at'])) : $lastmod;
    
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($categoryUrl) . "</loc>\n";
    echo "    <lastmod>" . $categoryLastmod . "</lastmod>\n";
    echo "    <changefreq>weekly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}

echo '</urlset>';

