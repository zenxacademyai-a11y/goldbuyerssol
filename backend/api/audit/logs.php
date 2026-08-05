<?php
/**
 * GET /api/audit/logs.php
 * Retrieve system audit logs for security monitoring
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

try {
    $db = (new Database())->getConnection();
    $currentUser = requireAuth($db);

    // Only super_admin or admin roles can view audit logs
    if (!in_array($currentUser['role'], ['super_admin', 'admin', 'editor'])) {
        sendApiResponse(false, "Forbidden: Insufficient privileges to view security logs", null, 403);
    }

    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 30;
    $offset = ($page - 1) * $limit;

    $actionFilter = isset($_GET['action']) ? trim($_GET['action']) : '';
    $entityFilter = isset($_GET['entity_type']) ? trim($_GET['entity_type']) : '';

    $whereClauses = [];
    $params = [];

    if (!empty($actionFilter)) {
        $whereClauses[] = "a.action = :action";
        $params[':action'] = $actionFilter;
    }

    if (!empty($entityFilter)) {
        $whereClauses[] = "a.entity_type = :entity_type";
        $params[':entity_type'] = $entityFilter;
    }

    $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

    // Count query
    $countSql = "SELECT COUNT(*) AS total FROM audit_logs a {$whereSql}";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalLogs = (int)$countStmt->fetchColumn();

    // Data query
    $sql = "SELECT a.id, a.user_id, u.name AS user_name, u.email AS user_email, a.action, a.entity_type, 
                   a.entity_id, a.payload_json, a.ip_address, a.created_at
            FROM audit_logs a
            LEFT JOIN users u ON a.user_id = u.id
            {$whereSql}
            ORDER BY a.id DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $logs = $stmt->fetchAll();

    foreach ($logs as &$log) {
        if (!empty($log['payload_json'])) {
            $log['payload'] = json_decode($log['payload_json'], true);
        } else {
            $log['payload'] = null;
        }
        unset($log['payload_json']);
    }

    sendApiResponse(true, "Audit logs retrieved successfully", [
        'logs' => $logs,
        'pagination' => [
            'total' => $totalLogs,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($totalLogs / $limit)
        ]
    ]);

} catch (Exception $e) {
    sendApiResponse(false, "Failed to fetch audit logs: " . $e->getMessage(), null, 500);
}
