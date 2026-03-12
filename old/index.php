<?php
session_start();
require_once 'config/database.php';
require_once 'config/functions.php';

$db = getDB();

// Récupérer les catégories
$stmt = $db->query("SELECT * FROM categories ORDER BY name");
$categories = $stmt->fetchAll();

// Récupérer les produits en vedette
$stmt = $db->query("SELECT p.*, c.name as category_name, t.name as type_name,
                    (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
                    COALESCE(p.sale_price, p.price) as unit_price
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id 
                    LEFT JOIN types t ON p.type_id = t.id
                    WHERE p.featured = 1 AND p.status = 'active' 
                    ORDER BY p.created_at DESC 
                    LIMIT 8");
$featuredProducts = $stmt->fetchAll();

// Récupérer les meilleures ventes
$stmt = $db->query("SELECT p.*, c.name as category_name, t.name as type_name,
                    (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image,
                    COALESCE(p.sale_price, p.price) as unit_price,
                    COALESCE(SUM(oi.quantity), 0) as total_sold
                    FROM products p 
                    LEFT JOIN categories c ON p.category_id = c.id
                    LEFT JOIN types t ON p.type_id = t.id
                    LEFT JOIN order_items oi ON p.id = oi.product_id
                    WHERE p.status = 'active'
                    GROUP BY p.id
                    ORDER BY total_sold DESC, p.best_seller DESC
                    LIMIT 6");
$bestSellers = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    // SEO Meta Tags
    $baseUrl = rtrim(SITE_URL, '/');
    $pageTitle = 'Accueil - Tapis de Luxe Authentiques | waootapis';
    $pageDescription = 'Découvrez notre collection exclusive de tapis de luxe authentiques. Tapis orientaux, marocains et modernes de qualité supérieure. Livraison gratuite à partir de 500 MAD au Maroc.';
    $pageKeywords = 'tapis marocain, tapis oriental, tapis de luxe, tapis authentique, décoration intérieure, tapis fait main, tapis beni ouarain';
    $pageImage = $baseUrl . '/assets/images/Gemini_Generated_Image_3bho863bho863bho (1).png';
    $pageType = 'website';

    // Structured Data for Homepage
    $structuredData = [
        '@context' => 'https://schema.org',
        '@type' => 'Store',
        'name' => SITE_NAME,
        'description' => $pageDescription,
        'url' => $baseUrl,
        'logo' => $baseUrl . '/assets/images/Gemini_Generated_Image_3bho863bho863bho (1).png',
        'image' => $pageImage,
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => 'N, TAW10, lot Iguder, 48 AV Alla El Fassi',
            'addressLocality' => 'Marrakech',
            'postalCode' => '40000',
            'addressCountry' => 'MA'
        ],
        'telephone' => '+212 524308038',
        'email' => 'contact@waootapis.com',
        'priceRange' => '$$',
        'openingHoursSpecification' => [
            [
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                'opens' => '09:00',
                'closes' => '18:00'
            ],
            [
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => 'Saturday',
                'opens' => '10:00',
                'closes' => '16:00'
            ]
        ]
    ];
    include 'includes/seo_head.php';
    ?>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        /* Style pour la description dans les cartes de catégories */
        .category-card .category-content {
            padding: 1.5rem;
        }

        .category-card .category-content h3 {
            padding: 0;
            margin-bottom: 0.75rem;
        }

        .category-card .category-description {
            color: var(--text-light);
            font-size: 0.9rem;
            line-height: 1.5;
            margin: 0;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Grille de 4 colonnes sur desktop */
        @media (min-width: 1024px) {
            .categories-grid {
                grid-template-columns: repeat(4, minmax(0, 1fr));
            }
        }

        /* Responsive pour tablettes */
        @media (max-width: 1023px) and (min-width: 768px) {
            .categories-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
            }
        }

        /* Responsive pour mobile */
        @media (max-width: 767px) {
            .categories-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }

        @media (max-width: 480px) {
            .categories-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>
    <?php include 'includes/header.php'; ?>

    <main>
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>Tapis de Luxe Authentiques - Collection Exclusive</h1>
                <p>Découvrez notre sélection de tapis orientaux et marocains faits main, pour transformer votre
                    intérieur avec élégance et authenticité</p>
                <a href="products.php" class="btn btn-primary">Voir la Collection</a>
            </div>
        </section>

        <!-- Catégories -->
        <section class="categories-section">
            <div class="container">
                <h2 class="section-title">Explorez Nos Catégories de Tapis</h2>
                <div class="categories-grid">
                    <?php foreach ($categories as $category): ?>
                        <a href="products.php?category=<?php echo $category['id']; ?>" class="category-card">
                            <div class="category-image">
                                <?php if ($category['image']): ?>
                                    <img src="<?php echo clean($category['image']); ?>"
                                        alt="Tapis <?php echo clean($category['name']); ?> - Collection waootapis"
                                        loading="lazy" width="300" height="200">
                                <?php else: ?>
                                    <div class="placeholder-image"><?php echo substr($category['name'], 0, 1); ?></div>
                                <?php endif; ?>
                            </div>
                            <div class="category-content">
                                <h3><?php echo clean($category['name']); ?></h3>
                                <?php if (!empty($category['description'])): ?>
                                    <p class="category-description"><?php echo clean($category['description']); ?></p>
                                <?php endif; ?>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- Produits en vedette -->
        <section class="products-section">
            <div class="container">
                <h2 class="section-title">Tapis en Vedette - Sélection Premium</h2>
                <div class="products-grid">
                    <?php foreach ($featuredProducts as $product): ?>
                        <div class="product-card">
                            <a href="product.php?id=<?php echo $product['id']; ?>">
                                <div class="product-image">
                                    <?php if ($product['image']): ?>
                                        <img src="<?php echo clean($product['image']); ?>"
                                            alt="<?php echo clean($product['name']); ?> - Tapis <?php echo clean($product['category_name']); ?> - waootapis"
                                            loading="lazy" width="300" height="300">
                                    <?php else: ?>
                                        <div class="placeholder-image">Image</div>
                                    <?php endif; ?>
                                    <?php if ($product['sale_price'] || $product['best_seller']): ?>
                                        <div class="badges-container">
                                            <?php if ($product['sale_price']): ?>
                                                <span class="badge sale">Promotion</span>
                                            <?php endif; ?>
                                            <?php if ($product['best_seller']): ?>
                                                <span class="badge best-seller">Bestseller</span>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <div class="product-info">
                                    <h2><?php echo clean($product['name']); ?></h2>
                                    <p class="product-category"><?php echo clean($product['category_name']); ?></p>
                                    <div class="product-price">
                                        <?php if ($product['sale_price']): ?>
                                            <span class="old-price"><?php echo formatPrice($product['price']); ?></span>
                                            <span
                                                class="current-price"><?php echo formatPrice($product['sale_price']); ?></span>
                                        <?php else: ?>
                                            <span class="current-price"><?php echo formatPrice($product['price']); ?></span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </a>
                            <?php
                            // Décoder les couleurs du produit
                            $productColors = [];
                            if (!empty($product['color'])) {
                                $colorsData = json_decode($product['color'], true);
                                if (json_last_error() === JSON_ERROR_NONE && is_array($colorsData) && count($colorsData) > 0) {
                                    $productColors = $colorsData;
                                } elseif (!empty(trim($product['color']))) {
                                    $productColors = [['name' => trim($product['color']), 'image' => '']];
                                }
                            }
                            $productColorsJson = htmlspecialchars(json_encode($productColors), ENT_QUOTES, 'UTF-8');

                            // Dimensions max pour les types sur mesure
                            $maxWidthCm = '';
                            $maxHeightCm = '';
                            if (!empty($product['type_name'])) {
                                $typeNameLower = strtolower(trim($product['type_name']));
                                if (($typeNameLower === 'sur_mesure' || $typeNameLower === 'sur mesure') && !empty($product['size']) && strpos($product['size'], 'x') !== false) {
                                    $parts = explode('x', strtolower($product['size']));
                                    $maxWidthCm = isset($parts[0]) ? trim($parts[0]) : '';
                                    $maxHeightCm = isset($parts[1]) ? trim($parts[1]) : '';
                                }
                            }
                            ?>
                            <button class="btn-add-cart" type="button" data-product-id="<?php echo $product['id']; ?>"
                                data-type-category="<?php echo !empty($product['type_name']) ? strtolower(trim($product['type_name'])) : ''; ?>"
                                data-unit-price="<?php echo $product['unit_price']; ?>"
                                data-product-colors="<?php echo $productColorsJson; ?>"
                                data-max-width="<?php echo htmlspecialchars($maxWidthCm, ENT_QUOTES, 'UTF-8'); ?>"
                                data-max-height="<?php echo htmlspecialchars($maxHeightCm, ENT_QUOTES, 'UTF-8'); ?>"
                                onclick="window.handleAddToCartClickFromList(event, this)">
                                Ajouter au panier
                            </button>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- Meilleures ventes -->
        <section class="products-section bg-light">
            <div class="container">
                <h2 class="section-title">Tapis les Plus Vendus - Bestsellers</h2>
                <div class="products-grid">
                    <?php foreach ($bestSellers as $product): ?>
                        <div class="product-card">
                            <a href="product.php?id=<?php echo $product['id']; ?>">
                                <div class="product-image">
                                    <?php if ($product['image']): ?>
                                        <img src="<?php echo clean($product['image']); ?>"
                                            alt="<?php echo clean($product['name']); ?> - Tapis <?php echo clean($product['category_name']); ?> - waootapis"
                                            loading="lazy" width="300" height="300">
                                    <?php else: ?>
                                        <div class="placeholder-image">Image</div>
                                    <?php endif; ?>
                                    <?php if ($product['sale_price'] || $product['best_seller']): ?>
                                        <div class="badges-container">
                                            <?php if ($product['sale_price']): ?>
                                                <span class="badge sale">Promotion</span>
                                            <?php endif; ?>
                                            <?php if ($product['best_seller']): ?>
                                                <span class="badge best-seller">Bestseller</span>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </div>
                                <div class="product-info">
                                    <h2><?php echo clean($product['name']); ?></h2>
                                    <p class="product-category"><?php echo clean($product['category_name']); ?></p>
                                    <div class="product-price">
                                        <?php if ($product['sale_price']): ?>
                                            <span class="old-price"><?php echo formatPrice($product['price']); ?></span>
                                            <span
                                                class="current-price"><?php echo formatPrice($product['sale_price']); ?></span>
                                        <?php else: ?>
                                            <span class="current-price"><?php echo formatPrice($product['price']); ?></span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </a>
                            <?php
                            // Décoder les couleurs du produit
                            $productColors = [];
                            if (!empty($product['color'])) {
                                $colorsData = json_decode($product['color'], true);
                                if (json_last_error() === JSON_ERROR_NONE && is_array($colorsData) && count($colorsData) > 0) {
                                    $productColors = $colorsData;
                                } elseif (!empty(trim($product['color']))) {
                                    $productColors = [['name' => trim($product['color']), 'image' => '']];
                                }
                            }
                            $productColorsJson = htmlspecialchars(json_encode($productColors), ENT_QUOTES, 'UTF-8');

                            // Dimensions max pour les types sur mesure
                            $maxWidthCm = '';
                            $maxHeightCm = '';
                            if (!empty($product['type_name'])) {
                                $typeNameLower = strtolower(trim($product['type_name']));
                                if (($typeNameLower === 'sur_mesure' || $typeNameLower === 'sur mesure') && !empty($product['size']) && strpos($product['size'], 'x') !== false) {
                                    $parts = explode('x', strtolower($product['size']));
                                    $maxWidthCm = isset($parts[0]) ? trim($parts[0]) : '';
                                    $maxHeightCm = isset($parts[1]) ? trim($parts[1]) : '';
                                }
                            }
                            ?>
                            <button class="btn-add-cart" type="button" data-product-id="<?php echo $product['id']; ?>"
                                data-type-category="<?php echo !empty($product['type_name']) ? strtolower(trim($product['type_name'])) : ''; ?>"
                                data-unit-price="<?php echo $product['unit_price']; ?>"
                                data-product-colors="<?php echo $productColorsJson; ?>"
                                data-max-width="<?php echo htmlspecialchars($maxWidthCm, ENT_QUOTES, 'UTF-8'); ?>"
                                data-max-height="<?php echo htmlspecialchars($maxHeightCm, ENT_QUOTES, 'UTF-8'); ?>"
                                onclick="window.handleAddToCartClickFromList(event, this)">
                                Ajouter au panier
                            </button>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <!-- Informations -->
        <section class="info-section">
            <div class="container">
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-icon">🚚</div>
                        <h3>Livraison Gratuite</h3>
                        <p>Livraison gratuite à partir de 500 MAD</p>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">↩️</div>
                        <h3>Retour Gratuit</h3>
                        <p>30 jours pour changer d'avis</p>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">🔒</div>
                        <h3>Paiement Sécurisé</h3>
                        <p>Transactions 100% sécurisées</p>
                    </div>
                    <div class="info-item">
                        <div class="info-icon">⭐</div>
                        <h3>Qualité Garantie</h3>
                        <p>Produits authentiques et de qualité</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <?php include 'includes/footer.php'; ?>
    <style>
        .dimensions-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
        }

        .dimensions-modal .modal-content {
            background: var(--white);
            width: 90%;
            max-width: 550px;
            border-radius: 16px;
            position: relative;
            z-index: 10001;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            max-height: 90vh;
            /* Ensure it fits on screen */
            animation: modalFadeIn 0.3s ease-out;
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-header {
            padding: 1.5rem 2rem;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--dark-color) 100%);
            color: var(--white);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff !important;
            /* Force white text */
        }

        .modal-close {
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: var(--white);
            font-size: 1.5rem;
            cursor: pointer;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }

        .modal-close:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: rotate(90deg);
        }

        .modal-body {
            padding: 2rem;
            overflow-y: auto;
            flex: 1;
            /* Take available space */
            scrollbar-width: thin;
            /* For Firefox */
            scrollbar-color: var(--primary-color) var(--light-color);
        }

        /* Webkit scrollbar styling */
        .modal-body::-webkit-scrollbar {
            width: 8px;
        }

        .modal-body::-webkit-scrollbar-track {
            background: var(--light-color);
        }

        .modal-body::-webkit-scrollbar-thumb {
            background-color: var(--primary-color);
            border-radius: 4px;
        }

        .modal-footer {
            padding: 1.5rem 2rem;
            background: var(--light-color);
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            border-top: 1px solid var(--border-color);
        }

        .modal-color-option {
            cursor: pointer;
            padding: 0.5rem 1rem;
            border: 2px solid var(--border-color);
            border-radius: 8px;
            background: var(--light-color);
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .modal-color-option:hover {
            border-color: var(--primary-color);
            background: rgba(139, 69, 19, 0.05);
        }
    </style>

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
                    <br>
                    <span id="modal-max-dimensions-info"
                        style="font-size: 0.9rem; color: var(--text-light); display: none;">
                        <!-- Rempli dynamiquement pour les produits sur mesure -->
                    </span>
                </p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                    <div class="dimension-input">
                        <label for="modal-length"
                            style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-dark);">Longueur
                            (cm) *</label>
                        <input type="number" id="modal-length" step="1" min="1" placeholder="0"
                            style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem; transition: border-color 0.3s;"
                            oninput="window.calculateModalPrice()">
                    </div>
                    <div class="dimension-input">
                        <label for="modal-width"
                            style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-dark);">Largeur
                            (cm) *</label>
                        <input type="number" id="modal-width" step="1" min="1" placeholder="0"
                            style="width: 100%; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; font-size: 1rem; transition: border-color 0.3s;"
                            oninput="window.calculateModalPrice()">
                    </div>
                </div>

                <!-- Sélecteur de couleur dans le modal -->
                <div id="modal-color-selector" style="display: none; margin-bottom: 1.5rem;">
                    <label
                        style="display: block; margin-bottom: 0.75rem; font-weight: 600; color: var(--text-dark);">Choisir
                        une couleur *</label>
                    <div id="modal-colors-list" style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                        <!-- Les couleurs seront injectées ici par JS -->
                    </div>
                    <input type="hidden" id="modal-selected-color" value="">
                </div>

                <div id="modal-price-calculation"
                    style="display: none; padding: 1rem; background: var(--light-color); border-radius: 8px; border: 2px solid var(--primary-color); margin-bottom: 1.5rem;">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Dimensions:</span>
                        <strong id="modal-dimensions-display" style="color: var(--text-dark); font-size: 0.95rem;">0 cm
                            × 0 cm</strong>
                    </div>
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Surface:</span>
                        <strong id="modal-surface-area" style="color: var(--text-dark); font-size: 1.1rem;">0,00
                            m²</strong>
                    </div>
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="color: var(--text-light);">Prix unitaire:</span>
                        <strong id="modal-unit-price" style="color: var(--text-dark);">0,00 MAD / m²</strong>
                    </div>
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 2px solid var(--border-color);">
                        <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary-color);">Prix
                            total:</span>
                        <strong id="modal-total-price"
                            style="font-size: 1.5rem; color: var(--primary-color); font-weight: 700;">0,00 MAD</strong>
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

    <script src="assets/js/main.js"></script>
</body>

</html>