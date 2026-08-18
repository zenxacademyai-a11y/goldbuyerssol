<?php
/**
 * REST API: Categories Management
 * GET    /api/categories/index.php (List categories)
 * POST   /api/categories/index.php (Create category)
 * PUT    /api/categories/index.php (Update category)
 * DELETE /api/categories/index.php (Delete category)
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
            SELECT c.*, COUNT(p.id) as post_count 
            FROM categories c 
            LEFT JOIN posts p ON c.id = p.category_id AND p.deleted_at IS NULL 
            GROUP BY c.id 
            ORDER BY c.name ASC
        ");
        $categories = $stmt->fetchAll();
        sendApiResponse(true, "Categories retrieved", ['categories' => $categories]);

    } elseif ($method === 'POST') {
        requireAuth($db);
        $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;

        $name = SecurityHelper::sanitizeString($input['name'] ?? '');
        if (empty($name)) {
            sendApiResponse(false, "Category name is required", null, 400);
        }

        $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : SecurityHelper::createSlug($name);
        $description = SecurityHelper::sanitizeString($input['description'] ?? '');

        $stmt = $db->prepare("INSERT INTO categories (name, slug, description) VALUES (:name, :slug, :description)");
        $stmt->execute([':name' => $name, ':slug' => $slug, ':description' => $description]);

        sendApiResponse(true, "Category created successfully", [
            'id' => (int)$db->lastInsertId(),
            'name' => $name,
            'slug' => $slug,
            'description' => $description
        ], 201);

    } elseif ($method === 'PUT') {
        requireAuth($db, ['super_admin', 'editor']);
        $input = json_decode(file_get_contents("php://input"), true) ?? [];
        $id = (int)($input['id'] ?? 0);
        $name = SecurityHelper::sanitizeString($input['name'] ?? '');
        $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : (!empty($name) ? SecurityHelper::createSlug($name) : null);
        $description = isset($input['description']) ? SecurityHelper::sanitizeString($input['description']) : null;

        if (!$id || empty($name)) {
            sendApiResponse(false, "Category ID and Name are required", null, 400);
        }

        $stmt = $db->prepare("
            UPDATE categories 
            SET name = :name, slug = :slug, description = :description, updated_at = NOW() 
            WHERE id = :id
        ");
        $stmt->execute([
            ':name' => $name,
            ':slug' => $slug,
            ':description' => $description,
            ':id' => $id
        ]);

        sendApiResponse(true, "Category updated successfully", [
            'id' => $id,
            'name' => $name,
            'slug' => $slug,
            'description' => $description
        ]);

    } elseif ($method === 'DELETE') {
        requireAuth($db, ['super_admin', 'editor']);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            $input = json_decode(file_get_contents("php://input"), true) ?? [];
            $id = (int)($input['id'] ?? 0);
        }

        if (!$id) {
            sendApiResponse(false, "Category ID is required", null, 400);
        }

        // Reassign or set null for posts
        $db->prepare("UPDATE posts SET category_id = NULL WHERE category_id = :id")->execute([':id' => $id]);

        $stmt = $db->prepare("DELETE FROM categories WHERE id = :id");
        $stmt->execute([':id' => $id]);

        sendApiResponse(true, "Category deleted successfully", ['id' => $id]);

    } else {
        sendApiResponse(false, "Method Not Allowed", null, 405);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Category API Error: " . $e->getMessage(), null, 500);
}
