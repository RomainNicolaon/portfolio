# portfolio

[![CI](https://github.com/RomainNicolaon/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/RomainNicolaon/portfolio/actions/workflows/ci.yml)

Portfolio personnel au style terminal, développé avec **Nuxt 3**, **Vue 3**, **TypeScript** et **Tailwind CSS**. Rendu côté serveur (SSR, app Node) avec pages prérendues pour la perf et une route serveur `/api/contact` pour le formulaire de contact.

## Développement

```bash
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000.

## Build (SSR)

```bash
npm run build
```

Le résultat est généré dans `.output/` (`server/` + `public/`). L'output Nitro est autonome (les dépendances sont incluses).

```bash
node .output/server/index.mjs
```

### Formulaire de contact

La route `server/api/contact.post.ts` envoie les messages par SMTP via Nodemailer. Variables d'environnement requises (voir `.env.example`) : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`, `CONTACT_FROM`.

Protections anti-spam : honeypot + limite de débit par IP, et **Cloudflare Turnstile** (optionnel). Pour l'activer, renseigner `NUXT_PUBLIC_TURNSTILE_SITE_KEY` (clé publique) et `TURNSTILE_SECRET` (clé secrète). Sans ces variables, le widget ne s'affiche pas et la vérification est ignorée.

### Images OG

Une image de partage (1200×630 PNG) est générée par projet au build (`scripts/generate-og.mjs`, via `sharp`) dans `public/og/`. Le script tourne automatiquement avant `npm run build` (hook `prebuild`) ; aucune dépendance n'est ajoutée au runtime.

## Structure

- `app.vue` — layout principal (page unique)
- `components/` — sections (nav, hero, about, experience, projects, skills, education, faq, contact, footer)
- `composables/` — données du portfolio, horloge, SEO / JSON-LD
- `data/portfolio.ts` — contenu FR (profil, expériences, projets, compétences, formation, FAQ)
- `data/portfolio.en.ts` — contenu EN (mêmes projets/slugs, descriptions traduites)
- `i18n/locales/` — catalogues d'interface `fr.json` / `en.json`
- `types/portfolio.ts` — types TypeScript
- `assets/css/main.css` — styles complémentaires (scanlines, glow, reveal…)
- `public/` — `robots.txt`, `llms.txt`
- `server/api/` — routes serveur (formulaire de contact)

## Internationalisation (FR / EN)

Le site est bilingue via `@nuxtjs/i18n` (stratégie `prefix_except_default`) :

- **Français** = langue par défaut, servie à la racine (`/`, `/projets/<slug>`).
- **Anglais** servi sous `/en` (`/en`, `/en/projets/<slug>`).
- Pas de détection automatique du navigateur (URLs stables pour le SEO).
- Le sélecteur `FR | EN` est dans la barre de navigation.
- Textes d'interface : `i18n/locales/fr.json` et `en.json`.
- Contenu (projets, à propos, FAQ…) : `data/portfolio.ts` (FR) et `data/portfolio.en.ts` (EN). Les slugs de projets et les statuts restent identiques dans les deux langues.
- `hreflang`, `canonical`, `og:locale` et `inLanguage` (JSON-LD) sont générés par locale.
- Les deux versions sont prérendues au build.

## Déploiement (O2Switch — app Node)

Le workflow `.github/workflows/deploy.yml` construit l'app (`npm run build`), copie le `package.json` runtime généré par Nitro à la racine de l'app, puis publie `.output/` par FTP à chaque push sur `main` (**sans** `node_modules`), et déclenche un redémarrage Passenger via `tmp/restart.txt`.

Côté O2Switch (cPanel → **Setup Node.js App**) :

1. Créer l'app Node, **Application startup file** = `server/index.mjs` (si `.output/` est uploadé à la racine de l'app).
2. Cliquer **Run NPM Install** : installe les deps runtime dans `node_modules/` à la racine de l'app (Node les résout depuis `server/…` via le dossier parent).
3. Définir les variables d'environnement SMTP (voir `.env.example`).
4. Secrets GitHub Actions : `ftp_server`, `ftp_username`, `ftp_password`, et `ftp_server_dir` (racine de l'app Node).

> Le déploiement n'est plus un simple FTP de fichiers statiques mais une app Node : `npm run build` remplace `npm run generate`.
