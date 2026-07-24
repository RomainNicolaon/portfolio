<?php

declare(strict_types=1);

require __DIR__ . '/lib/data.php';

$profile = load_json('profile.json');
$base    = site_url($profile);
$lastmod = date('Y-m-d');

header('Content-Type: application/xml; charset=UTF-8');

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc><?= e($base) ?>/</loc>
        <lastmod><?= e($lastmod) ?></lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>
