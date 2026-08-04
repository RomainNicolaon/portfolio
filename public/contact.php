<?php
// Handler de formulaire de contact (hébergement O2Switch / PHP).
// Reçoit un POST JSON ou form-data, valide, puis envoie un e-mail.

header('Content-Type: application/json; charset=utf-8');

$RECIPIENT = 'nicolaon.romain@gmail.com';
$FROM      = 'no-reply@nicolaon.fr'; // adresse du domaine → meilleure délivrabilité (SPF)

function fail(int $code, string $message): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Méthode non autorisée.');
}

// Corps JSON en priorité, sinon $_POST classique.
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$name    = trim((string) ($data['name'] ?? ''));
$email   = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$website = trim((string) ($data['website'] ?? '')); // honeypot anti-spam

// Un bot remplit le champ caché → on fait semblant d'accepter.
if ($website !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

if ($name === '' || $email === '' || $message === '') {
    fail(422, 'Tous les champs sont requis.');
}
if (mb_strlen($name) > 100 || mb_strlen($email) > 150 || mb_strlen($message) > 5000) {
    fail(422, 'Un des champs est trop long.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail(422, 'Adresse e-mail invalide.');
}
if (mb_strlen($message) < 10) {
    fail(422, 'Message trop court.');
}

// Anti-injection d'en-têtes : aucune nouvelle ligne dans les valeurs d'en-tête.
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safeName  = str_replace(["\r", "\n"], ' ', $name);

$subject = 'Portfolio — message de ' . $safeName;
$body    = "Nom : {$safeName}\n"
         . "E-mail : {$safeEmail}\n\n"
         . "Message :\n{$message}\n";

$headers  = "From: Portfolio <{$FROM}>\r\n";
$headers .= "Reply-To: {$safeName} <{$safeEmail}>\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";
$headers .= "MIME-Version: 1.0\r\n";

$sent = @mail($RECIPIENT, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

if (!$sent) {
    fail(500, "L'envoi a échoué. Réessayez ou écrivez-moi directement par e-mail.");
}

echo json_encode(['ok' => true]);
