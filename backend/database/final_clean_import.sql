SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';



CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `type_id` int(11) DEFAULT NULL COMMENT 'Référence au type',
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL COMMENT 'Chemin vers l''image de la catégorie (ex: assets/images/categories/nom-image.jpg)',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `categories` (`id`, `type_id`, `name`, `slug`, `description`, `image`, `created_at`, `updated_at`) VALUES
(1, 9, 'Moderne on stock', 'moderne-on-stock', 'Tapis au design moderne et contemporain, disponibles immédiatement. Des modèles tendance qui apportent fraîcheur, harmonie et style minimaliste à vos espaces de vie.', 'assets/images/categories/6940040d95463_1765803021.png', '2025-12-13 16:48:58', '2025-12-16 13:54:20'),
(2, 9, 'L\'Iran on stock', 'l-iran-on-stock', 'Tapis iraniens classiques disponibles immédiatement, reconnus pour leurs motifs raffinés, leur richesse culturelle et leur qualité exceptionnelle. Des pièces intemporelles idéales pour apporter élégance et authenticité à votre intérieur.', 'assets/images/categories/69400370810ef_1765802864.png', '2025-12-13 16:48:58', '2025-12-16 13:51:50'),
(4, 9, 'Turc on stock', 'turc-on-stock', 'Tapis turcs de qualité disponibles en stock, appréciés pour leur finesse, leur résistance et leurs motifs élégants. Un choix idéal pour une décoration raffinée et durable.', 'assets/images/categories/694004639145b_1765803107.png', '2025-12-13 16:48:58', '2025-12-16 13:55:08'),
(5, 9, 'Marocain on stock', 'marocain-on-stock', 'Tapis marocains traditionnels disponibles en stock, célèbres pour leurs formes géométriques, leurs textures naturelles et leur caractère chaleureux. Parfaits pour une décoration à la fois authentique et conviviale.', 'assets/images/categories/694003c404f66_1765802948.png', '2025-12-13 16:48:58', '2025-12-16 13:52:28'),
(8, 8, 'Marocain  sur_mesure', 'marocain-sur-mesure', 'Tapis marocains réalisés sur mesure, mêlant tradition ancestrale et personnalisation moderne. Des créations uniques adaptées à votre espace, avec des motifs authentiques et une finition artisanale soignée.', 'assets/images/categories/694003b15b116_1765802929.png', '2025-12-13 16:58:04', '2025-12-16 13:52:50'),
(10, 8, 'L’Iran – Sur mesure', 'l-iran-sur-mesure', 'Tapis iraniens confectionnés sur mesure, inspirés de l’art persan traditionnel. Chaque pièce est réa', 'assets/images/categories/694003644ff69_1765802852.png', '2025-12-13 16:58:50', '2025-12-16 13:53:35'),
(11, 8, 'Moderne  sur_mesure', 'moderne-sur-mesure', 'Tapis modernes conçus sur mesure, aux lignes épurées et aux couleurs actuelles. Idéals pour les intérieurs contemporains, ils offrent une liberté totale de dimensions et un rendu design sur-mesure.', 'assets/images/categories/694003f5773ae_1765802997.png', '2025-12-13 16:59:01', '2025-12-16 13:54:37'),
(13, 8, 'Turc  sur_mesure', 'turc-sur-mesure', 'Tapis turcs confectionnés sur mesure, alliant tradition orientale et élégance. Chaque tapis est réalisé selon vos besoins, avec des motifs inspirés de l’art turc et une qualité remarquable.', 'assets/images/categories/69400451dddd9_1765803089.png', '2025-12-13 16:59:39', '2025-12-16 13:54:56');



CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied') DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `contact_messages` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Raymondhussy', 'no.reply.MarkJanssen@gmail.com', '85665659777', 'other', 'What’s up? waootapis.com \r\n \r\nDid you know that it is possible to send appeals legally and legitimately? \r\nWhen such requests are sent, no personal data is used, and messages are sent to forms specifically designed to receive messages and appeals securely. Messages sent via Communication Forms are unlikely to end up as spam, as they are viewed as essential. \r\nYou can now test out our service without having to pay. \r\nWe shall deliver up to 50,000 messages to you. \r\n \r\nThe cost of sending one million messages is $59. \r\n \r\nThis letter is automatically generated. \r\n \r\nContact us. \r\nTelegram - https://t.me/FeedbackFormEU \r\nWhatsApp - +375259112693 \r\nWhatsApp  https://wa.me/+375259112693 \r\nWe only use chat for communication.', 'new', '2025-12-22 19:57:54', '2025-12-22 19:57:54'),
(2, 'Mike Matthias Janssen', 'info@digital-x-press.com', '83383831368', 'order', 'Hi, \r\nI realize that some companies find it challenging recognizing that Answer Engine Optimization (AEO) is a continuous effort and a well-planned monthly initiative. \r\n \r\nThe reality is, very few businesses have the dedication to recognize the progressive yet meaningful results that can completely change their search performance. \r\n \r\nWith regular search engine updates, a consistent, long-term strategy including Answer Engine Optimization (AEO) is vital for securing a profitable outcome. \r\n \r\nIf you recognize this as the best method, collaborate with us! \r\n \r\nDiscover Our Monthly SEO Services https://www.digital-x-press.com/unbeatable-seo/ \r\n \r\nChat With Us on Instant Messaging https://www.digital-x-press.com/whatsapp-us/ \r\n \r\nWe provide unbeatable outcomes for your investment, and you will value choosing us as your SEO partner. \r\n \r\nBest regards, \r\nDigital X SEO Experts \r\nPhone/WhatsApp: +1 (844) 754-1148', 'new', '2026-01-04 14:37:25', '2026-01-04 14:37:25'),
(3, 'Mike Svein Andersson', 'mike@monkeydigital.co', '84557421283', 'other', 'Hi there, \r\n \r\nI wanted to connect with something that could seriously improve your website’s visitor count. We work with a trusted ad network that allows us to deliver real, location-based social ads traffic for just $10 per 10,000 visits. \r\n \r\nThis isn\'t bot traffic—it’s actual users, tailored to your target country and niche. \r\n \r\nWhat you get: \r\n \r\n10,000+ genuine visitors for just $10 \r\nGeo-targeted traffic for multiple regions \r\nLarger traffic packages available based on your needs \r\nTrusted by SEO experts—we even use this for our SEO clients! \r\n \r\nInterested? Check out the details here: \r\nhttps://www.monkeydigital.co/product/country-targeted-traffic/ \r\n \r\nOr chat with us on WhatsApp: \r\nhttps://monkeydigital.co/whatsapp-us/ \r\n \r\nLooking forward to getting you more traffic! \r\n \r\nBest, \r\nMike Svein Andersson\r\n \r\nPhone/whatsapp: +1 (775) 314-7914', 'new', '2026-01-04 17:30:24', '2026-01-04 17:30:24'),
(4, 'AndrewZew', 'no.reply.HeinzKarlsen@gmail.com', '84384818341', 'return', 'Wassup? waootapis.com \r\n \r\nDid you know that it is possible to send commercial offer perfectly lawfully? \r\nWhen such proposals are submitted, no personal information is utilized, and messages are routed to forms specifically configured to receive messages and appeals securely. Messages sent with Feedback Forms are not regarded as spam, as they are seen as crucial. \r\nWe offer you to test our service for free. \r\nWe are able to provide up to 50,000 messages for you. \r\n \r\nThe cost of sending one million messages is $59. \r\n \r\nThis letter is automatically generated. \r\n \r\nContact us. \r\nTelegram - https://t.me/FeedbackFormEU \r\nWhatsApp - +375259112693 \r\nWhatsApp  https://wa.me/+375259112693 \r\nWe only use chat for communication.', 'new', '2026-01-09 01:54:40', '2026-01-09 01:54:40'),
(5, 'John', 'johnloh@avail.zone', '267265601', 'other', 'Hi,\r\n\r\nAre you currently rewarding people who share your site, or just watching it happen naturally?\r\n\r\nRegards,\r\nJohn Loh', 'new', '2026-01-09 06:38:46', '2026-01-09 06:38:46'),
(6, 'Mike Thijs Dubois', 'info@strictlydigital.net', '84262685723', 'return', 'Greetings, \r\n \r\nReceiving some bunch of links pointing to waootapis.com might bring no value or negative impact for your website. \r\n \r\nIt really isn’t important the total inbound links you have, what matters is the amount of keywords those domains are optimized for. \r\n \r\nThat is the critical factor. \r\nNot the meaningless third-party metrics or SEO score. \r\nThat anyone can do these days. \r\nBUT the volume of ranking keywords the domains that point to your site rank for. \r\nThat’s what really matters. \r\n \r\nGet these quality links point to your website and your rankings will skyrocket! \r\n \r\nWe are providing this special service here: \r\nhttps://www.strictlydigital.net/product/semrush-backlinks/ \r\n \r\nIn doubt, or need more information, chat with us here: \r\nhttps://www.strictlydigital.net/whatsapp-us/ \r\n \r\nBest regards, \r\nMike Thijs Dubois\r\n \r\nstrictlydigital.net \r\nPhone/WhatsApp: +1 (877) 566-3738', 'new', '2026-01-10 08:46:13', '2026-01-10 08:46:13'),
(7, 'Mike Felix Schmidt', 'mike@monkeydigital.co', '87212127592', 'return', 'Hi, \r\n \r\nSearch is changing faster than most businesses realize. \r\n \r\nMore buyers are now discovering products and services through AI-driven platforms — not only traditional search results. This is why we created the AI Rankings SEO Plan at Monkey Digital. \r\n \r\nIt’s designed to help websites become clear, trusted, and discoverable by AI systems that increasingly influence how people find and choose businesses. \r\n \r\nYou can view the plan here: \r\nhttps://www.monkeydigital.co/ai-rankings/ \r\n \r\nIf you’d like to see whether this approach makes sense for your site, feel free to reach out directly — even a quick question is fine. Whatsapp: https://wa.link/b87jor \r\n \r\n \r\n \r\nBest regards, \r\nMike Felix Schmidt\r\n \r\nMonkey Digital \r\nmike@monkeydigital.co \r\nPhone/Whatsapp: +1 (775) 314-7914', 'new', '2026-01-20 22:32:57', '2026-01-20 22:32:57'),
(8, 'Olivier Gabriel Balzac', 'duckmenoffice11@gmail.com', '88926736942', 'other', 'Good day, \r\n \r\nMy name is Olivier Gabriel Balzac, a practicing lawyer from France. I previously contacted you regarding a transaction involving 13.5 million Euros, which was left by my late client before his unexpected demise. \r\n \r\nI am reaching out to you once more because, after examining your profile, I am thoroughly convinced that you are capable of managing this transaction effectively alongside me. \r\nIf you are interested, I would like to emphasize that after the transaction, 5% of the funds will be allocated to charitable organizations, while the remaining 95% will be divided equally between us, resulting in 47.5% for each party. \r\nThis transaction is entirely risk-free. Please respond to me at your earliest convenience to receive further details regarding the transaction. \r\nMy email: info@balzacavocate.com Sincerely, I look forward to your prompt response. \r\nBest regards. \r\nOlivier Gabriel Balzac, \r\nAttorney. \r\nPhone: +33 756 850 084 \r\nEmail: info@balzacavocate.com', 'new', '2026-01-23 03:23:18', '2026-01-23 03:23:18'),
(9, 'Mike Helmut Svensson', 'info@professionalseocleanup.com', '87815735613', 'order', 'Hi, \r\nWhile reviewing waootapis.com, we spotted toxic backlinks that could put your site at risk of a Google penalty. Especially that this Google SPAM update had a high impact in ranks. This is an easy and quick fix for you. Totally free of charge. No obligations. \r\n \r\nFix it now: \r\nhttps://www.professionalseocleanup.com/ \r\n \r\nNeed help or questions? Chat here: \r\nhttps://www.professionalseocleanup.com/whatsapp/ \r\n \r\nBest, \r\nMike Helmut Svensson\r\n \r\n+1 (855) 221-7591 \r\ninfo@professionalseocleanup.com', 'new', '2026-01-24 07:07:32', '2026-01-24 07:07:32'),
(10, 'Mike Peder Janssen', 'info@digital-x-press.com', '84788765466', 'other', 'Hi, \r\nI recognize that many businesses have difficulties recognizing that Answer Engine Optimization (AEO) is a gradual process and a carefully organized regular commitment. \r\n \r\nThe reality is, very few businesses have the patience to observe the gradual yet impactful results that can completely boost their search performance. \r\n \r\nWith Google’s evolving algorithms, a reliable, long-term strategy including Answer Engine Optimization (AEO) is essential for securing a profitable outcome. \r\n \r\nIf you recognize this as the right approach, collaborate with us! \r\n \r\nDiscover Our Monthly SEO Services https://www.digital-x-press.com/unbeatable-seo/ \r\n \r\nReach Out on Instant Messaging https://www.digital-x-press.com/whatsapp-us/ \r\n \r\nWe provide unbeatable outcomes for your budget, and you will appreciate choosing us as your growth partner. \r\n \r\nKind regards, \r\nDigital X SEO Experts \r\nPhone/WhatsApp: +1 (844) 754-1148', 'new', '2026-01-27 18:35:24', '2026-01-27 18:35:24'),
(11, 'Mike Dieter Van de Berg', 'mike@monkeydigital.co', '87922647545', 'return', 'Dear Webmaster, \r\n \r\nI wanted to connect with something that could seriously improve your website’s reach. We work with a trusted ad network that allows us to deliver real, location-based social ads traffic for just $10 per 10,000 visits. \r\n \r\nThis isn\'t junk clicks—it’s real visitors, tailored to your target country and niche. \r\n \r\nWhat you get: \r\n \r\n10,000+ genuine visitors for just $10 \r\nCountry-specific traffic for multiple regions \r\nHigher volumes available based on your needs \r\nTrusted by SEO experts—we even use this for our SEO clients! \r\n \r\nWant to give it a try? Check out the details here: \r\nhttps://www.monkeydigital.co/product/country-targeted-traffic/ \r\n \r\nOr connect instantly on WhatsApp: \r\nhttps://monkeydigital.co/whatsapp-us/ \r\n \r\nLooking forward to helping you grow! \r\n \r\nBest, \r\nMike Dieter Van de Berg\r\n \r\nPhone/whatsapp: +1 (775) 314-7914', 'new', '2026-02-01 21:33:20', '2026-02-01 21:33:20'),
(12, 'Michalak Aleksandra', 'aleksandramichalakalek51@gmail.com', '85475132824', 'order', 'Good day. \r\nMy name is Michalak Aleksandra, a Poland based business consultant. \r\nRunning a business means juggling a million things, and getting the funding you need shouldn\'t be another hurdle. We\'ve helped businesses to secure debt financing for growth, inventory, or operations, without the typical bank delays. \r\nTogether with our partners (investors), we offer a straightforward, transparent process with clear terms, designed to get you funded quickly so you can focus on your business. \r\nReady to explore our services? Please feel free to contact me directly by michalak.aleksandra@mail.com Let\'s make your business goals a reality, together. \r\nRegards, \r\nMichalak Aleksandra. \r\nEmail: michalak.aleksandra@mail.com', 'new', '2026-02-05 03:57:28', '2026-02-05 03:57:28'),
(13, 'Walterkip', 'no.reply.EnzoDupont@gmail.com', '81543541725', 'order', 'Greetings! waootapis.com \r\n \r\nDid you know that it is possible to send business proposals wholly legitimate? \r\nWhen such messages are sent, no personal data is used, and messages are sent to forms specifically designed to receive and process messages and appeals. Also, messages sent through Feedback Forms don\'t get into spam as such messages are considered to be of great importance. \r\nTake advantage of our free service! \r\nWe are able to dispatch up to 50,000 messages on your behalf. \r\n \r\nThe cost of sending one million messages is $59. \r\n \r\nThis offer is automatically generated. \r\n \r\nContact us. \r\nTelegram - https://t.me/FeedbackFormEU \r\nWhatsApp - +375259112693 \r\nWhatsApp  https://wa.me/+375259112693 \r\nWe only use chat for communication.', 'new', '2026-02-21 04:12:12', '2026-02-21 04:12:12');



CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `order_number` varchar(50) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_email` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_address` text NOT NULL,
  `customer_city` varchar(100) NOT NULL,
  `customer_postal_code` varchar(20) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `orders` (`id`, `order_number`, `customer_name`, `customer_email`, `customer_phone`, `customer_address`, `customer_city`, `customer_postal_code`, `total_amount`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(2, 'TAP-20251219-893429', 'ABDELLAH IBBA', 'taw.teen10@gmail.com', '0607790956', 'LOT LGUIDER N48 AV ALLAL EL FASSI', 'MARRAKECH', '40000', 20700.00, 'pending', '', '2025-12-19 11:34:32', '2025-12-19 11:34:32');



CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `length_cm` decimal(10,2) DEFAULT NULL COMMENT 'Longueur en centimètres',
  `width_cm` decimal(10,2) DEFAULT NULL COMMENT 'Largeur en centimètres',
  `surface_m2` decimal(10,4) DEFAULT NULL COMMENT 'Surface calculée en m²',
  `unit_price` decimal(10,2) DEFAULT NULL COMMENT 'Prix unitaire au m² au moment de la commande',
  `calculated_price` decimal(10,2) DEFAULT NULL COMMENT 'Prix calculé selon les dimensions (length × width × unit_price)',
  `color` varchar(50) DEFAULT NULL COMMENT 'Couleur sélectionnée par le client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `product_price`, `quantity`, `subtotal`, `length_cm`, `width_cm`, `surface_m2`, `unit_price`, `calculated_price`, `color`, `created_at`) VALUES
(5, 2, 47, 'Tapis Moderne - fixe #1', 900.00, 1, 900.00, NULL, NULL, NULL, 900.00, NULL, 'Green', '2025-12-19 11:34:32'),
(6, 2, 62, 'Tapis Marocain - sur_mesure #1', 1600.00, 1, 9600.00, 200.00, 300.00, 6.0000, 1600.00, 9600.00, 'Green', '2025-12-19 11:34:32'),
(7, 2, 64, 'Tapis Marocain - sur_mesure #3', 1700.00, 1, 10200.00, 200.00, 300.00, 6.0000, 1700.00, 10200.00, NULL, '2025-12-19 11:34:32');



CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `type_id` int(11) DEFAULT NULL COMMENT 'Référence au type',
  `type_category_id` int(11) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `color` text DEFAULT NULL COMMENT 'Couleurs du produit au format JSON: [{"name":"Rouge","index":1,"image":"path"},...] ou couleur simple (ancien format)',
  `stock` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `best_seller` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `products` (`id`, `name`, `slug`, `description`, `short_description`, `price`, `sale_price`, `category_id`, `type_id`, `type_category_id`, `material`, `size`, `color`, `stock`, `featured`, `best_seller`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Tapis Moderne Élégant', 'tapis-moderne-l-gant', 'Un magnifique tapis moderne qui apportera une touche d\'élégance à votre intérieur. Fabriqué avec des matériaux de qualité supérieure.', 'Tapis moderne élégant pour salon', 899.00, 699.00, 5, 9, 8, 'Laine', '200x300', '[{\"name\":\"Gris\",\"index\":1}]', 15, 1, 1, 'active', '2025-12-13 16:48:58', '2025-12-18 09:57:11'),
(2, 'Tapis Oriental Traditionnel', 'tapis-oriental-traditionnel', 'Tapis oriental authentique aux motifs traditionnels. Parfait pour ajouter une touche d\'exotisme à votre décoration.', 'Tapis oriental traditionnel', 1299.00, NULL, 2, 9, NULL, 'Soie et Laine', '250x350', '[{\"name\":\"Rouge\",\"index\":1},{\"name\":\"bleu\",\"index\":2}]', 8, 1, 0, 'active', '2025-12-13 16:48:58', '2025-12-15 09:50:22'),
(3, 'Tapis Marocain Beni Ourain', 'tapis-marocain-beni-ourain', 'Tapis marocain Beni Ourain authentique, tissé à la main par des artisans marocains. Design minimaliste et élégant.', 'Tapis marocain Beni Ourain', 150.00, 120.00, 10, 8, NULL, 'Laine', '400x2000', '[{\"name\":\"Beige\",\"index\":1},{\"name\":\"noir\",\"index\":2}]', 12, 1, 1, 'active', '2025-12-13 16:48:58', '2025-12-15 09:15:10'),
(5, 'Tapis Classique Persan', 'tapis-classique-persan', 'Tapis persan classique aux motifs raffinés. Un investissement pour votre intérieur qui durera des générations.', 'Tapis persan classique', 249.00, 200.00, 13, 8, NULL, 'Soie et Laine', '300x300', '[{\"name\":\"Marron\",\"index\":1},{\"name\":\"Orange\",\"index\":2},{\"name\":\"Rose\",\"index\":3}]', 5, 1, 0, 'active', '2025-12-13 16:48:58', '2025-12-15 10:55:04'),
(7, 'Tapis Moderne - fixe', 'tapis-moderne-fixe', 'Tapis Moderne - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - fixe', 900.00, NULL, 1, 9, NULL, 'Laine', '200x300', 'Rose', 10, 0, 0, 'active', '2025-12-15 11:13:42', '2025-12-15 11:20:55'),
(8, 'Tapis Classique - fixe', 'tapis-classique-fixe', 'Tapis Classique - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - fixe', 1000.00, NULL, 2, 9, NULL, 'Laine', '200x300', '[{\"name\":\"Beige\",\"index\":1},{\"name\":\"Rouge\",\"index\":2}]', 10, 0, 0, 'active', '2025-12-15 11:13:42', '2025-12-15 11:15:07'),
(10, 'Tapis Turc - fixe', 'tapis-turc-fixe', 'Tapis Turc - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - fixe', 1200.00, NULL, 4, 9, NULL, 'Laine', '200x300', 'Blanch', 10, 0, 0, 'active', '2025-12-15 11:13:42', '2025-12-15 11:20:55'),
(11, 'Tapis Marocain - fixe', 'tapis-marocain-fixe', 'Tapis Marocain - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - fixe', 1300.00, NULL, 5, 9, 3, 'Laine', '200x300', '[{\"name\":\"Violet\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:13:42', '2025-12-18 09:56:56'),
(12, 'Tapis Marocain - sur_mesure', 'tapis-marocain-sur-mesure', 'Tapis Marocain - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - sur_mesure', 1600.00, NULL, 8, 8, 11, 'Laine', '200x300', '[{\"name\":\"Bleu\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:13:42', '2025-12-18 09:56:06'),
(13, 'Tapis Classique - sur_mesure', 'tapis-classique-sur-mesure', 'Tapis Classique - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - sur_mesure', 1800.00, NULL, 10, 8, NULL, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:13:42', '2025-12-18 10:10:23'),
(14, 'Tapis Moderne - sur_mesure', 'tapis-moderne-sur-mesure', 'Tapis Moderne - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - sur_mesure', 1900.00, NULL, 11, 8, NULL, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:13:42', '2025-12-18 10:10:42'),
(16, 'Tapis Turc - sur_mesure', 'tapis-turc-sur-mesure', 'Tapis Turc - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - sur_mesure', 2100.00, NULL, 13, 8, NULL, 'Laine', '200x300', 'Rose', 10, 0, 0, 'active', '2025-12-15 11:13:43', '2025-12-15 11:20:55'),
(17, 'Tapis Moderne - fixe #1', 'tapis-moderne-fixe-1', 'Tapis Moderne - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - fixe #1', 900.00, NULL, 1, 9, NULL, 'Laine', '200x300', 'Turquoise', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(18, 'Tapis Moderne - fixe #2', 'tapis-moderne-fixe-2', 'Tapis Moderne - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - fixe #2', 950.00, NULL, 1, 9, NULL, 'Laine', '200x300', 'Violet', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(19, 'Tapis Moderne - fixe #3', 'tapis-moderne-fixe-3', 'Tapis Moderne - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - fixe #3', 1000.00, NULL, 1, 9, NULL, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 10:09:36'),
(20, 'Tapis Classique - fixe #1', 'tapis-classique-fixe-1', 'Tapis Classique - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - fixe #1', 1000.00, NULL, 2, 9, NULL, 'Laine', '200x300', 'Gris', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(21, 'Tapis Classique - fixe #2', 'tapis-classique-fixe-2', 'Tapis Classique - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - fixe #2', 1050.00, NULL, 2, 9, NULL, 'Laine', '200x300', 'Green', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(22, 'Tapis Classique - fixe #3', 'tapis-classique-fixe-3', 'Tapis Classique - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - fixe #3', 1100.00, NULL, 2, 9, NULL, 'Laine', '200x300', 'Noir', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(26, 'Tapis Turc - fixe #1', 'tapis-turc-fixe-1', 'Tapis Turc - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - fixe #1', 1200.00, NULL, 4, 9, NULL, 'Laine', '200x300', 'Rouge', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(27, 'Tapis Turc - fixe #2', 'tapis-turc-fixe-2', 'Tapis Turc - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - fixe #2', 1250.00, NULL, 4, 9, NULL, 'Laine', '200x300', 'Turquoise', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(28, 'Tapis Turc - fixe #3', 'tapis-turc-fixe-3', 'Tapis Turc - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - fixe #3', 1300.00, NULL, 4, 9, NULL, 'Laine', '200x300', 'Turquoise', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(29, 'Tapis Marocain - fixe #1', 'tapis-marocain-fixe-1', 'Tapis Marocain - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - fixe #1', 1300.00, NULL, 5, 9, 8, 'Laine', '200x300', '[{\"name\":\"Rouge\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 09:55:16'),
(30, 'Tapis Marocain - fixe #2', 'tapis-marocain-fixe-2', 'Tapis Marocain - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - fixe #2', 1350.00, NULL, 5, 9, 10, 'Laine', '200x300', '[{\"name\":\"Rose\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 09:56:21'),
(31, 'Tapis Marocain - fixe #3', 'tapis-marocain-fixe-3', 'Tapis Marocain - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - fixe #3', 1400.00, NULL, 5, 9, 10, 'Laine', '200x300', '[{\"name\":\"Bleu\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 09:56:41'),
(32, 'Tapis Marocain - sur_mesure #1', 'tapis-marocain-sur-mesure-1', 'Tapis Marocain - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - sur_mesure #1', 1600.00, NULL, 8, 8, 9, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 09:43:28'),
(33, 'Tapis Marocain - sur_mesure #2', 'tapis-marocain-sur-mesure-2', 'Tapis Marocain - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - sur_mesure #2', 1650.00, NULL, 8, 8, 5, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 09:44:12'),
(34, 'Tapis Marocain - sur_mesure #3', 'tapis-marocain-sur-mesure-3', 'Tapis Marocain - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - sur_mesure #3', 1700.00, NULL, 8, 8, 9, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 09:45:19'),
(35, 'Tapis Classique - sur_mesure #1', 'tapis-classique-sur-mesure-1', 'Tapis Classique - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - sur_mesure #1', 1800.00, NULL, 10, 8, NULL, 'Laine', '200x300', 'Gris', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(36, 'Tapis Classique - sur_mesure #2', 'tapis-classique-sur-mesure-2', 'Tapis Classique - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - sur_mesure #2', 1850.00, NULL, 10, 8, NULL, 'Laine', '200x300', 'Blanch', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(37, 'Tapis Classique - sur_mesure #3', 'tapis-classique-sur-mesure-3', 'Tapis Classique - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - sur_mesure #3', 1900.00, NULL, 10, 8, NULL, 'Laine', '200x300', 'Bleu', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(38, 'Tapis Moderne - sur_mesure #1', 'tapis-moderne-sur-mesure-1', 'Tapis Moderne - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - sur_mesure #1', 1900.00, NULL, 11, 8, NULL, 'Laine', '200x300', 'Marron', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(39, 'Tapis Moderne - sur_mesure #2', 'tapis-moderne-sur-mesure-2', 'Tapis Moderne - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - sur_mesure #2', 1950.00, NULL, 11, 8, NULL, 'Laine', '200x300', 'Turquoise', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(40, 'Tapis Moderne - sur_mesure #3', 'tapis-moderne-sur-mesure-3', 'Tapis Moderne - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - sur_mesure #3', 2000.00, NULL, 11, 8, NULL, 'Laine', '200x300', 'Rose', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(44, 'Tapis Turc - sur_mesure #1', 'tapis-turc-sur-mesure-1', 'Tapis Turc - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - sur_mesure #1', 2100.00, NULL, 13, 8, NULL, 'Laine', '200x300', '[{\"name\":\"Bleu\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-18 10:10:00'),
(45, 'Tapis Turc - sur_mesure #2', 'tapis-turc-sur-mesure-2', 'Tapis Turc - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - sur_mesure #2', 2150.00, NULL, 13, 8, NULL, 'Laine', '200x300', 'Orange', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(46, 'Tapis Turc - sur_mesure #3', 'tapis-turc-sur-mesure-3', 'Tapis Turc - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - sur_mesure #3', 2200.00, NULL, 13, 8, NULL, 'Laine', '200x300', 'Violet', 10, 0, 0, 'active', '2025-12-15 11:15:38', '2025-12-15 11:20:55'),
(47, 'Tapis Moderne - fixe #1', 'tapis-moderne-fixe-1-2', 'Tapis Moderne - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - fixe #1', 900.00, NULL, 1, 9, NULL, 'Laine', '200x300', 'Green', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(48, 'Tapis Moderne - fixe #2', 'tapis-moderne-fixe-2-2', 'Tapis Moderne - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - fixe #2', 950.00, NULL, 1, 9, NULL, 'Laine', '200x300', 'Violet', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(49, 'Tapis Moderne - fixe #3', 'tapis-moderne-fixe-3-1', 'Tapis Moderne - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - fixe #3', 1000.00, NULL, 1, 9, NULL, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 09:21:25'),
(50, 'Tapis Classique - fixe #1', 'tapis-classique-fixe-1-2', 'Tapis Classique - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - fixe #1', 1000.00, NULL, 2, 9, NULL, 'Laine', '200x300', 'Blanch', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(51, 'Tapis Classique - fixe #2', 'tapis-classique-fixe-2-2', 'Tapis Classique - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - fixe #2', 1050.00, NULL, 2, 9, NULL, 'Laine', '200x300', 'Violet', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(52, 'Tapis Classique - fixe #3', 'tapis-classique-fixe-3-2', 'Tapis Classique - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - fixe #3', 1100.00, NULL, 2, 9, NULL, 'Laine', '200x300', 'Noir', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(56, 'Tapis Turc - fixe #1', 'tapis-turc-fixe-1-2', 'Tapis Turc - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - fixe #1', 1200.00, NULL, 4, 9, NULL, 'Laine', '200x300', 'Violet', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(57, 'Tapis Turc - fixe #2', 'tapis-turc-fixe-2-2', 'Tapis Turc - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - fixe #2', 1250.00, NULL, 4, 9, NULL, 'Laine', '200x300', 'Violet', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(58, 'Tapis Turc - fixe #3', 'tapis-turc-fixe-3-2', 'Tapis Turc - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - fixe #3', 1300.00, NULL, 4, 9, NULL, 'Laine', '200x300', 'Orange', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(59, 'Tapis Marocain - fixe #1', 'tapis-marocain-fixe-1-1', 'Tapis Marocain - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - fixe #1', 1300.00, NULL, 5, 9, 6, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 09:53:59'),
(60, 'Tapis Marocain - fixe #2', 'tapis-marocain-fixe-2-1', 'Tapis Marocain - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - fixe #2', 1350.00, NULL, 5, 9, 3, 'Laine', '200x300', '[{\"name\":\"Gris\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 09:54:36'),
(61, 'Tapis Marocain - fixe #3', 'tapis-marocain-fixe-3-1', 'Tapis Marocain - fixe de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - fixe #3', 1400.00, NULL, 5, 9, 2, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 09:54:56'),
(62, 'Tapis Marocain - sur_mesure #1', 'tapis-marocain-sur-mesure-1-1', 'Tapis Marocain - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - sur_mesure #1', 1600.00, NULL, 8, 8, 5, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 09:39:25'),
(63, 'Tapis Marocain - sur_mesure #2', 'tapis-marocain-sur-mesure-2-1', 'Tapis Marocain - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - sur_mesure #2', 1650.00, NULL, 8, 8, 1, 'Laine', '200x300', '', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 09:40:58'),
(64, 'Tapis Marocain - sur_mesure #3', 'tapis-marocain-sur-mesure-3-1', 'Tapis Marocain - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Marocain - sur_mesure #3', 1700.00, NULL, 8, 8, 7, 'Laine', '200x300', '[{\"name\":\"Rouge\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 09:41:36'),
(65, 'Tapis Classique - sur_mesure #1', 'tapis-classique-sur-mesure-1-2', 'Tapis Classique - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - sur_mesure #1', 1800.00, NULL, 10, 8, NULL, 'Laine', '200x300', 'Jaune', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(66, 'Tapis Classique - sur_mesure #2', 'tapis-classique-sur-mesure-2-2', 'Tapis Classique - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - sur_mesure #2', 1850.00, NULL, 10, 8, NULL, 'Laine', '200x300', 'Marron', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(67, 'Tapis Classique - sur_mesure #3', 'tapis-classique-sur-mesure-3-2', 'Tapis Classique - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Classique - sur_mesure #3', 1900.00, NULL, 10, 8, NULL, 'Laine', '200x300', 'Jaune', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(68, 'Tapis Moderne - sur_mesure #1', 'tapis-moderne-sur-mesure-1-2', 'Tapis Moderne - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - sur_mesure #1', 1900.00, NULL, 11, 8, NULL, 'Laine', '200x300', 'Jaune', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(69, 'Tapis Moderne - sur_mesure #2', 'tapis-moderne-sur-mesure-2-2', 'Tapis Moderne - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - sur_mesure #2', 1950.00, NULL, 11, 8, NULL, 'Laine', '200x300', 'Gris', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(70, 'Tapis Moderne - sur_mesure #3', 'tapis-moderne-sur-mesure-3-2', 'Tapis Moderne - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Moderne - sur_mesure #3', 2000.00, NULL, 11, 8, NULL, 'Laine', '200x300', 'Violet', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(74, 'Tapis Turc - sur_mesure #1', 'tapis-turc-sur-mesure-1-1', 'Tapis Turc - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - sur_mesure #1', 2100.00, NULL, 13, 8, NULL, 'Laine', '200x300', '[{\"name\":\"Bleu\",\"index\":1}]', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-18 10:09:15'),
(75, 'Tapis Turc - sur_mesure #2', 'tapis-turc-sur-mesure-2-2', 'Tapis Turc - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - sur_mesure #2', 2150.00, NULL, 13, 8, NULL, 'Laine', '200x300', 'Gris', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55'),
(76, 'Tapis Turc - sur_mesure #3', 'tapis-turc-sur-mesure-3-2', 'Tapis Turc - sur_mesure de haute qualité, sélectionné automatiquement pour la démo.', 'Tapis Turc - sur_mesure #3', 2200.00, NULL, 13, 8, NULL, 'Laine', '200x300', 'Orange', 10, 0, 0, 'active', '2025-12-15 11:15:45', '2025-12-15 11:20:55');



CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `product_images` (`id`, `product_id`, `image_path`, `is_primary`, `display_order`, `created_at`) VALUES
(7, 1, 'assets/images/products/693fceecb7a71_1765789420.jpeg', 1, 0, '2025-12-15 09:03:40'),
(8, 2, 'assets/images/products/693fcf14719b2_1765789460.jpeg', 1, 0, '2025-12-15 09:04:20'),
(9, 3, 'assets/images/products/693fd19e09047_1765790110.jpeg', 1, 0, '2025-12-15 09:15:10'),
(13, 5, 'assets/images/products/693fd3921f83e_1765790610.jpeg', 1, 0, '2025-12-15 09:23:30'),
(15, 7, 'assets/images/products/69395baec2fc0_1765366702.jpeg', 1, 1, '2025-12-15 11:13:42'),
(16, 8, 'assets/images/products/69395c24407a2_1765366820.jpeg', 1, 1, '2025-12-15 11:13:42'),
(18, 10, 'assets/images/products/69395ce8d5747_1765367016.jpeg', 1, 1, '2025-12-15 11:13:42'),
(19, 11, 'assets/images/products/69395d0334fbc_1765367043.jpeg', 1, 1, '2025-12-15 11:13:42'),
(20, 12, 'assets/images/products/69398e8e60665_1765379726.jpeg', 1, 1, '2025-12-15 11:13:42'),
(24, 16, 'assets/images/products/69398fd69354c_1765380054.jpeg', 1, 1, '2025-12-15 11:13:43'),
(25, 17, 'assets/images/products/69395baec2fc0_1765366702.jpeg', 1, 1, '2025-12-15 11:15:38'),
(26, 18, 'assets/images/products/69395c24407a2_1765366820.jpeg', 1, 1, '2025-12-15 11:15:38'),
(28, 20, 'assets/images/products/69395ce8d5747_1765367016.jpeg', 1, 1, '2025-12-15 11:15:38'),
(29, 21, 'assets/images/products/69395d0334fbc_1765367043.jpeg', 1, 1, '2025-12-15 11:15:38'),
(30, 22, 'assets/images/products/69398e8e60665_1765379726.jpeg', 1, 1, '2025-12-15 11:15:38'),
(34, 26, 'assets/images/products/69398fd69354c_1765380054.jpeg', 1, 1, '2025-12-15 11:15:38'),
(35, 27, 'assets/images/products/6939900939773_1765380105.jpeg', 1, 1, '2025-12-15 11:15:38'),
(36, 28, 'assets/images/products/69399028b13d0_1765380136.jpeg', 1, 1, '2025-12-15 11:15:38'),
(37, 29, 'assets/images/products/6939904a9b5fa_1765380170.jpeg', 1, 1, '2025-12-15 11:15:38'),
(38, 30, 'assets/images/products/693990713a7e8_1765380209.jpeg', 1, 1, '2025-12-15 11:15:38'),
(39, 31, 'assets/images/products/6939909b9e03f_1765380251.jpeg', 1, 1, '2025-12-15 11:15:38'),
(40, 32, 'assets/images/products/693990e52e788_1765380325.jpeg', 1, 1, '2025-12-15 11:15:38'),
(41, 33, 'assets/images/products/693991031803f_1765380355.jpeg', 1, 1, '2025-12-15 11:15:38'),
(42, 34, 'assets/images/products/69399139f3c4c_1765380409.jpeg', 1, 1, '2025-12-15 11:15:38'),
(43, 35, 'assets/images/products/6939915bdd9a8_1765380443.jpeg', 1, 1, '2025-12-15 11:15:38'),
(44, 36, 'assets/images/products/6939917d4a076_1765380477.jpeg', 1, 1, '2025-12-15 11:15:38'),
(45, 37, 'assets/images/products/693c499f64383_1765558687.jpeg', 1, 1, '2025-12-15 11:15:38'),
(46, 38, 'assets/images/products/693c499f6602a_1765558687.jpeg', 1, 1, '2025-12-15 11:15:38'),
(47, 39, 'assets/images/products/693d25e0d38aa_1765615072.jpeg', 1, 1, '2025-12-15 11:15:38'),
(48, 40, 'assets/images/products/693d25e0d5bb0_1765615072.jpeg', 1, 1, '2025-12-15 11:15:38'),
(53, 45, 'assets/images/products/693fd3921f83e_1765790610.jpeg', 1, 1, '2025-12-15 11:15:38'),
(54, 46, 'assets/images/products/693fe830e406d_1765795888.jpeg', 1, 1, '2025-12-15 11:15:38'),
(55, 47, 'assets/images/products/69395baec2fc0_1765366702.jpeg', 1, 1, '2025-12-15 11:15:45'),
(56, 48, 'assets/images/products/69395c24407a2_1765366820.jpeg', 1, 1, '2025-12-15 11:15:45'),
(58, 50, 'assets/images/products/69395ce8d5747_1765367016.jpeg', 1, 1, '2025-12-15 11:15:45'),
(59, 51, 'assets/images/products/69395d0334fbc_1765367043.jpeg', 1, 1, '2025-12-15 11:15:45'),
(60, 52, 'assets/images/products/69398e8e60665_1765379726.jpeg', 1, 1, '2025-12-15 11:15:45'),
(64, 56, 'assets/images/products/69398fd69354c_1765380054.jpeg', 1, 1, '2025-12-15 11:15:45'),
(65, 57, 'assets/images/products/6939900939773_1765380105.jpeg', 1, 1, '2025-12-15 11:15:45'),
(66, 58, 'assets/images/products/69399028b13d0_1765380136.jpeg', 1, 1, '2025-12-15 11:15:45'),
(67, 59, 'assets/images/products/6939904a9b5fa_1765380170.jpeg', 1, 1, '2025-12-15 11:15:45'),
(68, 60, 'assets/images/products/693990713a7e8_1765380209.jpeg', 1, 1, '2025-12-15 11:15:45'),
(69, 61, 'assets/images/products/6939909b9e03f_1765380251.jpeg', 1, 1, '2025-12-15 11:15:45'),
(70, 62, 'assets/images/products/693990e52e788_1765380325.jpeg', 1, 1, '2025-12-15 11:15:45'),
(71, 63, 'assets/images/products/693991031803f_1765380355.jpeg', 1, 1, '2025-12-15 11:15:45'),
(72, 64, 'assets/images/products/69399139f3c4c_1765380409.jpeg', 1, 1, '2025-12-15 11:15:45'),
(73, 65, 'assets/images/products/6939915bdd9a8_1765380443.jpeg', 1, 1, '2025-12-15 11:15:45'),
(74, 66, 'assets/images/products/6939917d4a076_1765380477.jpeg', 1, 1, '2025-12-15 11:15:45'),
(75, 67, 'assets/images/products/693c499f64383_1765558687.jpeg', 1, 1, '2025-12-15 11:15:45'),
(76, 68, 'assets/images/products/693c499f6602a_1765558687.jpeg', 1, 1, '2025-12-15 11:15:45'),
(77, 69, 'assets/images/products/693d25e0d38aa_1765615072.jpeg', 1, 1, '2025-12-15 11:15:45'),
(78, 70, 'assets/images/products/693d25e0d5bb0_1765615072.jpeg', 1, 1, '2025-12-15 11:15:45'),
(83, 75, 'assets/images/products/693fd3921f83e_1765790610.jpeg', 1, 1, '2025-12-15 11:15:45'),
(84, 76, 'assets/images/products/693fe830e406d_1765795888.jpeg', 1, 1, '2025-12-15 11:15:45'),
(85, 49, 'assets/images/products/6943c7951efc0_1766049685.jpeg', 1, 0, '2025-12-18 09:21:25'),
(86, 74, 'assets/images/products/6943d2cb450d1_1766052555.jpeg', 1, 0, '2025-12-18 10:09:15'),
(87, 19, 'assets/images/products/6943d2e040731_1766052576.jpeg', 1, 0, '2025-12-18 10:09:36'),
(88, 44, 'assets/images/products/6943d2f82c4a7_1766052600.jpeg', 1, 0, '2025-12-18 10:10:00'),
(89, 13, 'assets/images/products/6943d30fde8ee_1766052623.jpeg', 1, 0, '2025-12-18 10:10:23'),
(90, 14, 'assets/images/products/6943d3224ed95_1766052642.jpeg', 1, 0, '2025-12-18 10:10:42');



CREATE TABLE `types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `types` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(8, 'sur_mesure', 'sur_mesure', '2025-12-13 16:53:10', '2025-12-13 16:53:10'),
(9, 'fixe', 'fixe', '2025-12-13 16:53:24', '2025-12-13 16:53:24');



CREATE TABLE `types_categorier` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `types_categorier` (`id`, `name`, `category_id`) VALUES
(1, 'Beni Ouarain', 8),
(2, 'Beni Ouarain', 5),
(3, 'Beni Mguild', 5),
(5, 'Azilal', 8),
(6, 'Azilal', 5),
(7, 'Zayan', 8),
(8, 'Zayan', 5),
(9, 'Beni Mguild', 8),
(10, 'Taznakht', 5),
(11, 'Taznakht', 8);


ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_type` (`type_id`);

ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_created_at` (`created_at`);

ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_number` (`order_number`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_order_number` (`order_number`);

ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order` (`order_id`),
  ADD KEY `idx_product` (`product_id`),
  ADD KEY `idx_dimensions` (`length_cm`,`width_cm`);

ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_category` (`category_id`),
  ADD KEY `idx_type` (`type_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_featured` (`featured`),
  ADD KEY `idx_best_seller` (`best_seller`),
  ADD KEY `fk_products_type_category` (`type_category_id`);

ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product` (`product_id`);

ALTER TABLE `types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_name` (`name`);

ALTER TABLE `types_categorier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_category_id` (`category_id`);


ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

ALTER TABLE `types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

ALTER TABLE `types_categorier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;


ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE SET NULL;

ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_type_category` FOREIGN KEY (`type_category_id`) REFERENCES `types_categorier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE SET NULL;

ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

ALTER TABLE `types_categorier`
  ADD CONSTRAINT `fk_types_categorier_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

