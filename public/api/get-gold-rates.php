<?php
/**
 * Live Gold Rates API Endpoint
 * Handles GET (fetch rates from MySQL) and POST (admin update rates to MySQL)
 * Production URL: https://goldbuyerscolombo.com/api/get-gold-rates.php
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$pdo = getDbConnection();

// Fallback rates if MySQL is not yet configured or during initial install
$defaultRates = [
    ['karat' => '24K', 'purity' => 0.999, 'ratePerGram' => 25600, 'currency' => 'LKR'],
    ['karat' => '22K', 'purity' => 0.916, 'ratePerGram' => 23450, 'currency' => 'LKR'],
    ['karat' => '21K', 'purity' => 0.875, 'ratePerGram' => 22400, 'currency' => 'LKR'],
    ['karat' => '18K', 'purity' => 0.750, 'ratePerGram' => 19200, 'currency' => 'LKR'],
];

$defaultSettings = [
    'bonusPremiumRate' => 2.5,
    'testingFeePerGram' => 0,
    'pavanWeightGrams' => 8.0,
    'lastUpdated' => gmdate('c'),
];

$defaultHistorical = [
    ['date' => '2026-05-01', '24K' => 24800, '22K' => 22700, '21K' => 21700, '18K' => 18600, 'pavan' => 181600],
    ['date' => '2026-05-08', '24K' => 25000, '22K' => 22900, '21K' => 21875, '18K' => 18750, 'pavan' => 183200],
    ['date' => '2026-05-15', '24K' => 25250, '22K' => 23150, '21K' => 22100, '18K' => 18940, 'pavan' => 185200],
    ['date' => '2026-05-22', '24K' => 25400, '22K' => 23300, '21K' => 22225, '18K' => 19050, 'pavan' => 186400],
    ['date' => '2026-05-29', '24K' => 25600, '22K' => 23450, '21K' => 22400, '18K' => 19200, 'pavan' => 187600],
];

// ==========================================
// 1. POST REQUEST: Admin Updates Gold Rates
// ==========================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid JSON payload received.'
        ]);
        exit;
    }

    if ($pdo) {
        try {
            $pdo->beginTransaction();

            // Save gold rates
            if (!empty($data['rates']) && is_array($data['rates'])) {
                $stmt = $pdo->prepare("
                    INSERT INTO `gold_rates` (`karat`, `purity`, `rate_per_gram`, `currency`, `updated_at`)
                    VALUES (:karat, :purity, :rate_per_gram, :currency, NOW())
                    ON DUPLICATE KEY UPDATE
                        `purity` = VALUES(`purity`),
                        `rate_per_gram` = VALUES(`rate_per_gram`),
                        `currency` = VALUES(`currency`),
                        `updated_at` = NOW()
                ");

                foreach ($data['rates'] as $r) {
                    $karat = trim((string)($r['karat'] ?? ''));
                    $purity = floatval($r['purity'] ?? 0);
                    $ratePerGram = floatval($r['ratePerGram'] ?? $r['rate_per_gram'] ?? 0);
                    $currency = trim((string)($r['currency'] ?? 'LKR'));

                    if (!empty($karat) && $ratePerGram > 0) {
                        $stmt->execute([
                            ':karat' => $karat,
                            ':purity' => $purity,
                            ':rate_per_gram' => $ratePerGram,
                            ':currency' => $currency
                        ]);
                    }
                }
            }

            // Save settings
            if (!empty($data['settings']) && is_array($data['settings'])) {
                $stmtSettings = $pdo->prepare("
                    INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`)
                    VALUES (:k, :v, NOW())
                    ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`), `updated_at` = NOW()
                ");

                foreach ($data['settings'] as $k => $v) {
                    $stmtSettings->execute([
                        ':k' => (string)$k,
                        ':v' => is_scalar($v) ? (string)$v : json_encode($v)
                    ]);
                }
            }

            // Insert into rate_history
            $ratesMap = [];
            if (!empty($data['rates'])) {
                foreach ($data['rates'] as $r) {
                    $ratesMap[$r['karat']] = floatval($r['ratePerGram'] ?? $r['rate_per_gram'] ?? 0);
                }
            }
            if (isset($ratesMap['22K']) && isset($ratesMap['24K'])) {
                $pavan = round($ratesMap['22K'] * 8.0, 2);
                $todayDate = date('Y-m-d');
                $histStmt = $pdo->prepare("
                    INSERT INTO `rate_history` (`recorded_date`, `rate_24k`, `rate_22k`, `rate_21k`, `rate_18k`, `pavan_rate`, `recorded_at`)
                    VALUES (:rdate, :r24, :r22, :r21, :r18, :pavan, NOW())
                    ON DUPLICATE KEY UPDATE
                        `rate_24k` = VALUES(`rate_24k`),
                        `rate_22k` = VALUES(`rate_22k`),
                        `rate_21k` = VALUES(`rate_21k`),
                        `rate_18k` = VALUES(`rate_18k`),
                        `pavan_rate` = VALUES(`pavan_rate`),
                        `recorded_at` = NOW()
                ");
                $histStmt->execute([
                    ':rdate' => $todayDate,
                    ':r24' => $ratesMap['24K'],
                    ':r22' => $ratesMap['22K'],
                    ':r21' => $ratesMap['21K'] ?? ($ratesMap['24K'] * 0.875),
                    ':r18' => $ratesMap['18K'] ?? ($ratesMap['24K'] * 0.750),
                    ':pavan' => $pavan,
                ]);
            }

            $pdo->commit();

            echo json_encode([
                'success' => true,
                'message' => 'Rates successfully updated in MySQL database',
                'data' => [
                    'updated_at' => gmdate('c')
                ]
            ]);
            exit;
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to save gold rates to MySQL: ' . $e->getMessage()
            ]);
            exit;
        }
    } else {
        // Standalone response if database not yet migrated
        echo json_encode([
            'success' => true,
            'message' => 'Rates accepted (database connection pending configuration)',
            'data' => [
                'updated_at' => gmdate('c')
            ]
        ]);
        exit;
    }
}

// ==========================================
// 2. GET REQUEST: Public & Admin Fetch Rates
// ==========================================
$rates = $defaultRates;
$settings = $defaultSettings;
$historical = $defaultHistorical;

if ($pdo) {
    try {
        // Read gold rates
        $stmt = $pdo->query("SELECT `karat`, `purity`, `rate_per_gram` as ratePerGram, `currency`, `updated_at` FROM `gold_rates` ORDER BY `purity` DESC");
        $dbRates = $stmt->fetchAll();
        if (!empty($dbRates)) {
            $rates = array_map(function($r) {
                return [
                    'karat' => (string)$r['karat'],
                    'purity' => floatval($r['purity']),
                    'ratePerGram' => floatval($r['ratePerGram']),
                    'currency' => (string)$r['currency']
                ];
            }, $dbRates);
        }

        // Read settings
        $stmtSettings = $pdo->query("SELECT `setting_key`, `setting_value` FROM `system_settings`");
        $dbSettings = $stmtSettings->fetchAll();
        if (!empty($dbSettings)) {
            foreach ($dbSettings as $row) {
                $k = $row['setting_key'];
                $v = $row['setting_value'];
                if (is_numeric($v)) {
                    $settings[$k] = floatval($v);
                } else {
                    $settings[$k] = $v;
                }
            }
        }

        // Read history
        $stmtHist = $pdo->query("SELECT `recorded_date` as `date`, `rate_24k` as `24K`, `rate_22k` as `22K`, `rate_21k` as `21K`, `rate_18k` as `18K`, `pavan_rate` as `pavan` FROM `rate_history` ORDER BY `recorded_date` DESC LIMIT 10");
        $dbHist = $stmtHist->fetchAll();
        if (!empty($dbHist)) {
            $historical = array_reverse(array_map(function($h) {
                return [
                    'date' => (string)$h['date'],
                    '24K' => floatval($h['24K']),
                    '22K' => floatval($h['22K']),
                    '21K' => floatval($h['21K']),
                    '18K' => floatval($h['18K']),
                    'pavan' => floatval($h['pavan'])
                ];
            }, $dbHist));
        }
    } catch (Exception $e) {
        error_log("Database read error: " . $e->getMessage());
    }
}

echo json_encode([
    'success' => true,
    'message' => 'Live gold rates retrieved successfully',
    'data' => [
        'rates' => $rates,
        'settings' => $settings,
        'historical' => $historical,
        'serverTime' => gmdate('c')
    ],
    'rates' => $rates,
    'settings' => $settings,
    'historical' => $historical,
    'lastUpdated' => $settings['lastUpdated'] ?? gmdate('c')
]);
