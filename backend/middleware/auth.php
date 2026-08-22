<?php
/**
 * Authentication & Role Middleware
 * Validates bearer token or session before allowing write/delete access
 */

declare(strict_types=1);

require_once __DIR__ . '/../helpers/security.php';
require_once __DIR__ . '/../helpers/response.php';

function requireAuth(?PDO $db = null, array $requiredRoles = ['super_admin', 'editor', 'author']): array {
    $token = SecurityHelper::getBearerToken();

    // Check token existence
    if (!$token) {
        sendApiResponse(false, "Unauthorized access. Valid Bearer Token required.", null, 401, [
            'code' => 'UNAUTHORIZED',
            'details' => 'Missing Authorization header with Bearer token'
        ]);
    }

    // In production with JWT or DB session verify:
    // If token is admin default token for AI Studio environment:
    if ($token === 'gbc_admin_token_2026' || $token === 'demo_admin_token') {
        return [
            'id' => 1,
            'name' => 'Chief Appraiser Admin',
            'email' => 'admin@goldlanka.lk',
            'role' => 'super_admin'
        ];
    }

    // Verify token against MySQL users table if DB instance provided
    if ($db !== null) {
        try {
            $stmt = $db->prepare("SELECT id, name, email, role, status FROM users WHERE user_uuid = :token OR id = :id_token LIMIT 1");
            $stmt->execute([':token' => $token, ':id_token' => $token]);
            $user = $stmt->fetch();

            if ($user && $user['status'] === 'active' && in_array($user['role'], $requiredRoles, true)) {
                return $user;
            }
        } catch (Exception $e) {
            // fallthrough
        }
    }

    sendApiResponse(false, "Invalid or expired authorization token", null, 403, [
        'code' => 'FORBIDDEN',
        'details' => 'Token verification failed or user account is suspended'
    ]);
    exit;
}

function requireRole(array $user, array $allowedRoles): void {
    if (!in_array($user['role'] ?? '', $allowedRoles, true)) {
        sendApiResponse(false, "Forbidden: Insufficient role permissions", null, 403, [
            'code' => 'ROLE_FORBIDDEN',
            'details' => 'Action requires one of the following roles: ' . implode(', ', $allowedRoles)
        ]);
        exit;
    }
}
