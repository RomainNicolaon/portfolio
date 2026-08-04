# portfolio

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

## Structure

- `app.vue` — layout principal (page unique)
- `components/` — sections (nav, hero, about, experience, projects, skills, education, faq, contact, footer)
- `composables/` — données du portfolio, horloge, SEO / JSON-LD
- `data/portfolio.ts` — contenu (profil, expériences, projets, compétences, formation, FAQ)
- `types/portfolio.ts` — types TypeScript
- `assets/css/main.css` — styles complémentaires (scanlines, glow, reveal…)
- `public/` — `robots.txt`, `llms.txt`
- `server/api/` — routes serveur (formulaire de contact)

## Déploiement (O2Switch — app Node)

Le workflow `.github/workflows/deploy.yml` construit l'app (`npm run build`), copie le `package.json` runtime généré par Nitro à la racine de l'app, puis publie `.output/` par FTP à chaque push sur `main` (**sans** `node_modules`), et déclenche un redémarrage Passenger via `tmp/restart.txt`.

Côté O2Switch (cPanel → **Setup Node.js App**) :

1. Créer l'app Node, **Application startup file** = `server/index.mjs` (si `.output/` est uploadé à la racine de l'app).
2. Cliquer **Run NPM Install** : installe les deps runtime dans `node_modules/` à la racine de l'app (Node les résout depuis `server/…` via le dossier parent).
3. Définir les variables d'environnement SMTP (voir `.env.example`).
4. Secrets GitHub Actions : `ftp_server`, `ftp_username`, `ftp_password`, et `ftp_server_dir` (racine de l'app Node).

> Le déploiement n'est plus un simple FTP de fichiers statiques mais une app Node : `npm run build` remplace `npm run generate`.
