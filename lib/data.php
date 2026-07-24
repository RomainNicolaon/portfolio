<?php

declare(strict_types=1);

/**
 * Charge un fichier JSON depuis le dossier data/ et retourne un tableau associatif.
 *
 * @param string $file Nom du fichier (ex: "profile.json").
 * @return array Données décodées, ou tableau vide en cas d'erreur.
 */
function load_json(string $file): array
{
    $path = __DIR__ . '/../data/' . $file;

    if (!is_file($path) || !is_readable($path)) {
        error_log("load_json: fichier introuvable ou illisible: {$path}");
        return [];
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        error_log("load_json: lecture impossible: {$path}");
        return [];
    }

    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log("load_json: JSON invalide dans {$file}: " . json_last_error_msg());
        return [];
    }

    return is_array($data) ? $data : [];
}

/**
 * Échappe une chaîne pour un affichage HTML sûr.
 */
function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Retourne l'URL de base du site (sans slash final).
 *
 * Utilise la clé "website" du profil si elle est renseignée, sinon la
 * déduit dynamiquement des variables serveur (schéma + hôte).
 *
 * @param array $profile Données du profil.
 */
function site_url(array $profile = []): string
{
    $website = trim((string)($profile['website'] ?? ''));
    if ($website !== '') {
        return rtrim($website, '/');
    }

    $https  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443');
    $scheme = $https ? 'https' : 'http';
    $host   = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? 'localhost');

    return $scheme . '://' . $host;
}

/**
 * Retourne l'URL absolue de la page courante (sans query string).
 *
 * @param array $profile Données du profil.
 */
function current_url(array $profile = []): string
{
    $path = strtok($_SERVER['REQUEST_URI'] ?? '/', '?') ?: '/';

    return site_url($profile) . $path;
}
