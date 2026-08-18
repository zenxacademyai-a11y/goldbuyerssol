<?php
/**
 * REST API: User & Team Management
 * GET    /api/users/index.php (List users)
 * POST   /api/users/index.php (Create new user)
 * PUT    /api/users/index.php (Update user details / role / password)
 * DELETE /api/users/index.php (Delete or suspend user)
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
    $currentUser = requireAuth($db);
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $db->query("
            SELECT u.id, u.user_uuid, u.name, u.email, u.role, u.avatar, u.bio, u.status, u.last_login_at, u.created_at,
                   COUNT(p.id) as post_count
            FROM users u
            LEFT JOIN posts p ON u.id = p.author_id AND p.deleted_at IS NULL
            GROUP BY u.id
            ORDER BY u.id ASC
        ");
        $users = $stmt->fetchAll();
        sendApiResponse(true, "Users list retrieved", ['users' => $users]);

    } elseif ($method === 'POST') {
        requireRole($currentUser, ['super_admin']);
        $input = json_decode(file_get_contents("php://input"), true) ?? $_POST;

        $name = SecurityHelper::sanitizeString($input['name'] ?? '');
        $email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $input['password'] ?? '';
        $role = $input['role'] ?? 'author';
        $bio = SecurityHelper::sanitizeString($input['bio'] ?? '');

        if (empty($name) || !$email || strlen($password) < 6) {
            sendApiResponse(false, "Name, valid Email, and Password (min 6 chars) are required", null, 400);
        }

        if (!in_array($role, ['super_admin', 'editor', 'author', 'contributor'])) {
            $role = 'author';
        }

        // Check duplicate email
        $check = $db->prepare("SELECT id FROM users WHERE email = :email");
        $check->execute([':email' => $email]);
        if ($check->fetch()) {
            sendApiResponse(false, "A user with this email address already exists", null, 409);
        }

        $passwordHash = SecurityHelper::hashPassword($password);
        $uuid = SecurityHelper::generateUuid();

        $stmt = $db->prepare("
            INSERT INTO users (user_uuid, name, email, password_hash, role, bio, status, created_at)
            VALUES (:uuid, :name, :email, :password_hash, :role, :bio, 'active', NOW())
        ");
        $stmt->execute([
            ':uuid' => $uuid,
            ':name' => $name,
            ':email' => $email,
            ':password_hash' => $passwordHash,
            ':role' => $role,
            ':bio' => $bio
        ]);

        $newId = (int)$db->lastInsertId();
        sendApiResponse(true, "User created successfully", [
            'id' => $newId,
            'user_uuid' => $uuid,
            'name' => $name,
            'email' => $email,
            'role' => $role
        ], 201);

    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true) ?? [];
        $id = (int)($input['id'] ?? 0);

        if (!$id) {
            sendApiResponse(false, "User ID is required", null, 400);
        }

        // Non-super-admins can only update their own profile and cannot change their role
        if ($currentUser['role'] !== 'super_admin' && (int)$currentUser['id'] !== $id) {
            sendApiResponse(false, "Unauthorized to modify other users", null, 403);
        }

        $name = SecurityHelper::sanitizeString($input['name'] ?? '');
        $bio = SecurityHelper::sanitizeString($input['bio'] ?? '');
        $avatar = $input['avatar'] ?? null;
        $role = $input['role'] ?? null;
        $password = $input['password'] ?? null;

        $updates = [];
        $params = [':id' => $id];

        if (!empty($name)) {
            $updates[] = "name = :name";
            $params[':name'] = $name;
        }
        if ($bio !== null) {
            $updates[] = "bio = :bio";
            $params[':bio'] = $bio;
        }
        if ($avatar !== null) {
            $updates[] = "avatar = :avatar";
            $params[':avatar'] = $avatar;
        }
        if ($currentUser['role'] === 'super_admin' && !empty($role) && in_array($role, ['super_admin', 'editor', 'author', 'contributor'])) {
            $updates[] = "role = :role";
            $params[':role'] = $role;
        }
        if (!empty($password) && strlen($password) >= 6) {
            $updates[] = "password_hash = :password_hash";
            $params[':password_hash'] = SecurityHelper::hashPassword($password);
        }

        if (empty($updates)) {
            sendApiResponse(false, "No fields to update", null, 400);
        }

        $sql = "UPDATE users SET " . implode(", ", $updates) . ", updated_at = NOW() WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        sendApiResponse(true, "User updated successfully", ['id' => $id]);

    } elseif ($method === 'DELETE') {
        requireRole($currentUser, ['super_admin']);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) {
            $input = json_decode(file_get_contents("php://input"), true) ?? [];
            $id = (int)($input['id'] ?? 0);
        }

        if (!$id) {
            sendApiResponse(false, "User ID is required", null, 400);
        }

        if ((int)$currentUser['id'] === $id) {
            sendApiResponse(false, "Super Administrator cannot delete own account", null, 400);
        }

        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute([':id' => $id]);

        sendApiResponse(true, "User removed successfully", ['id' => $id]);

    } else {
        sendApiResponse(false, "Method Not Allowed", null, 405);
    }

} catch (Exception $e) {
    sendApiResponse(false, "Users API Error: " . $e->getMessage(), null, 500);
}
