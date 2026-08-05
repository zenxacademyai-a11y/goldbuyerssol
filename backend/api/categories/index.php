<?php
/**
 * GET/POST /api/categories/index.php
 * List or create blog categories
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
        $stmt = $db->query("SELECT c.*, COUNT(p.id) as post_count FROM categories c LEFT JOIN posts p ON c.id = p.category_id AND p.deleted_at IS NULL GROUP BY c.id ORDER BY c.name ASC");
        $categories = $stmt->fetchAll();
        sendApiResponse(true, "Categories retrieved", ['categories' => $categories]);

    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireAuth($db);
        $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;

        $name = trim($input['name'] ?? '');
        if (empty($name)) {
            sendApiResponse(false, "Category name is required", null, 400);
        }

        $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : SecurityHelper::createSlug($name);
        $description = trim($input['description'] ?? '');

        $stmt = $db->prepare("INSERT INTO categories (name, slug, description) VALUES (:name, :slug, :description)");
        $stmt->execute([':name' => $name, ':slug' => $slug, ':description' => $description]);

        sendApiResponse(true, "Category created successfully", [
            'id' => $db->lastInsertId(),
            'name' => $name,
            'slug' => $slug
        ], 201);
    } else {
        sendApiResponse(false, "Method Not Allowed", null, 405);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Category API Error: " . $e->getMessage(), null, 500);
}
