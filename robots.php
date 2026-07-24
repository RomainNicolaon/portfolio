<?php

declare(strict_types=1);

require __DIR__ . '/lib/data.php';

$profile = load_json('profile.json');
$base    = site_url($profile);

header('Content-Type: text/plain; charset=UTF-8');

echo "User-agent: *\n";
echo "Allow: /\n";
echo "\n";
echo "Sitemap: {$base}/sitemap.xml\n";
