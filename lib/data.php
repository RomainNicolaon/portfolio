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
