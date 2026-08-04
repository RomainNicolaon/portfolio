# portfolio

Portfolio personnel au style terminal, développé avec **Nuxt 3**, **Vue 3**, **TypeScript** et **Tailwind CSS**. Généré en site statique (SSG).

## Développement

```bash
npm install
npm run dev
```

Le site est disponible sur http://localhost:3000.

## Build statique

```bash
npm run generate
```

Le résultat est généré dans `.output/public/` et peut être déployé sur n'importe quel hébergement statique.

```bash
npx serve .output/public
```

## Structure

- `app.vue` — layout principal (page unique)
- `components/` — sections (nav, hero, about, experience, projects, skills, education, faq, contact, footer)
- `composables/` — données du portfolio, horloge, SEO / JSON-LD
- `data/portfolio.ts` — contenu (profil, expériences, projets, compétences, formation, FAQ)
- `types/portfolio.ts` — types TypeScript
- `assets/css/main.css` — styles complémentaires (scanlines, glow, reveal…)
- `public/` — `robots.txt`, `sitemap.xml`, `llms.txt`

## Déploiement

Le workflow `.github/workflows/deploy.yml` build le site et publie `.output/public` par FTP à chaque push sur `main`.
