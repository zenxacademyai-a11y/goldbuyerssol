<?php
/**
 * GET /api/media/index.php
 * List uploaded media assets in the Media Library with search & pagination
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

    $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(100, (int)$_GET['limit'])) : 40;
    $offset = ($page - 1) * $limit;
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    $whereClauses = [];
    $params = [];

    if (!empty($search)) {
        $whereClauses[] = "(m.original_name LIKE :search OR m.file_name LIKE :search OR m.alt_text LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    $whereSql = !empty($whereClauses) ? "WHERE " . implode(" AND ", $whereClauses) : "";

    // Count
    $countStmt = $db->prepare("SELECT COUNT(*) FROM media m {$whereSql}");
    $countStmt->execute($params);
    $totalMedia = (int)$countStmt->fetchColumn();

    // Query
    $sql = "SELECT m.id, m.file_name, m.original_name, m.file_path, m.mime_type, m.file_size, 
                   m.compressed_size, m.width, m.height, m.alt_text, m.created_by, m.created_at,
                   u.name AS uploader_name
            FROM media m
            LEFT JOIN users u ON m.created_by = u.id
            {$whereSql}
            ORDER BY m.id DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($sql);
    foreach ($params as $k => $v) {
        $stmt->bindValue($k, $v);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $media = $stmt->fetchAll();

    sendApiResponse(true, "Media items retrieved successfully", [
        'media' => $media,
        'pagination' => [
            'total' => $totalMedia,
            'page' => $page,
            'limit' => $limit,
            'total_pages' => ceil($totalMedia / $limit)
        ]
    ]);

} catch (Exception $e) {
    sendApiResponse(false, "Failed to fetch media assets: " . $e->getMessage(), null, 500);
}
