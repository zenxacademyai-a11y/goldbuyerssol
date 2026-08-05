<?php
/**
 * DELETE /api/media/delete.php
 * Delete single or bulk media files by ID(s)
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
    
    $ids = [];
    if (!empty($input['id'])) {
        $ids[] = (int)$input['id'];
    } elseif (!empty($input['ids']) && is_array($input['ids'])) {
        $ids = array_map('intval', $input['ids']);
    }

    if (empty($ids)) {
        sendApiResponse(false, "At least one media ID is required for deletion", null, 400);
    }

    $inPlaceholders = implode(',', array_fill(0, count($ids), '?'));
    
    // Fetch file paths to unlink local assets
    $stmt = $db->prepare("SELECT id, file_name, file_path FROM media WHERE id IN ($inPlaceholders)");
    $stmt->execute($ids);
    $mediaFiles = $stmt->fetchAll();

    $deletedCount = 0;
    foreach ($mediaFiles as $mediaItem) {
        // Attempt physical file removal if located inside uploads dir
        if (!empty($mediaItem['file_path']) && str_contains($mediaItem['file_path'], '/uploads/')) {
            $relativePath = ltrim(parse_url($mediaItem['file_path'], PHP_URL_PATH), '/');
            $fullDiskPath = __DIR__ . '/../../' . $relativePath;
            if (file_exists($fullDiskPath)) {
                @unlink($fullDiskPath);
            }
        }
    }

    // Delete records from database
    $deleteStmt = $db->prepare("DELETE FROM media WHERE id IN ($inPlaceholders)");
    $deleteStmt->execute($ids);
    $deletedCount = $deleteStmt->rowCount();

    // Log audit event
    LoggerHelper::logAudit(
        $db,
        $currentUser['id'],
        'MEDIA_DELETE',
        'MEDIA',
        count($ids) === 1 ? $ids[0] : null,
        ['deleted_ids' => $ids, 'count' => $deletedCount]
    );

    sendApiResponse(true, "Successfully deleted {$deletedCount} media file(s)", [
        'deleted_ids' => $ids,
        'deleted_count' => $deletedCount
    ]);

} catch (Exception $e) {
    sendApiResponse(false, "Failed to delete media items: " . $e->getMessage(), null, 500);
}
