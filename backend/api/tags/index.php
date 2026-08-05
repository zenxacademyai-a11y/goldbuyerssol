<?php
/**
 * GET/POST /api/tags/index.php
 * List or create blog tags
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

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $stmt = $db->query("SELECT t.*, COUNT(pt.post_id) as post_count FROM tags t LEFT JOIN post_tags pt ON t.id = pt.tag_id GROUP BY t.id ORDER BY t.name ASC");
        $tags = $stmt->fetchAll();
        sendApiResponse(true, "Tags retrieved", ['tags' => $tags]);

    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireAuth($db);
        $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            sendApiResponse(false, "Tag name is required", null, 400);
        }

        $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : SecurityHelper::createSlug($name);

        $stmt = $db->prepare("INSERT INTO tags (name, slug) VALUES (:name, :slug) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)");
        $stmt->execute([':name' => $name, ':slug' => $slug]);

        sendApiResponse(true, "Tag created/retrieved", [
            'id' => $db->lastInsertId(),
            'name' => $name,
            'slug' => $slug
        ], 201);
    } else {
        sendApiResponse(false, "Method Not Allowed", null, 405);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Tag API Error: " . $e->getMessage(), null, 500);
}
