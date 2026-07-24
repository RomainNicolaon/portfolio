<?php

declare(strict_types=1);

require __DIR__ . '/lib/data.php';

// Chargement des données
$profile     = load_json('profile.json');
$experiences = load_json('experiences.json');
$projects    = load_json('projects.json');
$skills      = load_json('skills.json');
$education   = load_json('education.json');

include __DIR__ . '/includes/head.php';
include __DIR__ . '/includes/nav.php';

include __DIR__ . '/includes/hero.php';

if ($profile['about'] ?? false) {
    include __DIR__ . '/includes/about.php';
}
if ($experiences) {
    include __DIR__ . '/includes/experience.php';
}
if ($projects) {
    include __DIR__ . '/includes/projects.php';
}
if ($skills) {
    include __DIR__ . '/includes/skills.php';
}
if ($education) {
    include __DIR__ . '/includes/education.php';
}

include __DIR__ . '/includes/contact.php';
include __DIR__ . '/includes/footer.php';
