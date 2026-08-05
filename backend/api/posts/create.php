<?php
/**
 * POST /api/posts/create.php
 * Create a new blog post with title, content, SEO metadata, status, schedule date, category, and tags
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/security.php';
require_once __DIR__ . '/../../helpers/logger.php';
require_once __DIR__ . '/../../middleware/auth.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

try {
    $db = (new Database())->getConnection();
    $currentUser = requireAuth($db);

    $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;

    $title = trim($input['title'] ?? '');
    $content = trim($input['content'] ?? '');

    if (empty($title)) {
        sendApiResponse(false, "Title is required", null, 400, ['field' => 'title']);
    }

    if (empty($content)) {
        sendApiResponse(false, "Article content is required", null, 400, ['field' => 'content']);
    }

    // Slug generation or override
    $slug = !empty($input['slug']) ? SecurityHelper::createSlug($input['slug']) : SecurityHelper::createSlug($title);
    
    // Check slug uniqueness
    $checkSlug = $db->prepare("SELECT id FROM posts WHERE slug = :slug LIMIT 1");
    $checkSlug->execute([':slug' => $slug]);
    if ($checkSlug->fetch()) {
        $slug .= '-' . time();
    }

    $uuid = SecurityHelper::generateUuid();
    $excerpt = !empty($input['excerpt']) ? trim($input['excerpt']) : substr(strip_tags($content), 0, 180) . '...';
    $coverImage = $input['cover_image'] ?? null;
    $categoryId = !empty($input['category_id']) ? (int)$input['category_id'] : 1;
    $status = in_array($input['status'] ?? 'draft', ['draft', 'published', 'scheduled', 'archived']) ? $input['status'] : 'draft';
    $visibility = $input['visibility'] ?? 'public';
    $isFeatured = !empty($input['is_featured']) ? 1 : 0;

    // SEO Metadata
    $metaTitle = !empty($input['meta_title']) ? trim($input['meta_title']) : $title;
    $metaDescription = !empty($input['meta_description']) ? trim($input['meta_description']) : $excerpt;
    $canonicalUrl = $input['canonical_url'] ?? null;
    $focusKeyword = $input['focus_keyword'] ?? null;
    $ogImage = $input['og_image'] ?? $coverImage;
    $schemaType = $input['schema_type'] ?? 'Article';
    $schemaJson = !empty($input['schema_json']) ? json_encode($input['schema_json']) : null;

    // Published timestamp
    $publishedAt = null;
    if ($status === 'published') {
        $publishedAt = !empty($input['published_at']) ? $input['published_at'] : date('Y-m-d H:i:s');
    } else if ($status === 'scheduled' && !empty($input['published_at'])) {
        $publishedAt = $input['published_at'];
    }

    // Insert into MySQL posts table using prepared statement
    $sql = "INSERT INTO posts (
                post_uuid, title, slug, excerpt, content, cover_image, author_id, category_id,
                status, visibility, is_featured, meta_title, meta_description, canonical_url,
                focus_keyword, og_image, schema_type, schema_json, published_at, created_at, updated_at
            ) VALUES (
                :uuid, :title, :slug, :excerpt, :content, :cover_image, :author_id, :category_id,
                :status, :visibility, :is_featured, :meta_title, :meta_description, :canonical_url,
                :focus_keyword, :og_image, :schema_type, :schema_json, :published_at, NOW(), NOW()
            )";

    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':uuid' => $uuid,
        ':title' => $title,
        ':slug' => $slug,
        ':excerpt' => $excerpt,
        ':content' => $content,
        ':cover_image' => $coverImage,
        ':author_id' => $currentUser['id'],
        ':category_id' => $categoryId,
        ':status' => $status,
        ':visibility' => $visibility,
        ':is_featured' => $isFeatured,
        ':meta_title' => $metaTitle,
        ':meta_description' => $metaDescription,
        ':canonical_url' => $canonicalUrl,
        ':focus_keyword' => $focusKeyword,
        ':og_image' => $ogImage,
        ':schema_type' => $schemaType,
        ':schema_json' => $schemaJson,
        ':published_at' => $publishedAt
    ]);

    $postId = (int)$db->lastInsertId();

    LoggerHelper::logAudit($db, $currentUser['id'], 'POST_CREATE', 'POST', $postId, ['title' => $title, 'status' => $status]);

    // Attach tags if supplied
    if (!empty($input['tags']) && is_array($input['tags'])) {
        foreach ($input['tags'] as $tagName) {
            $tagName = trim($tagName);
            if (empty($tagName)) continue;

            $tagSlug = SecurityHelper::createSlug($tagName);
            
            // Insert tag if not existing
            $tagStmt = $db->prepare("INSERT INTO tags (name, slug) VALUES (:name, :slug) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)");
            $tagStmt->execute([':name' => $tagName, ':slug' => $tagSlug]);
            $tagId = (int)$db->lastInsertId();

            if ($tagId > 0) {
                $ptStmt = $db->prepare("INSERT IGNORE INTO post_tags (post_id, tag_id) VALUES (:post_id, :tag_id)");
                $ptStmt->execute([':post_id' => $postId, ':tag_id' => $tagId]);
            }
        }
    }

    sendApiResponse(true, "Blog post created successfully", [
        'post_id' => $postId,
        'post_uuid' => $uuid,
        'slug' => $slug,
        'status' => $status
    ], 201);

} catch (Exception $e) {
    sendApiResponse(false, "Failed to create blog post: " . $e->getMessage(), null, 500);
}
