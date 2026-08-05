<?php
/**
 * Consistent REST API Response Helper
 */

declare(strict_types=1);

function sendApiResponse(bool $success, string $message, mixed $data = null, int $statusCode = 200, ?array $errorDetails = null): void {
    http_response_code($statusCode);
    
    $response = [
        'success' => $success,
        'message' => $message,
        'timestamp' => date('Y-m-d\TH:i:s\Z')
    ];

    if ($data !== null) {
        $response['data'] = $data;
    }

    if ($errorDetails !== null) {
        $response['error'] = $errorDetails;
    }

    echo json_encode($response, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}
