<?php
/**
 * CORS & REST Headers Handler
 * Enforces JSON response content-type and strict origin security headers
 */

declare(strict_types=1);

function sendCorsHeaders(): void {
    // Allow origins (In production, replace * with your domain, e.g., https://www.goldlanka.lk)
    $allowed_origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    
    header("Access-Control-Allow-Origin: " . $allowed_origin);
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, X-Webhook-Secret");
    header("X-Content-Type-Options: nosniff");
    header("X-Frame-Options: SAMEORIGIN");
    header("X-XSS-Protection: 1; mode=block");

    // Handle preflight OPTIONS request instantly
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}
