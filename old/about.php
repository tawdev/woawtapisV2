<?php
session_start();
require_once 'config/database.php';
require_once 'config/functions.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    // SEO Meta Tags
    $baseUrl = rtrim(SITE_URL, '/');
    $pageTitle = 'À Propos de Nous - waootapis | Tapis de Luxe Authentiques';
    $pageDescription = 'Découvrez l\'histoire de waootapis, votre spécialiste en tapis de luxe authentiques. Qualité garantie, livraison rapide, service client exceptionnel.';
    $pageKeywords = 'à propos, waootapis, tapis marocain, histoire, mission, qualité';
    $pageImage = $baseUrl . '/assets/images/Gemini_Generated_Image_3bho863bho863bho (1).png';
    $pageType = 'website';
    
    // Structured Data for About Page
    $structuredData = [
        '@context' => 'https://schema.org',
        '@type' => 'AboutPage',
        'name' => $pageTitle,
        'description' => $pageDescription,
        'url' => $baseUrl . '/about.php',
        'mainEntity' => [
            '@type' => 'Organization',
            'name' => SITE_NAME,
            'url' => $baseUrl,
            'logo' => $baseUrl . '/assets/images/Gemini_Generated_Image_3bho863bho863bho (1).png',
            'description' => 'Boutique spécialisée dans la vente de tapis de luxe authentiques, orientaux et marocains.'
        ]
    ];
    
    include 'includes/seo_head.php';
    ?>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        /* Bouton de retour */
        .back-button {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1.2rem;
            margin-bottom: 1.5rem;
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: 2px solid var(--primary-color);
        }

        .back-button:hover {
            background: transparent;
            color: var(--primary-color);
            transform: translateX(-3px);
        }

        .back-button::before {
            content: "←";
            font-size: 1.2rem;
        }
    </style>
</head>
<body>
    <?php include 'includes/header.php'; ?>

    <main class="about-page">
        <div class="container">
            <a href="index.php" class="back-button">Retour à l'accueil</a>
            <div class="page-header">
                <h1>À propos de nous</h1>
                <p>Découvrez l'histoire de waootapis</p>
            </div>

            <div class="about-content">
                <section class="about-section">
                    <div class="about-image">
                        <div class="about-placeholder">🏺</div>
                    </div>
                    <div class="about-text">
                        <h2>Notre Histoire</h2>
                        <p>Depuis notre création, Tapis s'est engagé à offrir à nos clients les plus beaux tapis du Maroc et du monde entier. Nous sélectionnons avec soin chaque pièce pour garantir qualité, authenticité et élégance.</p>
                        <p>Notre passion pour les tapis nous pousse à rechercher constamment les meilleures créations, qu'elles soient modernes, classiques, orientales ou traditionnelles marocaines.</p>
                    </div>
                </section>

                <section class="about-section reverse">
                    <div class="about-text">
                        <h2>Notre Mission</h2>
                        <p>Notre mission est de rendre accessible l'art et la beauté des tapis authentiques à tous nos clients. Nous croyons qu'un tapis n'est pas seulement un objet de décoration, mais une œuvre d'art qui transforme un espace.</p>
                        <p>Nous nous engageons à offrir :</p>
                        <ul class="about-list">
                            <li>✅ Des produits authentiques et de qualité supérieure</li>
                            <li>✅ Un service client exceptionnel</li>
                            <li>✅ Des prix compétitifs et transparents</li>
                            <li>✅ Une livraison rapide et sécurisée</li>
                        </ul>
                    </div>
                    <div class="about-image">
                        <div class="about-placeholder">🎨</div>
                    </div>
                </section>

                <section class="about-section">
                    <div class="about-image">
                        <div class="about-placeholder">⭐</div>
                    </div>
                    <div class="about-text">
                        <h2>Pourquoi nous choisir ?</h2>
                        <div class="features-grid">
                            <div class="feature-item">
                                <div class="feature-icon">🏆</div>
                                <h3>Qualité Garantie</h3>
                                <p>Tous nos tapis sont sélectionnés pour leur qualité exceptionnelle et leur authenticité.</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">🚚</div>
                                <h3>Livraison Rapide</h3>
                                <p>Livraison gratuite à partir de 500 MAD partout au Maroc.</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">↩️</div>
                                <h3>Retour Gratuit</h3>
                                <p>30 jours pour changer d'avis, retour gratuit et sans frais.</p>
                            </div>
                            <div class="feature-item">
                                <div class="feature-icon">💳</div>
                                <h3>Paiement Sécurisé</h3>
                                <p>Transactions 100% sécurisées pour votre tranquillité d'esprit.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </main>

    <?php include 'includes/footer.php'; ?>
    <script src="assets/js/main.js"></script>
</body>
</html>

