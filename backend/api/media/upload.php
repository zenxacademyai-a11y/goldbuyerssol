<?php
/**
 * POST /api/media/upload.php
 * Handles image file uploads, performs image compression & thumbnail generation
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/security.php';
require_once __DIR__ . '/../../helpers/upload.php';
require_once __DIR__ . '/../../middleware/auth.php';

sendCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendApiResponse(false, "Method Not Allowed", null, 405);
}

try {
    $db = (new Database())->getConnection();
    $currentUser = requireAuth($db);

    if (empty($_FILES['image'])) {
        sendApiResponse(false, "No image file uploaded in 'image' payload key", null, 400);
    }

    $altText = $_POST['alt_text'] ?? null;
    $uploader = new UploadHelper();
    $fileResult = $uploader->handleFileUpload($_FILES['image'], $altText);

    // Save record to MySQL media table
    $stmt = $db->prepare("INSERT INTO media (
        file_name, original_name, file_path, mime_type, file_size, compressed_size, width, height, alt_text, created_by, created_at
    ) VALUES (
        :file_name, :original_name, :file_path, :mime_type, :file_size, :compressed_size, :width, :height, :alt_text, :created_by, NOW()
    )");

    $stmt->execute([
        ':file_name' => $fileResult['file_name'],
        ':original_name' => $fileResult['original_name'],
        ':file_path' => $fileResult['file_path'],
        ':mime_type' => $fileResult['mime_type'],
        ':file_size' => $fileResult['file_size'],
        ':compressed_size' => $fileResult['compressed_size'],
        ':width' => $fileResult['width'],
        ':height' => $fileResult['height'],
        ':alt_text' => $fileResult['alt_text'],
        ':created_by' => $currentUser['id']
    ]);

    $mediaId = (int)$db->lastInsertId();

    sendApiResponse(true, "Image uploaded and compressed successfully", [
        'media_id' => $mediaId,
        'url' => $fileResult['file_path'],
        'original_size_kb' => round($fileResult['file_size'] / 1024, 2),
        'compressed_size_kb' => round($fileResult['compressed_size'] / 1024, 2),
        'savings_percentage' => $fileResult['file_size'] > 0 ? round((1 - ($fileResult['compressed_size'] / $fileResult['file_size'])) * 100, 1) . '%' : '0%',
        'dimensions' => $fileResult['width'] . 'x' . $fileResult['height']
    ], 201);

} catch (Exception $e) {
    sendApiResponse(false, "Image upload failed: " . $e->getMessage(), null, 500);
}
