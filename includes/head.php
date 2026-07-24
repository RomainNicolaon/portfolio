<!DOCTYPE html>
<html lang="fr" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= e($profile['name'] ?? 'Portfolio') ?> — <?= e($profile['title'] ?? '') ?></title>
    <meta name="description" content="<?= e($profile['about'][0] ?? 'Portfolio') ?>">

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
                        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
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
