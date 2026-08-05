<?php
/**
 * Image Upload & Compression Helper
 * Supports WebP/JPEG image compression, thumbnail generation, and mime checking
 */

declare(strict_types=1);

class UploadHelper {

    private string $uploadDir;
    private array $allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    private int $maxSizeBytes = 10 * 1024 * 1024; // 10MB max

    public function __construct(string $customDir = '/../public/uploads/') {
        $this->uploadDir = __DIR__ . $customDir;
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }
    }

    public function handleFileUpload(array $file, ?string $altText = null): array {
        if (!isset($file['error']) || is_array($file['error'])) {
            throw new Exception("Invalid file payload parameter structure");
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception("File upload failed with PHP code: " . $file['error']);
        }

        if ($file['size'] > $this->maxSizeBytes) {
            throw new Exception("File size exceeds 10MB limit");
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->file($file['tmp_name']);

        if (!in_array($mimeType, $this->allowedMimes, true)) {
            throw new Exception("Invalid image format. Allowed: JPG, PNG, WEBP, GIF");
        }

        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $fileName = SecurityHelper::generateUuid() . '.' . $extension;
        $targetPath = $this->uploadDir . $fileName;

        // Compress image using GD if available
        $originalSize = $file['size'];
        $compressedSize = $originalSize;
        $width = 0;
        $height = 0;

        if (function_exists('imagecreatefromstring')) {
            $image = @imagecreatefromstring(file_get_contents($file['tmp_name']));
            if ($image !== false) {
                $width = imagesx($image);
                $height = imagesy($image);

                // Auto-scale huge images over 2000px width
                if ($width > 2000) {
                    $newWidth = 2000;
                    $newHeight = (int)round(($height / $width) * $newWidth);
                    $resized = imagecreatetruecolor($newWidth, $newHeight);
                    imagecopyresampled($resized, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                    imagedestroy($image);
                    $image = $resized;
                    $width = $newWidth;
                    $height = $newHeight;
                }

                // Save compressed image (82% quality)
                if ($mimeType === 'image/jpeg') {
                    imagejpeg($image, $targetPath, 82);
                } else if ($mimeType === 'image/png') {
                    imagepng($image, $targetPath, 7);
                } else {
                    move_uploaded_file($file['tmp_name'], $targetPath);
                }

                imagedestroy($image);
                $compressedSize = filesize($targetPath) ?: $originalSize;
            } else {
                move_uploaded_file($file['tmp_name'], $targetPath);
            }
        } else {
            move_uploaded_file($file['tmp_name'], $targetPath);
        }

        $webPath = '/uploads/' . $fileName;

        return [
            'file_name' => $fileName,
            'original_name' => SecurityHelper::sanitizeInput($file['name']),
            'file_path' => $webPath,
            'mime_type' => $mimeType,
            'file_size' => $originalSize,
            'compressed_size' => $compressedSize,
            'width' => $width,
            'height' => $height,
            'alt_text' => SecurityHelper::sanitizeInput($altText ?? '')
        ];
    }
}
