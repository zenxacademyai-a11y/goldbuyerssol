<?php
/**
 * PUT /api/posts/update.php
 * Update post content, SEO fields, category, status, scheduling date, or tags
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/security.php';
require_once __DIR__ . '/../../helpers/logger.php';
require_once __DIR__ . '/../../middleware/auth.php';

sendCorsHeaders();

if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST'], true)) {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

try {
    $db = (new Database())->getConnection();
    $currentUser = requireAuth($db);

    $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;
    $id = !empty($input['id']) ? (int)$input['id'] : null;

    if (!$id) {
        sendApiResponse(false, "Post ID is required for update", null, 400);
    }

    // Check post existence
    $checkStmt = $db->prepare("SELECT * FROM posts WHERE id = :id LIMIT 1");
    $checkStmt->execute([':id' => $id]);
    $existingPost = $checkStmt->fetch();

    if (!$existingPost) {
        sendApiResponse(false, "Post not found with ID {$id}", null, 404);
    }

    // Create revision snapshot before modifying
    $revStmt = $db->prepare("INSERT INTO post_revisions (post_id, title, content, excerpt, created_by) VALUES (:post_id, :title, :content, :excerpt, :created_by)");
    $revStmt->execute([
        ':post_id' => $id,
        ':title' => $existingPost['title'],
        ':content' => $existingPost['content'],
        ':excerpt' => $existingPost['excerpt'],
        ':created_by' => $currentUser['id']
    ]);

    // Prepare fields for update
    $title = !empty($input['title']) ? trim($input['title']) : $existingPost['title'];
    $content = !empty($input['content']) ? trim($input['content']) : $existingPost['content'];
    $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : $existingPost['slug'];
    $excerpt = isset($input['excerpt']) ? trim($input['excerpt']) : $existingPost['excerpt'];
    $coverImage = $input['cover_image'] ?? $existingPost['cover_image'];
    $categoryId = !empty($input['category_id']) ? (int)$input['category_id'] : $existingPost['category_id'];
    $status = in_array($input['status'] ?? '', ['draft', 'published', 'scheduled', 'archived']) ? $input['status'] : $existingPost['status'];
    $isFeatured = isset($input['is_featured']) ? (!empty($input['is_featured']) ? 1 : 0) : $existingPost['is_featured'];

    // SEO Metadata
    $metaTitle = $input['meta_title'] ?? $existingPost['meta_title'];
    $metaDescription = $input['meta_description'] ?? $existingPost['meta_description'];
    $canonicalUrl = $input['canonical_url'] ?? $existingPost['canonical_url'];
    $focusKeyword = $input['focus_keyword'] ?? $existingPost['focus_keyword'];
    $ogImage = $input['og_image'] ?? $existingPost['og_image'];
    $schemaJson = isset($input['schema_json']) ? json_encode($input['schema_json']) : $existingPost['schema_json'];

    $publishedAt = $existingPost['published_at'];
    if ($status === 'published' && !$publishedAt) {
        $publishedAt = date('Y-m-d H:i:s');
    } else if (!empty($input['published_at'])) {
        $publishedAt = $input['published_at'];
    }

    $sql = "UPDATE posts SET
                title = :title,
                slug = :slug,
                excerpt = :excerpt,
                content = :content,
                cover_image = :cover_image,
                category_id = :category_id,
                status = :status,
                is_featured = :is_featured,
                meta_title = :meta_title,
                meta_description = :meta_description,
                canonical_url = :canonical_url,
                focus_keyword = :focus_keyword,
                og_image = :og_image,
                schema_json = :schema_json,
                published_at = :published_at,
                updated_at = NOW()
            WHERE id = :id";

    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':title' => $title,
        ':slug' => $slug,
        ':excerpt' => $excerpt,
        ':content' => $content,
        ':cover_image' => $coverImage,
        ':category_id' => $categoryId,
        ':status' => $status,
        ':is_featured' => $isFeatured,
        ':meta_title' => $metaTitle,
        ':meta_description' => $metaDescription,
        ':canonical_url' => $canonicalUrl,
        ':focus_keyword' => $focusKeyword,
        ':og_image' => $ogImage,
        ':schema_json' => $schemaJson,
        ':published_at' => $publishedAt,
        ':id' => $id
    ]);

    LoggerHelper::logAudit($db, $currentUser['id'], 'POST_UPDATE', 'POST', $id, ['title' => $title, 'status' => $status]);

    // Re-sync tags if array is provided
    if (isset($input['tags']) && is_array($input['tags'])) {
        $db->prepare("DELETE FROM post_tags WHERE post_id = :post_id")->execute([':post_id' => $id]);
        foreach ($input['tags'] as $tagName) {
            $tagName = trim($tagName);
            if (empty($tagName)) continue;

            $tagSlug = SecurityHelper::createSlug($tagName);
            $tagStmt = $db->prepare("INSERT INTO tags (name, slug) VALUES (:name, :slug) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)");
            $tagStmt->execute([':name' => $tagName, ':slug' => $tagSlug]);
            $tagId = (int)$db->lastInsertId();

            if ($tagId > 0) {
                $ptStmt = $db->prepare("INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (:post_id, :tag_id)");
                $ptStmt->execute([':post_id' => $id, ':tag_id' => $tagId]);
            }
        }
    }

    sendApiResponse(true, "Post updated successfully", [
        'id' => $id,
        'title' => $title,
        'status' => $status
    ]);

} catch (Exception $e) {
    sendApiResponse(false, "Failed to update post: " . $e->getMessage(), null, 500);
}
