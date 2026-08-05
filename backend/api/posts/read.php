<?php
/**
 * GET /api/posts/read.php?slug=... or ?id=...
 * Fetch single post details by slug or ID with full category, author, tags, and JSON-LD schema
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

$id = $_GET['id'] ?? null;
$slug = $_GET['slug'] ?? null;

if (!$id && !$slug) {
    sendApiResponse(false, "Missing required query parameter: 'id' or 'slug'", null, 400);
}

try {
    $db = (new Database())->getConnection();

    $where = $id ? "p.id = :identifier" : "p.slug = :identifier";
    $identifier = $id ?? $slug;

    $sql = "SELECT 
                p.*,
                c.id as category_id, c.name as category_name, c.slug as category_slug,
                u.id as author_id, u.name as author_name, u.email as author_email, u.avatar as author_avatar, u.bio as author_bio
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.author_id = u.id
            WHERE {$where} AND p.deleted_at IS NULL
            LIMIT 1";

    $stmt = $db->prepare($sql);
    $stmt->execute([':identifier' => $identifier]);
    $post = $stmt->fetch();

    if (!$post) {
        sendApiResponse(false, "Blog post not found", null, 404);
    }

    // Increment views count
    $incStmt = $db->prepare("UPDATE posts SET views_count = views_count + 1 WHERE id = :id");
    $incStmt->execute([':id' => $post['id']]);

    // Fetch associated tags
    $tagStmt = $db->prepare("SELECT t.id, t.name, t.slug FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = :post_id");
    $tagStmt->execute([':post_id' => $post['id']]);
    $post['tags'] = $tagStmt->fetchAll();

    // Decode JSON schema if present
    if (!empty($post['schema_json'])) {
        $post['schema_json'] = json_decode($post['schema_json'], true);
    }

    sendApiResponse(true, "Post details retrieved", ['post' => $post]);

} catch (Exception $e) {
    sendApiResponse(false, "Error reading post: " . $e->getMessage(), null, 500);
}
