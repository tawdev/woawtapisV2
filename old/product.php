<?php
session_start();
require_once 'config/database.php';
require_once 'config/functions.php';

$db = getDB();

$productId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($productId == 0) {
    redirect('products.php');
}

// Récupérer le produit avec le type
$stmt = $db->prepare("SELECT p.*, c.name as category_name, c.slug as category_slug, t.name as type_name
                      FROM products p 
                      LEFT JOIN categories c ON p.category_id = c.id 
                      LEFT JOIN types t ON p.type_id = t.id
                      WHERE p.id = :id AND p.status = 'active'");
$stmt->execute([':id' => $productId]);
$product = $stmt->fetch();

// Vérifier le type pour adapter l'affichage des dimensions
$showDimensionsCalculator = true;
$isSurMesure = false;
// Dimensions max en cm pour les produits sur mesure (dérivées de size, ex: "200x300")
$maxWidthCm = null;
$maxHeightCm = null;
if (!empty($product['type_name'])) {
    $typeName = strtolower(trim($product['type_name']));
    if ($typeName === 'authentique' || $typeName === 'authentic' || $typeName === 'fixe' || $typeName === 'fix') {
        // Ces types n'ont PAS de calculateur de dimensions
        $showDimensionsCalculator = false;
    } elseif ($typeName === 'sur_mesure' || $typeName === 'sur mesure') {
        // Type sur mesure : on garde le calculateur et on traitera la taille comme dimensions max
        $isSurMesure = true;
        if (!empty($product['size']) && strpos($product['size'], 'x') !== false) {
            $parts = explode('x', strtolower($product['size']));
            $maxWidthCm = isset($parts[0]) ? (float)trim($parts[0]) : null;
            $maxHeightCm = isset($parts[1]) ? (float)trim($parts[1]) : null;
        }
    }
}

if (!$product) {
    redirect('products.php');
}

// Calculer le prix unitaire (utilisé dans le head pour SEO)
$unitPrice = $product['sale_price'] ? $product['sale_price'] : $product['price'];

// Récupérer les images
$stmt = $db->prepare("SELECT * FROM product_images WHERE product_id = :id ORDER BY is_primary DESC, display_order ASC");
$stmt->execute([':id' => $productId]);
$images = $stmt->fetchAll();

// Traiter les couleurs (support JSON et format simple)
$colorsData = [];
$hasMultipleColors = false;
if (!empty($product['color'])) {
    $colorJson = json_decode($product['color'], true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($colorJson)) {
        // Format JSON (nouveau format avec couleurs multiples)
        $colorsData = $colorJson;
        $hasMultipleColors = count($colorsData) > 0;
    } else {
        // Format texte simple (ancien format)
        $colorsData = [['name' => $product['color'], 'index' => 1]];
        $hasMultipleColors = false;
    }
}

// Récupérer les produits similaires
// Priorité 1: Produits avec le même type_id si le produit actuel en a un
// Priorité 2: Produits avec le même category_id
$relatedProducts = [];

if (!empty($product['type_id'])) {
    // Le produit a un type_id, chercher les produits avec le même type_id
    $stmt = $db->prepare("SELECT p.*, t.name as type_name,
                          (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
                          COALESCE(p.sale_price, p.price) as unit_price
                          FROM products p 
                          LEFT JOIN types t ON p.type_id = t.id
                          WHERE p.type_id = :type_id AND p.id != :id AND p.status = 'active'
                          ORDER BY RAND()
                          LIMIT 4");
    $stmt->execute([':type_id' => $product['type_id'], ':id' => $productId]);
    $relatedProducts = $stmt->fetchAll();
}

// Si pas assez de produits (ou pas de type_id), compléter/remplacer avec des produits de la même catégorie
if (count($relatedProducts) < 4 && !empty($product['category_id'])) {
    $needed = 4 - count($relatedProducts);
    $excludeIds = [$productId];
    foreach ($relatedProducts as $rp) {
        $excludeIds[] = (int)$rp['id'];
    }
    
    // Construire la requête avec des placeholders sécurisés
    $placeholders = [];
    $params = [':category_id' => $product['category_id']];
    
    foreach ($excludeIds as $index => $excludeId) {
        $key = ':exclude_' . $index;
        $placeholders[] = $key;
        $params[$key] = $excludeId;
    }
    
    $excludeClause = !empty($placeholders) ? 'AND p.id NOT IN (' . implode(',', $placeholders) . ')' : '';
    
    $sql = "SELECT p.*, t.name as type_name,
            (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
            COALESCE(p.sale_price, p.price) as unit_price
            FROM products p 
            LEFT JOIN types t ON p.type_id = t.id
            WHERE p.category_id = :category_id $excludeClause AND p.status = 'active'
            ORDER BY RAND()
            LIMIT :limit";
    
    $stmt = $db->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value, PDO::PARAM_INT);
    }
    $stmt->bindValue(':limit', $needed, PDO::PARAM_INT);
    $stmt->execute();
    $categoryProducts = $stmt->fetchAll();
    
    $relatedProducts = array_merge($relatedProducts, $categoryProducts);
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    // SEO Meta Tags
    $baseUrl = rtrim(SITE_URL, '/');
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
    $currentUrl = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    
    // Get product image
    $productImage = '';
    if ($hasMultipleColors && !empty($colorsData[0]['image'])) {
        $productImage = $colorsData[0]['image'];
    } elseif (count($images) > 0) {
        $productImage = $images[0]['image_path'];
    }
    $productImageUrl = $productImage ? $baseUrl . '/' . ltrim($productImage, '/') : $baseUrl . '/assets/images/Gemini_Generated_Image_3bho863bho863bho (1).png';
    
    // Build SEO optimized title and description
    $productName = clean($product['name']);
    $categoryName = clean($product['category_name']);
    $pageTitle = $productName . ' - ' . $categoryName . ' | ' . SITE_NAME;
    $pageDescription = !empty($product['short_description']) 
        ? clean($product['short_description']) 
        : 'Découvrez ' . $productName . ', un tapis ' . $categoryName . ' de qualité supérieure. ' . (!empty($product['material']) ? 'Matériau: ' . clean($product['material']) . '. ' : '') . 'Prix: ' . formatPrice($unitPrice) . '.';
    $pageKeywords = strtolower($productName . ', ' . $categoryName . ', tapis, tapis marocain, tapis de luxe');
    if (!empty($product['material'])) {
        $pageKeywords .= ', ' . strtolower($product['material']);
    }
    $pageType = 'product';
    $canonicalUrl = $baseUrl . '/product.php?id=' . $product['id'];
    
    // Structured Data for Product
    $offers = [
        '@type' => 'Offer',
        'price' => $unitPrice,
        'priceCurrency' => 'MAD',
        'availability' => $product['stock'] > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'url' => $canonicalUrl,
        'priceValidUntil' => date('Y-m-d', strtotime('+1 year'))
    ];
    
    if ($product['sale_price']) {
        $offers['priceSpecification'] = [
            '@type' => 'UnitPriceSpecification',
            'price' => $product['sale_price'],
            'priceCurrency' => 'MAD',
            'referenceQuantity' => [
                '@type' => 'QuantitativeValue',
                'value' => 1,
                'unitCode' => 'MTK'
            ]
        ];
    }
    
    $structuredData = [
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => $productName,
        'description' => !empty($product['description']) ? clean($product['description']) : $pageDescription,
        'image' => $productImageUrl,
        'sku' => 'TAP-' . $product['id'],
        'brand' => [
            '@type' => 'Brand',
            'name' => SITE_NAME
        ],
        'category' => $categoryName,
        'offers' => $offers,
        'aggregateRating' => [
            '@type' => 'AggregateRating',
            'ratingValue' => '4.5',
            'reviewCount' => '10'
        ]
    ];
    
    if (!empty($product['material'])) {
        $structuredData['material'] = clean($product['material']);
    }
    
    if (!empty($product['size'])) {
        $structuredData['size'] = clean($product['size']);
    }
    
    // Add breadcrumb structured data
    $breadcrumbData = [
        '@context' => 'https://schema.org',
        '@type' => 'BreadcrumbList',
        'itemListElement' => [
            [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'Accueil',
                'item' => $baseUrl
            ],
            [
                '@type' => 'ListItem',
                'position' => 2,
                'name' => 'Produits',
                'item' => $baseUrl . '/products.php'
            ],
            [
                '@type' => 'ListItem',
                'position' => 3,
                'name' => $categoryName,
                'item' => $baseUrl . '/products.php?category=' . $product['category_id']
            ],
            [
                '@type' => 'ListItem',
                'position' => 4,
                'name' => $productName,
                'item' => $canonicalUrl
            ]
        ]
    ];
    
    include 'includes/seo_head.php';
    ?>
    <script type="application/ld+json">
    <?php echo json_encode($breadcrumbData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT); ?>
    </script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="product-page">
        <div class="container">
            <a href="javascript:history.back()" class="btn-back">
                <span>←</span> Retour
            </a>
            

            <div class="product-detail">
                <!-- Images du produit -->
                <div class="product-images">
                    <div class="product-main-image">
                        <?php 
                        // Déterminer l'image principale : priorité à la première couleur avec image, sinon première image du produit
                        $mainImageSrc = '';
                        if ($hasMultipleColors && !empty($colorsData[0]['image'])) {
                            $mainImageSrc = $colorsData[0]['image'];
                        } elseif (count($images) > 0) {
                            $mainImageSrc = $images[0]['image_path'];
                        }
                        ?>
                        <?php if ($mainImageSrc): ?>
                            <img id="main-image" 
                                 src="<?php echo clean($mainImageSrc); ?>" 
                                 alt="<?php echo clean($product['name']); ?> - Tapis <?php echo clean($product['category_name']); ?> - waootapis"
                                 data-default-image="<?php echo clean($mainImageSrc); ?>"
                                 style="width: 100%; height: auto; border-radius: 8px; transition: opacity 0.3s ease;"
                                 width="600"
                                 height="600">
                        <?php else: ?>
                            <div class="placeholder-image large">Image</div>
                        <?php endif; ?>
                    </div>
                    <?php if (count($images) > 1): ?>
                        <div class="product-thumbnails">
                            <?php foreach ($images as $index => $image): ?>
                                <?php 
                                // Trouver la couleur correspondante à cette image
                                $matchingColor = null;
                                $matchingColorName = '';
                                if ($hasMultipleColors && count($colorsData) > 0) {
                                    $imagePath = $image['image_path'];
                                    $imageFileName = basename($imagePath);
                                    
                                    // Stratégie 1: Comparer par chemin exact
                                    foreach ($colorsData as $colorItem) {
                                        if (isset($colorItem['image']) && !empty($colorItem['image'])) {
                                            $colorImagePath = $colorItem['image'];
                                            $colorImageFileName = basename($colorImagePath);
                                            
                                            // Normaliser les chemins
                                            $normalizedImagePath = ltrim($imagePath, './');
                                            $normalizedColorPath = ltrim($colorImagePath, './');
                                            
                                            if ($colorImagePath === $imagePath || 
                                                $normalizedColorPath === $normalizedImagePath ||
                                                $colorImageFileName === $imageFileName ||
                                                strpos($imagePath, $colorImageFileName) !== false ||
                                                strpos($colorImagePath, $imageFileName) !== false) {
                                                $matchingColor = $colorItem;
                                                $matchingColorName = $colorItem['name'];
                                                break;
                                            }
                                        }
                                    }
                                    
                                    // Stratégie 2: Si pas de correspondance, associer par index/ordre
                                    // (Image 1 = Couleur 1, Image 2 = Couleur 2, etc.)
                                    if (empty($matchingColorName) && $index < count($colorsData)) {
                                        $matchingColor = $colorsData[$index];
                                        $matchingColorName = isset($colorsData[$index]['name']) ? $colorsData[$index]['name'] : '';
                                        // Debug
                                        // echo "<!-- Association par index: Image $index -> Couleur: $matchingColorName -->";
                                    }
                                }
                                ?>
                                <img src="<?php echo clean($image['image_path']); ?>" 
                                     alt="<?php echo clean($product['name']); ?> - Vue <?php echo $index + 1; ?> - waootapis" 
                                     class="thumbnail <?php echo $index == 0 ? 'active' : ''; ?>"
                                     data-image-path="<?php echo clean($image['image_path']); ?>"
                                     data-color-name="<?php echo $matchingColorName ? clean($matchingColorName) : ''; ?>"
                                     onclick="changeMainImage('<?php echo clean($image['image_path']); ?>', this, '<?php echo $matchingColorName ? clean($matchingColorName) : ''; ?>')"
                                     loading="lazy"
                                     width="100"
                                     height="100">
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>

                <!-- Informations du produit -->
                <div class="product-info-detail">
                    <h1><?php echo clean($product['name']); ?> - Tapis <?php echo clean($product['category_name']); ?></h1>
                    <p class="product-category-link">
                        <a href="products.php?category=<?php echo $product['category_id']; ?>">
                            <?php echo clean($product['category_name']); ?>
                        </a>
                    </p>

                    <div class="product-price-detail">
                        <?php if ($product['sale_price']): ?>
                            <span class="old-price"><?php echo formatPrice($product['price']); ?></span>
                            <span class="current-price"><?php echo formatPrice($product['sale_price']); ?></span>
                            <?php 
                            $discount = round((($product['price'] - $product['sale_price']) / $product['price']) * 100);
                            ?>
                            <span class="discount-badge">-<?php echo $discount; ?>%</span>
                        <?php else: ?>
                            <span class="current-price"><?php echo formatPrice($product['price']); ?></span>
                        <?php endif; ?>
                        <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-light);">
                            Prix au m²
                        </div>
                    </div>


                    <?php if ($product['short_description']): ?>
                        <p class="product-short-desc"><?php echo clean($product['short_description']); ?></p>
                    <?php endif; ?>

                    <div class="product-specs">
                        <?php if ($product['material']): ?>
                            <div class="spec-item">
                                <strong>Matériau:</strong> <?php echo clean($product['material']); ?>
                            </div>
                        <?php endif; ?>
                        <?php if ($product['size']): ?>
                            <div class="spec-item">
                                <?php if ($isSurMesure && $maxWidthCm && $maxHeightCm): ?>
                                    <strong>Dimensions max :</strong>
                                    <?php echo clean($maxWidthCm); ?> cm × <?php echo clean($maxHeightCm); ?> cm
                                <?php else: ?>
                                    <strong>Taille:</strong> <?php echo clean($product['size']); ?>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                        <?php if (!empty($colorsData)): ?>
                            <div class="spec-item">
                                <strong>Couleur<?php echo $hasMultipleColors ? 's' : ''; ?>:</strong>
                                <?php if ($hasMultipleColors): ?>
                                    <!-- Sélecteur de couleurs multiples -->
                                    <div class="colors-selector" style="margin-top: 0.75rem;">
                                        <div class="colors-list" style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                                            <?php foreach ($colorsData as $index => $colorItem): ?>
                                                <?php 
                                                $colorName = isset($colorItem['name']) ? $colorItem['name'] : '';
                                                $colorImage = isset($colorItem['image']) ? $colorItem['image'] : '';
                                                $isFirst = $index === 0;
                                                ?>
                                                <div class="color-option" 
                                                     data-color-name="<?php echo clean($colorName); ?>"
                                                     data-color-image="<?php echo $colorImage ? clean($colorImage) : ''; ?>"
                                                     style="cursor: pointer; padding: 0.5rem 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--light-color); transition: all 0.3s; <?php echo $isFirst ? 'border-color: var(--primary-color); background: rgba(139,69,19,0.1);' : ''; ?>"
                                                     onclick="selectColor(this, '<?php echo clean($colorName); ?>', '<?php echo $colorImage ? clean($colorImage) : ''; ?>', <?php echo $index; ?>)">
                                                    <?php if ($colorImage): ?>
                                                        <img src="<?php echo clean($colorImage); ?>" 
                                                             alt="<?php echo clean($colorName); ?>"
                                                             style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px; margin-right: 0.5rem; display: inline-block; vertical-align: middle;"
                                                             onerror="this.style.display='none';">
                                                    <?php endif; ?>
                                                    <span style="font-weight: 600; color: var(--text-dark);"><?php echo clean($colorName); ?></span>
                                                </div>
                                            <?php endforeach; ?>
                                        </div>
                                        <input type="hidden" id="selected-color" name="selected_color" value="<?php echo !empty($colorsData[0]['name']) ? clean($colorsData[0]['name']) : ''; ?>">
                                    </div>
                                <?php else: ?>
                                    <!-- Format simple (une seule couleur) -->
                                    <span><?php echo clean($colorsData[0]['name']); ?></span>
                                    <input type="hidden" id="selected-color" name="selected_color" value="<?php echo clean($colorsData[0]['name']); ?>">
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                        <div class="spec-item">
                            <strong>Stock:</strong> 
                            <span class="<?php echo $product['stock'] > 0 ? 'in-stock' : 'out-of-stock'; ?>">
                                <?php echo $product['stock'] > 0 ? 'En stock (' . $product['stock'] . ')' : 'Rupture de stock'; ?>
                            </span>
                        </div>
                    </div>

                    <?php if ($product['description']): ?>
                        <div class="product-description">
                            <h3>Description</h3>
                            <p><?php echo nl2br(clean($product['description'])); ?></p>
                        </div>
                    <?php endif; ?>

                    <div class="product-actions">
                        <div class="quantity-selector">
                            <label>Quantité:</label>
                            <div class="quantity-controls">
                                <button type="button" onclick="decreaseQuantity()">-</button>
                                <input type="number" id="product-quantity" value="1" min="1" max="<?php echo $product['stock']; ?>">
                                <button type="button" onclick="increaseQuantity()">+</button>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-large" 
                                id="add-to-cart-btn" 
                                type="button"
                                data-product-id="<?php echo $product['id']; ?>"
                                data-type-category="<?php echo !empty($product['type_name']) ? strtolower(trim($product['type_name'])) : ''; ?>"
                                data-custom-handler="true"
                                onclick="handleAddToCartClick(event)"
                                <?php echo $product['stock'] == 0 ? 'disabled' : ''; ?>>
                            <?php echo $product['stock'] > 0 ? 'Ajouter au panier' : 'Rupture de stock'; ?>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Produits similaires -->
            <?php if (count($relatedProducts) > 0): ?>
                <section class="related-products">
                    <h2>Produits Similaires</h2>
                    <div class="products-grid">
                        <?php foreach ($relatedProducts as $related): ?>
                            <div class="product-card">
                                <a href="product.php?id=<?php echo $related['id']; ?>">
                                    <div class="product-image">
                                        <?php if ($related['image']): ?>
                                            <img src="<?php echo clean($related['image']); ?>" 
                                                 alt="<?php echo clean($related['name']); ?> - Tapis Similaire - waootapis" 
                                                 loading="lazy"
                                                 width="300" 
                                                 height="300">
                                        <?php else: ?>
                                            <div class="placeholder-image">Image</div>
                                        <?php endif; ?>
                                    </div>
                                    <div class="product-info">
                                        <h3><?php echo clean($related['name']); ?></h3>
                                        <div class="product-price">
                                            <?php if ($related['sale_price']): ?>
                                                <span class="old-price"><?php echo formatPrice($related['price']); ?></span>
                                                <span class="current-price"><?php echo formatPrice($related['sale_price']); ?></span>
                                            <?php else: ?>
                                                <span class="current-price"><?php echo formatPrice($related['price']); ?></span>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </a>
                                <?php 
                                // Décoder les couleurs et calculer dimensions max pour les produits liés
                                $relColors = [];
                                if (!empty($related['color'])) {
                                    $cData = json_decode($related['color'], true);
                                    if (json_last_error() === JSON_ERROR_NONE && is_array($cData)) {
                                        $relColors = $cData;
                                    } else {
                                        $relColors = [['name' => $related['color'], 'image' => '']];
                                    }
                                }
                                $relColorsJson = htmlspecialchars(json_encode($relColors), ENT_QUOTES, 'UTF-8');
                                
                                $relMaxWidth = '';
                                $relMaxHeight = '';
                                if (!empty($related['type_name'])) {
                                    $tNameLower = strtolower(trim($related['type_name']));
                                    if (($tNameLower === 'sur_mesure' || $tNameLower === 'sur mesure') && !empty($related['size']) && strpos($related['size'], 'x') !== false) {
                                        $p = explode('x', strtolower($related['size']));
                                        $relMaxWidth = isset($p[0]) ? trim($p[0]) : '';
                                        $relMaxHeight = isset($p[1]) ? trim($p[1]) : '';
                                    }
                                }
                                ?>
                                <button class="btn-add-cart" 
                                        type="button"
                                        data-product-id="<?php echo $related['id']; ?>"
                                        data-type-category="<?php echo !empty($related['type_name']) ? strtolower(trim($related['type_name'])) : ''; ?>"
                                        data-unit-price="<?php echo $related['unit_price']; ?>"
                                        data-product-colors="<?php echo $relColorsJson; ?>"
                                        data-max-width="<?php echo htmlspecialchars($relMaxWidth, ENT_QUOTES, 'UTF-8'); ?>"
                                        data-max-height="<?php echo htmlspecialchars($relMaxHeight, ENT_QUOTES, 'UTF-8'); ?>"
                                        onclick="window.handleAddToCartClickFromList(event, this)">
                                    Ajouter au panier
                                </button>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </section>
            <?php endif; ?>
        </div>
    </main>

    <!-- Modal pour les dimensions -->
    <div id="dimensions-modal" class="dimensions-modal" style="display: none;">
        <div class="modal-overlay" onclick="window.closeDimensionsModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Spécifier les dimensions</h2>
                <button class="modal-close" onclick="window.closeDimensionsModal()">×</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 1.5rem; color: var(--text-light);">
                    Veuillez entrer les dimensions de votre tapis pour calculer le prix exact.
                    <?php if ($isSurMesure && $maxWidthCm && $maxHeightCm): ?>
                        <br>
                        <span style="font-size: 0.9rem; color: var(--text-light);">
                            Dimensions maximales pour ce modèle : 
                            <strong><?php echo clean($maxWidthCm); ?> cm × <?php echo clean($maxHeightCm); ?> cm</strong>
                        </span>
                    <?php endif; ?>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div class="dimension-input">
                        <label for="modal-length" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-dark);">Longueur (cm) *</label>
                        <input type="number" 
                               id="modal-length" 
                               step="1" 
                               min="1" 
                               placeholder="0" 
                               style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem; transition: border-color 0.3s;"
                               oninput="window.calculateModalPrice()">
                    </div>
                    <div class="dimension-input">
                        <label for="modal-width" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-dark);">Largeur (cm) *</label>
                        <input type="number" 
                               id="modal-width" 
                               step="1" 
                               min="1" 
                               placeholder="0" 
                               style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem; transition: border-color 0.3s;"
                               oninput="window.calculateModalPrice()">
                    </div>
                </div>
                <div id="modal-price-calculation" style="display: none; padding: 1rem; background: var(--light-color); border-radius: 8px; border: 2px solid var(--primary-color); margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Dimensions:</span>
                        <strong id="modal-dimensions-display" style="color: var(--text-dark); font-size: 0.95rem;">0 cm × 0 cm</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Surface:</span>
                        <strong id="modal-surface-area" style="color: var(--text-dark); font-size: 1.1rem;">0,00 m²</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Prix unitaire:</span>
                        <strong style="color: var(--text-dark);"><?php echo formatPrice($unitPrice); ?> / m²</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 2px solid var(--border-color);">
                        <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color);">Prix total:</span>
                        <strong id="modal-total-price" style="font-size: 1.5rem; color: var(--primary-color); font-weight: 700;">0,00 MAD</strong>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="window.closeDimensionsModal()">Annuler</button>
                <button type="button" class="btn btn-primary" id="confirm-add-to-cart" disabled>
                    Ajouter au panier
                </button>
            </div>
        </div>
    </div>
    

                    // Si type fixe, pas de dimensions requises
                    let length = 0;
                    let width = 0;
                    let calculatedPrice = window.unitPrice;

                    const isFixe = (window.isFixe === true || window.isFixe === 'true');
                    const isSurMesure = (window.isSurMesure === true || window.isSurMesure === 'true');
                    if (!isFixe) {
                        length = parseFloat(document.getElementById('modal-length').value) || 0;
                        width = parseFloat(document.getElementById('modal-width').value) || 0;
                        if (length <= 0 || width <= 0) {
                            showNotification('Veuillez entrer des dimensions valides', 'error');
                            return;
                        }
                        // Pour sur mesure, respecter les dimensions max
                        if (isSurMesure && (window.maxWidthCm || window.maxHeightCm)) {
                            if (window.maxWidthCm && length > window.maxWidthCm) {
                                showNotification('La longueur maximale pour ce modèle est de ' + window.maxWidthCm + ' cm.', 'error');
                                return;
                            }
                            if (window.maxHeightCm && width > window.maxHeightCm) {
                                showNotification('La largeur maximale pour ce modèle est de ' + window.maxHeightCm + ' cm.', 'error');
                                return;
                            }
                        }
                        const surfaceM2 = (length * width) / 10000;
                        calculatedPrice = surfaceM2 * window.unitPrice;
                    }
                    
                    const btn = this;
                    btn.disabled = true;
                    btn.textContent = 'Ajout en cours...';
                    
                    const formData = new FormData();
                    // Récupérer la couleur sélectionnée
                    const selectedColorInput = document.getElementById('selected-color');
                    const selectedColor = selectedColorInput ? selectedColorInput.value : '';
                    
                    formData.append('product_id', productId);
                    formData.append('quantity', quantity);
                    formData.append('length', length);
                    formData.append('width', width);
                    formData.append('calculated_price', calculatedPrice);
                    if (selectedColor) {
                        formData.append('color', selectedColor);
                    }
                    
                    fetch('api/add_to_cart.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            if (typeof showNotification === 'function') {
                                showNotification(data.message, 'success');
                            }
                            if (typeof updateCartCount === 'function') {
                                updateCartCount(data.cart_count);
                            }
                            window.closeDimensionsModal();
                        } else {
                            if (typeof showNotification === 'function') {
                                showNotification(data.message || 'Erreur lors de l\'ajout au panier', 'error');
                            }
                        }
                    })
                    .catch(error => {
                        if (typeof showNotification === 'function') {
                            showNotification('Erreur lors de l\'ajout au panier', 'error');
                        }
                    })
                    .finally(() => {
                        btn.disabled = false;
                        btn.textContent = 'Ajouter au panier';
                    });
                });
            }
        });
        
        // Fonction pour changer l'image principale
        function changeMainImage(src, element, colorName, colorIndex) {
            
            const mainImage = document.getElementById('main-image');
            if (mainImage) {
                // Ajouter un effet de fondu
                mainImage.style.opacity = '0.5';
                setTimeout(() => {
                    mainImage.src = src;
                    mainImage.style.opacity = '1';
                }, 150);
            }
            
            // Mettre à jour les miniatures actives
            document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
            if (element) {
                element.classList.add('active');
            }
            
            // Si une couleur correspond à cette image, la sélectionner automatiquement
            let colorToSelect = colorName;
            
            // Si pas de nom de couleur mais un index, trouver la couleur par index
            if ((!colorToSelect || colorToSelect.trim() === '') && colorIndex !== undefined && colorIndex !== null) {
                const colorOptions = document.querySelectorAll('.color-option');
                if (colorIndex < colorOptions.length) {
                    const colorOption = colorOptions[colorIndex];
                    colorToSelect = colorOption.getAttribute('data-color-name');
                }
            }
            
            if (colorToSelect && colorToSelect.trim() !== '') {
                // Trouver l'option de couleur correspondante
                const colorOptions = document.querySelectorAll('.color-option');
                let colorFound = false;
                
                colorOptions.forEach((opt, idx) => {
                    const optColorName = opt.getAttribute('data-color-name');
                    
                    // Comparer par nom ou par index
                    if ((optColorName && optColorName.trim() === colorToSelect.trim()) || 
                        (colorIndex !== undefined && idx === colorIndex)) {
                        colorFound = true;
                        // Simuler un clic sur cette couleur pour mettre à jour l'apparence
                        opt.style.borderColor = 'var(--primary-color)';
                        opt.style.background = 'rgba(139,69,19,0.1)';
                        
                        // Mettre à jour le champ caché
                        const selectedColorInput = document.getElementById('selected-color');
                        if (selectedColorInput) {
                            const finalColorName = optColorName || colorToSelect;
                            selectedColorInput.value = finalColorName;
                        }
                        
                        // Désélectionner les autres couleurs
                        colorOptions.forEach(otherOpt => {
                            if (otherOpt !== opt) {
                                otherOpt.style.borderColor = 'var(--border-color)';
                                otherOpt.style.background = 'var(--light-color)';
                            }
                        });
                    }
                });
                
            }
        }
        
        // Fonction pour sélectionner une couleur
        function selectColor(element, colorName, colorImage, colorIndex) {
            // Mettre à jour l'apparence des options de couleur
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.style.borderColor = 'var(--border-color)';
                opt.style.background = 'var(--light-color)';
            });
            element.style.borderColor = 'var(--primary-color)';
            element.style.background = 'rgba(139,69,19,0.1)';
            
            // Mettre à jour le champ caché
            const selectedColorInput = document.getElementById('selected-color');
            if (selectedColorInput) {
                selectedColorInput.value = colorName;
            }
            
            // Changer l'image principale
            const mainImage = document.getElementById('main-image');
            if (mainImage) {
                let imagePath = colorImage && colorImage.trim() !== '' ? colorImage.trim() : null;
                
                // Si pas d'image directe, chercher l'image correspondante par index
                if (!imagePath && colorIndex !== undefined && colorIndex !== null) {
                    const thumbnails = document.querySelectorAll('.thumbnail');
                    
                    if (colorIndex < thumbnails.length) {
                        const matchingThumbnail = thumbnails[colorIndex];
                        imagePath = matchingThumbnail.getAttribute('data-image-path') || matchingThumbnail.src;
                    }
                }
                
                if (imagePath) {
                    
                    // Ajouter un effet de fondu lors du changement
                    mainImage.style.opacity = '0.5';
                    
                    // Précharger l'image pour éviter les erreurs
                    const img = new Image();
                    img.onload = function() {
                        mainImage.src = imagePath;
                        mainImage.style.opacity = '1';
                        
                        // Mettre à jour la miniature active
                        document.querySelectorAll('.thumbnail').forEach(thumb => {
                            thumb.classList.remove('active');
                            const thumbImagePath = thumb.getAttribute('data-image-path') || thumb.src;
                            const thumbSrc = thumbImagePath.split('/').pop();
                            const newImageName = imagePath.split('/').pop();
                            // Comparer les chemins complets ou juste les noms de fichiers
                            if (thumbImagePath === imagePath || thumbSrc === newImageName || thumb.src.includes(newImageName)) {
                                thumb.classList.add('active');
                            }
                        });
                    };
                    img.onerror = function() {
                        // Essayer différentes variantes du chemin
                        const pathVariants = [
                            imagePath,
                            '../' + imagePath,
                            imagePath.replace(/^\.\.\//, ''),
                            imagePath.startsWith('assets/') ? imagePath : 'assets/images/products/' + imagePath.split('/').pop()
                        ];
                        
                        let triedVariants = 0;
                        const tryNextVariant = function() {
                            if (triedVariants < pathVariants.length) {
                                const variant = pathVariants[triedVariants];
                                const testImg = new Image();
                                testImg.onload = function() {
                                    mainImage.src = variant;
                                    mainImage.style.opacity = '1';
                                    
                                    // Mettre à jour la miniature active
                                    document.querySelectorAll('.thumbnail').forEach(thumb => {
                                        thumb.classList.remove('active');
                                        const thumbImagePath = thumb.getAttribute('data-image-path') || thumb.src;
                                        if (thumbImagePath === variant || thumb.src.includes(variant.split('/').pop())) {
                                            thumb.classList.add('active');
                                        }
                                    });
                                };
                                testImg.onerror = function() {
                                    triedVariants++;
                                    tryNextVariant();
                                };
                                testImg.src = variant;
                            } else {
                                // Si aucune variante ne fonctionne, restaurer l'image par défaut
                                const defaultImage = mainImage.getAttribute('data-default-image');
                                if (defaultImage) {
                                    mainImage.src = defaultImage;
                                    mainImage.style.opacity = '1';
                                } else {
                                    mainImage.style.opacity = '1';
                                }
                            }
                        };
                        tryNextVariant();
                    };
                    img.src = imagePath;
                } else {
                    // Si pas d'image pour la couleur, restaurer l'image par défaut
                    const defaultImage = mainImage.getAttribute('data-default-image');
                    if (defaultImage) {
                        mainImage.src = defaultImage;
                        mainImage.style.opacity = '1';
                    }
                }
            }
        }

        function increaseQuantity() {
            const input = document.getElementById('product-quantity');
            const max = parseInt(input.getAttribute('max'));
            if (parseInt(input.value) < max) {
                input.value = parseInt(input.value) + 1;
            }
        }

        function decreaseQuantity() {
            const input = document.getElementById('product-quantity');
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        }

        function calculateTotalPrice() {
            const lengthInput = document.getElementById('length');
            const widthInput = document.getElementById('width');
            
            // Vérifier si les champs existent (pour les produits sans calculateur de dimensions)
            if (!lengthInput || !widthInput) {
                return;
            }
            
            const length = parseFloat(lengthInput.value) || 0;
            const width = parseFloat(widthInput.value) || 0;
            const priceCalculation = document.getElementById('price-calculation');
            const dimensionsDisplay = document.getElementById('dimensions-display');
            const surfaceArea = document.getElementById('surface-area');
            const totalPrice = document.getElementById('total-price');

            if (length > 0 && width > 0) {
                // Convertir cm² en m² (1 m² = 10 000 cm²)
                const surfaceCm2 = length * width;
                const surfaceM2 = surfaceCm2 / 10000;
                const total = surfaceM2 * unitPrice;
                
                // Afficher les dimensions
                if (dimensionsDisplay) {
                    dimensionsDisplay.textContent = Math.round(length) + ' cm × ' + Math.round(width) + ' cm';
                }
                
                // Afficher la surface avec 2 décimales et format français
                const surfaceFormatted = surfaceM2.toFixed(2).replace('.', ',');
                if (surfaceArea) {
                    surfaceArea.textContent = surfaceFormatted + ' m²';
                }
                
                if (totalPrice) {
                    totalPrice.textContent = formatPrice(total);
                }
                if (priceCalculation) {
                    priceCalculation.style.display = 'block';
                }
            } else {
                if (priceCalculation) {
                    priceCalculation.style.display = 'none';
                }
            }
        }

        window.formatPrice = function(price) {
            // Format: 1 234,56 MAD (comme la fonction PHP)
            return price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' MAD';
        };
    </script>
    
    <script src="assets/js/main.js"></script>
</body>
</html>

