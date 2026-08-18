<?php
/**
 * REST API: Comments Management
 * GET    /api/comments/index.php (List comments, optionally filter by post_id or status)
 * POST   /api/comments/index.php (Submit new comment)
 * PUT    /api/comments/index.php (Update comment status: approved/pending/spam/trash)
 * DELETE /api/comments/index.php (Delete comment)
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
        $postId = isset($_GET['post_id']) ? (int)$_GET['post_id'] : null;
        $status = $_GET['status'] ?? null;

        if ($postId) {
            $stmt = $db->prepare("
                SELECT c.*, p.title as post_title 
                FROM comments c 
                JOIN posts p ON c.post_id = p.id 
                WHERE c.post_id = :post_id AND (c.status = 'approved' OR :is_admin = 1)
                ORDER BY c.created_at DESC
            ");
            $isAdmin = 0;
            $token = extractBearerToken();
            if ($token && SecurityHelper::validateSessionToken($token)) {
                $isAdmin = 1;
            }
            $stmt->execute([':post_id' => $postId, ':is_admin' => $isAdmin]);
        } else {
            // Admin list all comments
            $stmt = $db->prepare("
                SELECT c.*, p.title as post_title, p.slug as post_slug 
                FROM comments c 
                LEFT JOIN posts p ON c.post_id = p.id 
                " . ($status ? "WHERE c.status = :status" : "") . "
                ORDER BY c.created_at DESC
            ");
            if ($status) {
                $stmt->execute([':status' => $status]);
            } else {
                $stmt->execute();
            }
        }

        $comments = $stmt->fetchAll();
        sendApiResponse(true, "Comments fetched successfully", ['comments' => $comments]);

    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;
        
        $postId = (int)($input['post_id'] ?? 0);
        $name = SecurityHelper::sanitizeString($input['author_name'] ?? '');
        $email = filter_var($input['author_email'] ?? '', FILTER_VALIDATE_EMAIL);
        $content = SecurityHelper::sanitizeString($input['content'] ?? '');

        if (!$postId || empty($name) || !$email || empty($content)) {
            sendApiResponse(false, "Post ID, valid Name, Email, and Comment Content are required", null, 400);
        }

        // Check if post exists
        $pStmt = $db->prepare("SELECT id FROM posts WHERE id = :id AND deleted_at IS NULL");
        $pStmt->execute([':id' => $postId]);
        if (!$pStmt->fetch()) {
            sendApiResponse(false, "Post not found", null, 404);
        }

        $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        $status = 'approved'; // default approved, or pending

        $stmt = $db->prepare("
            INSERT INTO comments (post_id, author_name, author_email, content, status, ip_address, created_at)
            VALUES (:post_id, :author_name, :author_email, :content, :status, :ip_address, NOW())
        ");
        $stmt->execute([
            ':post_id' => $postId,
            ':author_name' => $name,
            ':author_email' => $email,
            ':content' => $content,
            ':status' => $status,
            ':ip_address' => $ip
        ]);

        sendApiResponse(true, "Comment posted successfully", [
            'id' => $db->lastInsertId(),
            'post_id' => $postId,
            'author_name' => $name,
            'content' => $content,
            'status' => $status
        ], 201);

    } elseif ($method === 'PUT') {
        requireAuth($db, ['super_admin', 'editor']);
        $input = json_decode(file_get_contents("php://input"), true) ?? [];
        $id = (int)($input['id'] ?? 0);
        $status = $input['status'] ?? 'approved';

        if (!$id || !in_array($status, ['approved', 'pending', 'spam', 'trash'])) {
            sendApiResponse(false, "Valid Comment ID and Status required", null, 400);
        }

        $stmt = $db->prepare("UPDATE comments SET status = :status, updated_at = NOW() WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        sendApiResponse(true, "Comment status updated to {$status}", ['id' => $id, 'status' => $status]);

    } elseif ($method === 'DELETE') {
        requireAuth($db, ['super_admin', 'editor']);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            $input = json_decode(file_get_contents("php://input"), true) ?? [];
            $id = (int)($input['id'] ?? 0);
        }

        if (!$id) {
            sendApiResponse(false, "Comment ID is required", null, 400);
        }

        $stmt = $db->prepare("DELETE FROM comments WHERE id = :id");
        $stmt->execute([':id' => $id]);

        sendApiResponse(true, "Comment deleted permanently", ['id' => $id]);

    } else {
        sendApiResponse(false, "Method Not Allowed", null, 405);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Comments API Error: " . $e->getMessage(), null, 500);
}
