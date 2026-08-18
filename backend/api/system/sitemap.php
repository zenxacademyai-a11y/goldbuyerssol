<?php
/**
 * Dynamic XML & JSON Sitemap Generator
 * GET /api/system/sitemap.php?format=xml or ?format=json
 * Generates SEO-compliant sitemap index and URL nodes for Google, Bing, and search crawlers
 */

declare(strict_types=1);

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

$format = $_GET['format'] ?? 'xml';
$baseUrl = rtrim($_GET['base_url'] ?? 'https://www.goldlanka.lk', '/');

try {
    $db = (new Database())->getConnection();

    // Fetch all published posts
    $stmt = $db->prepare("
        SELECT slug, updated_at, created_at, cover_image 
        FROM posts 
        WHERE status = 'published' AND deleted_at IS NULL 
        ORDER BY updated_at DESC
    ");
    $stmt->execute();
    $posts = $stmt->fetchAll();

    // Fetch categories
    $catStmt = $db->prepare("SELECT slug, updated_at FROM categories ORDER BY id ASC");
    $catStmt->execute();
    $categories = $catStmt->fetchAll();

    if ($format === 'json') {
        sendCorsHeaders();
        sendApiResponse(true, "Sitemap data generated", [
            'base_url' => $baseUrl,
            'total_urls' => count($posts) + count($categories) + 4,
            'static_routes' => [
                ['url' => $baseUrl . '/', 'changefreq' => 'daily', 'priority' => 1.0],
                ['url' => $baseUrl . '/rates', 'changefreq' => 'hourly', 'priority' => 0.9],
                ['url' => $baseUrl . '/calculator', 'changefreq' => 'daily', 'priority' => 0.9],
                ['url' => $baseUrl . '/blog', 'changefreq' => 'daily', 'priority' => 0.8],
            ],
            'posts' => array_map(function($p) use ($baseUrl) {
                return [
                    'url' => $baseUrl . '/blog/' . $p['slug'],
                    'lastmod' => date('Y-m-d', strtotime($p['updated_at'] ?? $p['created_at'])),
                    'changefreq' => 'weekly',
                    'priority' => 0.8,
                    'image' => $p['cover_image'] ?? null
                ];
            }, $posts),
            'categories' => array_map(function($c) use ($baseUrl) {
                return [
                    'url' => $baseUrl . '/blog/category/' . $c['slug'],
                    'lastmod' => date('Y-m-d', strtotime($c['updated_at'] ?? 'now')),
                    'changefreq' => 'weekly',
                    'priority' => 0.6
                ];
            }, $categories)
        ]);
        exit;
    }

    // Default: Output Standard XML Sitemap
    header("Content-Type: application/xml; charset=UTF-8");
    header("X-Robots-Tag: noindex, follow");

    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";

    // 1. Core Static Pages
    $staticUrls = [
        ['loc' => $baseUrl . '/', 'freq' => 'daily', 'priority' => '1.0'],
        ['loc' => $baseUrl . '/rates', 'freq' => 'hourly', 'priority' => '0.9'],
        ['loc' => $baseUrl . '/calculator', 'freq' => 'daily', 'priority' => '0.9'],
        ['loc' => $baseUrl . '/branches', 'freq' => 'weekly', 'priority' => '0.8'],
        ['loc' => $baseUrl . '/blog', 'freq' => 'daily', 'priority' => '0.8'],
        ['loc' => $baseUrl . '/about', 'freq' => 'monthly', 'priority' => '0.7'],
        ['loc' => $baseUrl . '/contact', 'freq' => 'monthly', 'priority' => '0.7']
    ];

    foreach ($staticUrls as $s) {
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars($s['loc']) . "</loc>\n";
        echo "    <changefreq>" . $s['freq'] . "</changefreq>\n";
        echo "    <priority>" . $s['priority'] . "</priority>\n";
        echo "  </url>\n";
    }

    // 2. Published Blog Posts
    foreach ($posts as $post) {
        $postUrl = $baseUrl . '/blog/' . $post['slug'];
        $lastmod = date('Y-m-d', strtotime($post['updated_at'] ?? $post['created_at']));
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars($postUrl) . "</loc>\n";
        echo "    <lastmod>" . $lastmod . "</lastmod>\n";
        echo "    <changefreq>weekly</changefreq>\n";
        echo "    <priority>0.8</priority>\n";
        if (!empty($post['cover_image'])) {
            echo "    <image:image>\n";
            echo "      <image:loc>" . htmlspecialchars($post['cover_image']) . "</image:loc>\n";
            echo "    </image:image>\n";
        }
        echo "  </url>\n";
    }

    // 3. Categories
    foreach ($categories as $cat) {
        $catUrl = $baseUrl . '/blog/category/' . $cat['slug'];
        $lastmod = date('Y-m-d', strtotime($cat['updated_at'] ?? 'now'));
        echo "  <url>\n";
        echo "    <loc>" . htmlspecialchars($catUrl) . "</loc>\n";
        echo "    <lastmod>" . $lastmod . "</lastmod>\n";
        echo "    <changefreq>weekly</changefreq>\n";
        echo "    <priority>0.6</priority>\n";
        echo "  </url>\n";
    }

    echo '</urlset>';
    exit;

} catch (Exception $e) {
    header("Content-Type: text/plain; charset=UTF-8", true, 500);
    echo "Error generating sitemap: " . $e->getMessage();
    exit;
}
