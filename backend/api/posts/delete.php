<?php
/**
 * DELETE /api/posts/delete.php
 * Handle Soft Delete (Trash), Restore, or Force Delete
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/logger.php';
require_once __DIR__ . '/../../middleware/auth.php';

sendCorsHeaders();

if (!in_array($_SERVER['REQUEST_METHOD'], ['DELETE', 'POST'], true)) {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

try {
    $db = (new Database())->getConnection();
    $currentUser = requireAuth($db);

    $input = json_decode(file_get_contents("php://input"), true) ?? $_REQUEST;
    $id = !empty($input['id']) ? (int)$input['id'] : null;
    $action = $input['action'] ?? 'soft_delete'; // 'soft_delete', 'restore', 'force_delete'

    if (!$id) {
        sendApiResponse(false, "Post ID is required", null, 400);
    }

    if ($action === 'restore') {
        // Restore soft-deleted post
        $stmt = $db->prepare("UPDATE posts SET deleted_at = NULL WHERE id = :id");
        $stmt->execute([':id' => $id]);
        LoggerHelper::logAudit($db, $currentUser['id'], 'POST_RESTORE', 'POST', $id, ['action' => 'restore']);
        sendApiResponse(true, "Post restored from Trash", ['id' => $id]);

    } else if ($action === 'force_delete') {
        // Permanently delete post from database
        $stmt = $db->prepare("DELETE FROM posts WHERE id = :id");
        $stmt->execute([':id' => $id]);
        LoggerHelper::logAudit($db, $currentUser['id'], 'POST_FORCE_DELETE', 'POST', $id, ['action' => 'force_delete']);
        sendApiResponse(true, "Post permanently deleted from database", ['id' => $id]);

    } else {
        // Soft delete (Move to Trash)
        $stmt = $db->prepare("UPDATE posts SET deleted_at = NOW() WHERE id = :id");
        $stmt->execute([':id' => $id]);
        LoggerHelper::logAudit($db, $currentUser['id'], 'POST_TRASH', 'POST', $id, ['action' => 'soft_delete']);
        sendApiResponse(true, "Post moved to Trash bin", ['id' => $id]);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Failed to process post deletion: " . $e->getMessage(), null, 500);
}
