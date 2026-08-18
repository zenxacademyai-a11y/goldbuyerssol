<?php
/**
 * REST API: Admin Dashboard KPI & Analytics
 * GET /api/dashboard/stats.php
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
    requireAuth($db, ['super_admin', 'editor', 'author', 'contributor']);

    // Total and breakdown posts
    $postCounts = $db->query("
        SELECT 
            COUNT(*) as total_posts,
            SUM(CASE WHEN status = 'published' AND deleted_at IS NULL THEN 1 ELSE 0 END) as published_posts,
            SUM(CASE WHEN status = 'draft' AND deleted_at IS NULL THEN 1 ELSE 0 END) as draft_posts,
            SUM(CASE WHEN status = 'scheduled' AND deleted_at IS NULL THEN 1 ELSE 0 END) as scheduled_posts,
            SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) as trash_posts,
            SUM(COALESCE(views_count, 0)) as total_views
        FROM posts
    ")->fetch();

    // Categories count
    $catCount = (int)$db->query("SELECT COUNT(*) FROM categories")->fetchColumn();

    // Tags count
    $tagCount = (int)$db->query("SELECT COUNT(*) FROM tags")->fetchColumn();

    // Media count & total storage
    $mediaStats = $db->query("
        SELECT COUNT(*) as total_files, COALESCE(SUM(file_size), 0) as total_bytes 
        FROM media
    ")->fetch();

    // Comments count
    $commentStats = $db->query("
        SELECT 
            COUNT(*) as total_comments,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_comments,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_comments
        FROM comments
    ")->fetch();

    // Recent Posts (Last 5)
    $recentPosts = $db->query("
        SELECT p.id, p.title, p.slug, p.status, p.views_count, p.created_at, p.updated_at,
               u.name as author_name, c.name as category_name
        FROM posts p
        LEFT JOIN users u ON p.author_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.deleted_at IS NULL
        ORDER BY p.updated_at DESC
        LIMIT 5
    ")->fetchAll();

    // Recent Audit Logs (Last 5)
    $recentLogs = $db->query("
        SELECT a.id, a.action, a.entity_type, a.created_at, u.name as user_name
        FROM audit_logs a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 5
    ")->fetchAll();

    sendApiResponse(true, "Dashboard stats fetched successfully", [
        'stats' => [
            'total_posts' => (int)($postCounts['total_posts'] ?? 0),
            'published_posts' => (int)($postCounts['published_posts'] ?? 0),
            'draft_posts' => (int)($postCounts['draft_posts'] ?? 0),
            'scheduled_posts' => (int)($postCounts['scheduled_posts'] ?? 0),
            'trash_posts' => (int)($postCounts['trash_posts'] ?? 0),
            'total_views' => (int)($postCounts['total_views'] ?? 0),
            'total_categories' => $catCount,
            'total_tags' => $tagCount,
            'total_media_files' => (int)($mediaStats['total_files'] ?? 0),
            'total_media_bytes' => (int)($mediaStats['total_bytes'] ?? 0),
            'total_comments' => (int)($commentStats['total_comments'] ?? 0),
            'pending_comments' => (int)($commentStats['pending_comments'] ?? 0),
        ],
        'recent_posts' => $recentPosts,
        'recent_logs' => $recentLogs
    ]);

} catch (Exception $e) {
    sendApiResponse(false, "Dashboard Stats Error: " . $e->getMessage(), null, 500);
}
