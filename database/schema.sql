-- ==========================================================
-- Gold Buyers Colombo (GBC) - MySQL Database Schema
-- Compatible with phpMyAdmin, cPanel, and Hostinger Shared Hosting
-- Target: MySQL 8.0+ / MariaDB 10.4+
-- ==========================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `gbc_crm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gbc_crm`;

-- --------------------------------------------------------
-- Table structure for `gold_rates`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gold_rates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `karat` varchar(10) NOT NULL,
  `purity` decimal(5,4) NOT NULL DEFAULT 0.0000,
  `rate_per_gram` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency` varchar(10) NOT NULL DEFAULT 'LKR',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_karat` (`karat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `gold_rates` (`karat`, `purity`, `rate_per_gram`, `currency`) VALUES
('24K', 0.9990, 25600.00, 'LKR'),
('22K', 0.9160, 23450.00, 'LKR'),
('21K', 0.8750, 22400.00, 'LKR'),
('18K', 0.7500, 19200.00, 'LKR')
ON DUPLICATE KEY UPDATE `rate_per_gram` = VALUES(`rate_per_gram`), `purity` = VALUES(`purity`);

-- --------------------------------------------------------
-- Table structure for `rate_history`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rate_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recorded_date` date NOT NULL,
  `rate_24k` decimal(12,2) NOT NULL,
  `rate_22k` decimal(12,2) NOT NULL,
  `rate_21k` decimal(12,2) NOT NULL,
  `rate_18k` decimal(12,2) NOT NULL,
  `pavan_rate` decimal(12,2) NOT NULL,
  `recorded_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_recorded_date` (`recorded_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rate_history` (`recorded_date`, `rate_24k`, `rate_22k`, `rate_21k`, `rate_18k`, `pavan_rate`) VALUES
('2026-05-01', 24800.00, 22700.00, 21700.00, 18600.00, 181600.00),
('2026-05-08', 25000.00, 22900.00, 21875.00, 18750.00, 183200.00),
('2026-05-15', 25250.00, 23150.00, 22100.00, 18940.00, 185200.00),
('2026-05-22', 25400.00, 23300.00, 22225.00, 19050.00, 186400.00),
('2026-05-29', 25600.00, 23450.00, 22400.00, 19200.00, 187600.00)
ON DUPLICATE KEY UPDATE `rate_24k` = VALUES(`rate_24k`);

-- --------------------------------------------------------
-- Table structure for `system_settings`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(64) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `system_settings` (`setting_key`, `setting_value`) VALUES
('bonusPremiumRate', '2.5'),
('testingFeePerGram', '0'),
('pavanWeightGrams', '8.0'),
('contactPhone', '+94 77 123 4567'),
('contactEmail', 'support@goldbuyerscolombo.com')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

-- --------------------------------------------------------
-- Table structure for `leads`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lead_uuid` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `gold_karat` varchar(20) DEFAULT '22K',
  `weight_grams` decimal(10,3) DEFAULT 0.000,
  `estimated_value` decimal(15,2) DEFAULT 0.00,
  `source` varchar(64) DEFAULT 'website',
  `status` enum('New','Contacted','Completed','Spam') NOT NULL DEFAULT 'New',
  `message` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_lead_uuid` (`lead_uuid`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
