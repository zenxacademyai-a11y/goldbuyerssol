<?php
/**
 * GET /api/posts/index.php
 * List blog posts with search, status filters (published, draft, scheduled, trash), categories, and pagination
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/security.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

try {
    $db = (new Database())->getConnection();

    // Query parameters
    $page = max(1, (int)($_GET['page'] ?? 1));
    $limit = min(100, max(1, (int)($_GET['limit'] ?? 10)));
    $offset = ($page - 1) * $limit;

    $status = $_GET['status'] ?? 'published';
    $categoryId = !empty($_GET['category_id']) ? (int)$_GET['category_id'] : null;
    $search = !empty($_GET['search']) ? trim($_GET['search']) : null;
    $includeTrash = ($status === 'trash' || $status === 'all_with_trash');

    // Build SQL query dynamically with prepared parameters
    $where = [];
    $params = [];

    if ($status === 'trash') {
        $where[] = "p.deleted_at IS NOT NULL";
    } else {
        $where[] = "p.deleted_at IS NULL";
        if ($status !== 'all') {
            $where[] = "p.status = :status";
            $params[':status'] = $status;
        }
    }

    if ($categoryId !== null) {
        $where[] = "p.category_id = :category_id";
        $params[':category_id'] = $categoryId;
    }

    if ($search !== null) {
        $where[] = "(p.title LIKE :search OR p.content LIKE :search OR p.excerpt LIKE :search)";
        $params[':search'] = '%' . $search . '%';
    }

    $whereClause = implode(' AND ', $where);

    // Count total rows
    $countSql = "SELECT COUNT(*) as total FROM posts p WHERE {$whereClause}";
    $countStmt = $db->prepare($countSql);
    $countStmt->execute($params);
    $totalRows = (int)$countStmt->fetch()['total'];

    // Select paginated records with author and category JOINs
    $sql = "SELECT 
                p.id, p.post_uuid, p.title, p.slug, p.excerpt, p.cover_image,
                p.status, p.visibility, p.is_featured, p.views_count,
                p.meta_title, p.meta_description, p.canonical_url, p.focus_keyword,
                p.published_at, p.created_at, p.updated_at, p.deleted_at,
                c.id as category_id, c.name as category_name, c.slug as category_slug,
                u.id as author_id, u.name as author_name, u.avatar as author_avatar
            FROM posts p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN users u ON p.author_id = u.id
            WHERE {$whereClause}
            ORDER BY p.created_at DESC
            LIMIT :limit OFFSET :offset";

    $stmt = $db->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $posts = $stmt->fetchAll();

    // Attach tags for each post
    foreach ($posts as &$post) {
        $tagStmt = $db->prepare("SELECT t.id, t.name, t.slug FROM tags t JOIN post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = :post_id");
        $tagStmt->execute([':post_id' => $post['id']]);
        $post['tags'] = $tagStmt->fetchAll();
    }

    $totalPages = (int)ceil($totalRows / $limit);

    sendApiResponse(true, "Posts fetched successfully", [
        'posts' => $posts,
        'pagination' => [
            'total_items' => $totalRows,
            'current_page' => $page,
            'limit' => $limit,
            'total_pages' => $totalPages,
            'has_next' => $page < $totalPages,
            'has_prev' => $page > 1
        ]
    ]);

} catch (Exception $e) {
    sendApiResponse(false, "Failed to fetch posts: " . $e->getMessage(), null, 500);
}
