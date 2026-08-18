<?php
/**
 * REST API: System Settings
 * GET  /api/settings/index.php (Fetch all settings)
 * POST /api/settings/index.php (Batch update settings)
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/security.php';
require_once __DIR__ . '/../../middleware/auth.php';

sendCorsHeaders();

try {
    $db = (new Database())->getConnection();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $db->query("SELECT setting_key, setting_value, group_name FROM settings");
        $rows = $stmt->fetchAll();

        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }

        sendApiResponse(true, "Settings fetched successfully", [
            'settings' => $settings,
            'grouped' => $rows
        ]);

    } elseif ($method === 'POST' || $method === 'PUT') {
        requireAuth($db, ['super_admin', 'editor']);
        $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;

        if (empty($input) || !is_array($input)) {
            sendApiResponse(false, "Invalid settings payload", null, 400);
        }

        $stmt = $db->prepare("
            INSERT INTO settings (setting_key, setting_value, group_name, updated_at)
            VALUES (:key, :val, :group, NOW())
            ON DUPLICATE KEY UPDATE setting_value = :val2, updated_at = NOW()
        ");

        foreach ($input as $k => $v) {
            if (is_array($v)) $v = json_encode($v);
            $group = 'general';
            if (str_starts_with($k, 'seo_') || str_contains($k, 'meta')) $group = 'seo';
            if (str_starts_with($k, 'comment')) $group = 'comments';
            if (str_starts_with($k, 'gold_') || str_starts_with($k, 'rate_')) $group = 'rates';

            $stmt->execute([
                ':key' => (string)$k,
                ':val' => (string)$v,
                ':group' => $group,
                ':val2' => (string)$v
            ]);
        }

        sendApiResponse(true, "Settings updated successfully", ['updated_keys' => array_keys($input)]);

    } else {
        sendApiResponse(false, "Method Not Allowed", null, 405);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Settings API Error: " . $e->getMessage(), null, 500);
}
