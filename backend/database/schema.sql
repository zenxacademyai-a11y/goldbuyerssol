-- ==============================================================================
-- PRODUCTION-READY MYSQL DATABASE SCHEMA FOR BLOG CMS
-- Compatible with MySQL 8.0+ and MariaDB 10.5+ (phpMyAdmin import ready)
-- Engine: InnoDB | Character Set: utf8mb4_unicode_ci
-- Features: Soft Deletes, SEO Metadata, Revision History, Tag Junctions, Audit Logs
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `post_revisions`;
DROP TABLE IF EXISTS `post_tags`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. USERS & AUTHORS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_uuid` CHAR(36) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(180) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'editor', 'author', 'contributor') NOT NULL DEFAULT 'author',
  `avatar` VARCHAR(500) NULL DEFAULT NULL,
  `bio` TEXT NULL DEFAULT NULL,
  `status` ENUM('active', 'suspended', 'inactive') NOT NULL DEFAULT 'active',
  `last_login_at` DATETIME NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_uuid` (`user_uuid`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `parent_id` INT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_categories_slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TAGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `tags` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_tags_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. MEDIA & IMAGE UPLOADS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `media` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `file_name` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `mime_type` VARCHAR(80) NOT NULL,
  `file_size` INT UNSIGNED NOT NULL,
  `compressed_size` INT UNSIGNED NULL DEFAULT NULL,
  `width` INT UNSIGNED NULL DEFAULT NULL,
  `height` INT UNSIGNED NULL DEFAULT NULL,
  `alt_text` VARCHAR(255) NULL DEFAULT NULL,
  `created_by` INT UNSIGNED NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_media_created_by` (`created_by`),
  CONSTRAINT `fk_media_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. POSTS TABLE (Core Article Store with Full SEO & Soft Delete)
-- ------------------------------------------------------------------------------
CREATE TABLE `posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_uuid` CHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(280) NOT NULL,
  `excerpt` TEXT NULL DEFAULT NULL,
  `content` LONGTEXT NOT NULL,
  `cover_image` VARCHAR(500) NULL DEFAULT NULL,
  `author_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NULL DEFAULT NULL,
  `status` ENUM('draft', 'published', 'scheduled', 'archived') NOT NULL DEFAULT 'draft',
  `visibility` ENUM('public', 'private', 'password_protected') NOT NULL DEFAULT 'public',
  `password_hash` VARCHAR(255) NULL DEFAULT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
  
  -- SEO & Structured Data Fields
  `meta_title` VARCHAR(255) NULL DEFAULT NULL,
  `meta_description` VARCHAR(320) NULL DEFAULT NULL,
  `canonical_url` VARCHAR(500) NULL DEFAULT NULL,
  `focus_keyword` VARCHAR(100) NULL DEFAULT NULL,
  `og_image` VARCHAR(500) NULL DEFAULT NULL,
  `schema_type` VARCHAR(50) NOT NULL DEFAULT 'Article',
  `schema_json` JSON NULL DEFAULT NULL,
  
  -- Scheduling, Timestamps & Soft Delete
  `published_at` DATETIME NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_posts_uuid` (`post_uuid`),
  UNIQUE KEY `uk_posts_slug` (`slug`),
  KEY `idx_posts_author` (`author_id`),
  KEY `idx_posts_category` (`category_id`),
  KEY `idx_posts_status_published` (`status`, `published_at`),
  KEY `idx_posts_deleted` (`deleted_at`),
  CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_posts_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. POST_TAGS JUNCTION TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `post_tags` (
  `post_id` INT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`post_id`, `tag_id`),
  KEY `idx_post_tags_tag` (`tag_id`),
  CONSTRAINT `fk_post_tags_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_post_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. POST REVISIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `post_revisions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `excerpt` TEXT NULL DEFAULT NULL,
  `created_by` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_revisions_post` (`post_id`),
  CONSTRAINT `fk_revisions_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT UNSIGNED NULL DEFAULT NULL,
  `payload_json` JSON NULL DEFAULT NULL,
  `ip_address` VARCHAR(45) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_user` (`user_id`),
  KEY `idx_audit_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INITIAL SEED DATA
INSERT INTO `users` (`id`, `user_uuid`, `name`, `email`, `password_hash`, `role`, `bio`) VALUES
(1, '8f2d1e2a-1111-4444-8888-999988887777', 'Chief Appraiser Admin', 'admin@goldlanka.lk', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe14a.zDq6/vCqQ5yFqV7xW3mY8k7mOOS', 'super_admin', 'Senior Gold Market Analyst and Head Appraiser at Gold Buyers Colombo.');

INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Gold Market Rates', 'gold-market-rates', 'Daily updates and expert analysis on gold market buying and selling rates in Sri Lanka.'),
(2, 'Selling Guides', 'selling-guides', 'Step-by-step guides for consumers on how to sell gold jewellery safely in Colombo.'),
(3, 'Appraisal & XRF Testing', 'appraisal-xrf-testing', 'Technical breakdowns of computerised XRF non-destructive gold testing methods.'),
(4, 'Industry News', 'industry-news', 'Latest news regarding CBSL regulations, import tariffs, and bullion trends.');

INSERT INTO `tags` (`id`, `name`, `slug`) VALUES
(1, 'Colombo Gold Buyers', 'colombo-gold-buyers'),
(2, '22K Gold Price', '22k-gold-price'),
(3, 'Sri Lanka Pavan Rate', 'sri-lanka-pavan-rate'),
(4, 'Cash For Gold', 'cash-for-gold'),
(5, 'XRF Testing', 'xrf-testing');

INSERT INTO `posts` (
  `id`, `post_uuid`, `title`, `slug`, `excerpt`, `content`, `cover_image`,
  `author_id`, `category_id`, `status`, `is_featured`, `views_count`,
  `meta_title`, `meta_description`, `canonical_url`, `focus_keyword`, `published_at`
) VALUES (
  1,
  'a1b2c3d4-5555-6666-7777-888899990000',
  '10 Best Gold Buyers in Colombo (2026 Market Guide)',
  '10-best-gold-buyers-in-colombo-2026',
  'Compare top-rated gold buying services in Colombo, Sri Lanka. Learn how to verify XRF spectrometer testing and secure maximum cash payout for your gold.',
  '<p>Selling gold jewellery in Colombo can be a lucrative process if you choose a licensed and transparent gold buyer. In this comprehensive 2026 guide, we analyze the top criteria for selecting a reliable gold purchasing partner.</p><h2>1. Computerised XRF Spectrometer Testing</h2><p>Never sell gold to buyers who use traditional destructive acid touchstones. Modern buyers like Gold Buyers Colombo utilize high-precision XRF spectrometers that measure gold purity down to 0.01% without scratching or damaging your items.</p><h2>2. Live Colombo Bullion Exchange Rates</h2><p>Ensure your gold is priced directly against daily international spot prices converted to LKR. Check daily rates for 24K, 22K, and 21K before accepting any offer.</p>',
  'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
  1, 2, 'published', 1, 1420,
  '10 Best Gold Buyers in Colombo 2026 | Highest Cash Payout Guide',
  'Compare Colombo top 10 gold buyers in 2026. Get highest market cash rate with instant computerized XRF testing and zero melting losses.',
  'https://www.goldlanka.lk/blog/10-best-gold-buyers-in-colombo-2026',
  'Gold Buyers in Colombo',
  NOW()
);

INSERT INTO `post_tags` (`post_id`, `tag_id`) VALUES
(1, 1), (1, 2), (1, 4);
