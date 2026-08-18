<?php
/**
 * GET /api/auth/me.php
 * Returns current authenticated user profile, permissions, and session status
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/security.php';
require_once __DIR__ . '/../../middleware/auth.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

try {
    $db = (new Database())->getConnection();
    $currentUser = requireAuth($db, ['super_admin', 'editor', 'author', 'contributor']);

    sendApiResponse(true, "User profile authenticated", [
        'user' => [
            'id' => $currentUser['id'],
            'name' => $currentUser['name'],
            'email' => $currentUser['email'],
            'role' => $currentUser['role'],
            'avatar' => $currentUser['avatar'] ?? null,
            'bio' => $currentUser['bio'] ?? null
        ],
        'permissions' => [
            'can_publish' => in_array($currentUser['role'], ['super_admin', 'editor']),
            'can_delete' => in_array($currentUser['role'], ['super_admin', 'editor']),
            'can_manage_users' => ($currentUser['role'] === 'super_admin'),
            'can_upload_media' => true
        ]
    ]);

} catch (Exception $e) {
    sendApiResponse(false, "Authentication check failed: " . $e->getMessage(), null, 401);
}
