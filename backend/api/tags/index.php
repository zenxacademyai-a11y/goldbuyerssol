<?php
/**
 * REST API: Tags Management
 * GET    /api/tags/index.php (List tags)
 * POST   /api/tags/index.php (Create tag)
 * PUT    /api/tags/index.php (Update tag)
 * DELETE /api/tags/index.php (Delete tag)
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
        $stmt = $db->query("
            SELECT t.*, COUNT(pt.post_id) as post_count 
            FROM tags t 
            LEFT JOIN post_tags pt ON t.id = pt.tag_id 
            GROUP BY t.id 
            ORDER BY t.name ASC
        ");
        $tags = $stmt->fetchAll();
        sendApiResponse(true, "Tags retrieved", ['tags' => $tags]);

    } elseif ($method === 'POST') {
        requireAuth($db);
        $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;

        $name = SecurityHelper::sanitizeString($input['name'] ?? '');
        if (empty($name)) {
            sendApiResponse(false, "Tag name is required", null, 400);
        }

        $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : SecurityHelper::createSlug($name);

        $stmt = $db->prepare("INSERT INTO tags (name, slug) VALUES (:name, :slug) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)");
        $stmt->execute([':name' => $name, ':slug' => $slug]);

        sendApiResponse(true, "Tag created/retrieved", [
            'id' => (int)$db->lastInsertId(),
            'name' => $name,
            'slug' => $slug
        ], 201);

    } elseif ($method === 'PUT') {
        requireAuth($db, ['super_admin', 'editor']);
        $input = json_decode(file_get_contents("php://input"), true) ?? [];
        $id = (int)($input['id'] ?? 0);
        $name = SecurityHelper::sanitizeString($input['name'] ?? '');
        $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : (!empty($name) ? SecurityHelper::createSlug($name) : null);

        if (!$id || empty($name)) {
            sendApiResponse(false, "Tag ID and Name are required", null, 400);
        }

        $stmt = $db->prepare("UPDATE tags SET name = :name, slug = :slug WHERE id = :id");
        $stmt->execute([':name' => $name, ':slug' => $slug, ':id' => $id]);

        sendApiResponse(true, "Tag updated successfully", ['id' => $id, 'name' => $name, 'slug' => $slug]);

    } elseif ($method === 'DELETE') {
        requireAuth($db, ['super_admin', 'editor']);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            $input = json_decode(file_get_contents("php://input"), true) ?? [];
            $id = (int)($input['id'] ?? 0);
        }

        if (!$id) {
            sendApiResponse(false, "Tag ID is required", null, 400);
        }

        $stmt = $db->prepare("DELETE FROM tags WHERE id = :id");
        $stmt->execute([':id' => $id]);

        sendApiResponse(true, "Tag deleted successfully", ['id' => $id]);

    } else {
        sendApiResponse(false, "Method Not Allowed", null, 405);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Tag API Error: " . $e->getMessage(), null, 500);
}
