<?php
// Données injectées par index.php (valeurs par défaut si inclus seul)
$profile     = $profile     ?? [];
$skills      = $skills      ?? [];
$education   = $education    ?? [];
$experiences = $experiences ?? [];
$faq         = $faq         ?? [];

// --- Préparation des métadonnées SEO ---
$seoName        = $profile['name'] ?? 'Portfolio';
$seoTitle       = trim($seoName . ($profile['title'] ?? '' ? ' — ' . $profile['title'] : ''));
$seoDescription = $profile['about'][0] ?? ($profile['taglines'][0] ?? 'Portfolio');
$seoUrl         = current_url($profile);
$seoBase        = site_url($profile);
$seoImage       = $seoBase . '/assets/og-image.png';
$seoLocale      = 'fr_FR';

// Réseaux sociaux -> sameAs
$sameAs = array_values(array_filter(array_map(
    static fn($s) => $s['url'] ?? null,
    $profile['socials'] ?? []
)));

// Compétences -> knowsAbout
$knowsAbout = [];
foreach (($skills ?? []) as $group) {
    foreach (($group['items'] ?? []) as $item) {
        $knowsAbout[] = $item;
    }
}

// Formations -> alumniOf
$alumniOf = [];
foreach (($education ?? []) as $edu) {
    if (!empty($edu['school'])) {
        $alumniOf[] = ['@type' => 'EducationalOrganization', 'name' => $edu['school']];
    }
}

// Expérience actuelle -> worksFor
$worksFor = null;
foreach (($experiences ?? []) as $exp) {
    if (!empty($exp['company'])) {
        $worksFor = array_filter([
            '@type'  => 'Organization',
            'name'   => $exp['company'],
            'url'    => $exp['url'] ?? null,
            'sameAs' => !empty($exp['url']) ? [$exp['url']] : null,
        ], static fn($v) => $v !== null && $v !== []);
        break;
    }
}

// Localisation -> address
$address = null;
if (!empty($profile['location'])) {
    $parts   = array_map('trim', explode(',', $profile['location']));
    $address = array_filter([
        '@type'           => 'PostalAddress',
        'addressLocality' => $parts[0] ?? null,
        'addressCountry'  => $parts[1] ?? null,
    ]);
}

// FAQ -> FAQPage
$faqEntities = [];
foreach (($faq ?? []) as $item) {
    if (!empty($item['question']) && !empty($item['answer'])) {
        $faqEntities[] = [
            '@type'          => 'Question',
            'name'           => $item['question'],
            'acceptedAnswer' => [
                '@type' => 'Answer',
                'text'  => $item['answer'],
            ],
        ];
    }
}

// Graphe de données structurées Schema.org
$organization = array_filter([
    '@type'  => 'Organization',
    '@id'    => $seoBase . '/#organization',
    'name'   => $seoName,
    'url'    => $seoBase . '/',
    'logo'   => $seoImage,
    'image'  => $seoImage,
    'founder' => ['@id' => $seoBase . '/#person'],
    'sameAs' => $sameAs ?: null,
], static fn($v) => $v !== null && $v !== []);

$person = array_filter([
    '@type'       => 'Person',
    '@id'         => $seoBase . '/#person',
    'name'        => $seoName,
    'url'         => $seoBase . '/',
    'jobTitle'    => $profile['title'] ?? null,
    'description' => $profile['about'][0] ?? null,
    'email'       => !empty($profile['email']) ? 'mailto:' . $profile['email'] : null,
    'image'       => $seoImage,
    'address'     => $address ?: null,
    'worksFor'    => $worksFor ?: null,
    'alumniOf'    => $alumniOf ?: null,
    'knowsAbout'  => $knowsAbout ?: null,
    'sameAs'      => $sameAs ?: null,
], static fn($v) => $v !== null && $v !== []);

$structuredData = [
    '@context' => 'https://schema.org',
    '@graph'   => [
        [
            '@type'           => 'WebSite',
            '@id'             => $seoBase . '/#website',
            'url'             => $seoBase . '/',
            'name'            => $seoTitle,
            'description'     => $seoDescription,
            'inLanguage'      => 'fr-FR',
            'publisher'       => ['@id' => $seoBase . '/#organization'],
        ],
        $organization,
        [
            '@type'           => 'ProfilePage',
            '@id'             => $seoUrl . '#profilepage',
            'url'             => $seoUrl,
            'name'            => $seoTitle,
            'description'     => $seoDescription,
            'inLanguage'      => 'fr-FR',
            'isPartOf'        => ['@id' => $seoBase . '/#website'],
            'mainEntity'      => ['@id' => $seoBase . '/#person'],
        ],
        $person,
    ],
];

if ($faqEntities) {
    $structuredData['@graph'][] = [
        '@type'      => 'FAQPage',
        '@id'        => $seoUrl . '#faq',
        'inLanguage' => 'fr-FR',
        'isPartOf'   => ['@id' => $seoBase . '/#website'],
        'mainEntity' => $faqEntities,
    ];
}

$jsonLd = json_encode(
    $structuredData,
    JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT
);
?>
<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-FCQ3N8Z932"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());

        gtag('config', 'G-FCQ3N8Z932');
    </script>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($seoTitle) ?></title>
    <meta name="description" content="<?= e($seoDescription) ?>">
    <meta name="author" content="<?= e($seoName) ?>">
    <meta name="keywords" content="<?= e(implode(', ', array_slice($knowsAbout, 0, 15))) ?>">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="theme-color" content="#0a0e0a">
    <link rel="canonical" href="<?= e($seoUrl) ?>">

    <!-- Open Graph -->
    <meta property="og:type" content="profile">
    <meta property="og:site_name" content="<?= e($seoName) ?>">
    <meta property="og:title" content="<?= e($seoTitle) ?>">
    <meta property="og:description" content="<?= e($seoDescription) ?>">
    <meta property="og:url" content="<?= e($seoUrl) ?>">
    <meta property="og:image" content="<?= e($seoImage) ?>">
    <meta property="og:locale" content="<?= e($seoLocale) ?>">
    <meta property="profile:first_name" content="<?= e(explode(' ', $seoName)[0] ?? '') ?>">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?= e($seoTitle) ?>">
    <meta name="twitter:description" content="<?= e($seoDescription) ?>">
    <meta name="twitter:image" content="<?= e($seoImage) ?>">

    <!-- Données structurées Schema.org -->
    <script type="application/ld+json">
        <?= $jsonLd ?>
    </script>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap" rel="stylesheet">

    <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
                    },
                    colors: {
                        term: {
                            bg: '#0a0e0a',
                            panel: '#0f150f',
                            border: '#1c2b1c',
                            dim: '#3f6f3f',
                            muted: '#7a9a7a',
                            green: '#22c55e',
                            bright: '#4ade80',
                            neon: '#00ff41',
                        },
                    },
                    keyframes: {
                        blink: {
                            '0%,49%': {
                                opacity: '1'
                            },
                            '50%,100%': {
                                opacity: '0'
                            }
                        },
                    },
                    animation: {
                        blink: 'blink 1s step-end infinite',
                    },
                },
            },
        };
    </script>

    <link rel="stylesheet" href="assets/css/custom.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%2322c55e'>&gt;_</text></svg>">
</head>

<body class="bg-term-bg text-term-muted font-mono antialiased selection:bg-term-green selection:text-term-bg">
    <div class="scanlines" aria-hidden="true"></div>