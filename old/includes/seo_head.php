<?php
/**
 * SEO Head Component
 * Generates optimized meta tags, Open Graph, Twitter Cards, and structured data
 */

// Get current page URL
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$currentUrl = $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
$baseUrl = rtrim(SITE_URL, '/');

// Default values
$pageTitle = isset($pageTitle) ? $pageTitle : SITE_NAME;
$pageDescription = isset($pageDescription) ? $pageDescription : 'Découvrez notre collection exclusive de tapis de luxe authentiques. Tapis orientaux, marocains et modernes de qualité supérieure. Livraison gratuite à partir de 500 MAD.';
$pageKeywords = isset($pageKeywords) ? $pageKeywords : 'tapis, tapis marocain, tapis oriental, tapis de luxe, tapis authentique, décoration intérieure, tapis fait main';
$pageImage = isset($pageImage) ? $pageImage : $baseUrl . '/assets/images/Gemini_Generated_Image_3bho863bho863bho (1).png';
$pageType = isset($pageType) ? $pageType : 'website';
$canonicalUrl = isset($canonicalUrl) ? $canonicalUrl : $currentUrl;
$pageLanguage = isset($pageLanguage) ? $pageLanguage : 'fr';
$structuredData = isset($structuredData) ? $structuredData : null;
?>
<!-- Performance & Resource Hints -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//fonts.gstatic.com">

<!-- Primary Meta Tags -->
<title><?php echo clean($pageTitle); ?></title>
<meta name="title" content="<?php echo clean($pageTitle); ?>">
<meta name="description" content="<?php echo clean($pageDescription); ?>">
<meta name="keywords" content="<?php echo clean($pageKeywords); ?>">
<meta name="author" content="waootapis">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="language" content="<?php echo $pageLanguage; ?>">
<meta name="revisit-after" content="7 days">
<link rel="canonical" href="<?php echo clean($canonicalUrl); ?>">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="<?php echo clean($pageType); ?>">
<meta property="og:url" content="<?php echo clean($currentUrl); ?>">
<meta property="og:title" content="<?php echo clean($pageTitle); ?>">
<meta property="og:description" content="<?php echo clean($pageDescription); ?>">
<meta property="og:image" content="<?php echo clean($pageImage); ?>">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="<?php echo clean($pageTitle); ?>">
<meta property="og:site_name" content="<?php echo clean(SITE_NAME); ?>">
<meta property="og:locale" content="fr_FR">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="<?php echo clean($currentUrl); ?>">
<meta name="twitter:title" content="<?php echo clean($pageTitle); ?>">
<meta name="twitter:description" content="<?php echo clean($pageDescription); ?>">
<meta name="twitter:image" content="<?php echo clean($pageImage); ?>">
<meta name="twitter:image:alt" content="<?php echo clean($pageTitle); ?>">

<!-- Additional SEO Meta Tags -->
<meta name="theme-color" content="#8B4513">
<meta name="msapplication-TileColor" content="#8B4513">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- Mobile Optimization -->
<meta name="format-detection" content="telephone=yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-touch-fullscreen" content="yes">

<!-- Structured Data (JSON-LD) -->
<?php if ($structuredData): ?>
<script type="application/ld+json">
<?php echo json_encode($structuredData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT); ?>
</script>
<?php endif; ?>

