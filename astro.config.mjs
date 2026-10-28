// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// IMPORTANT : remplace cette URL par le domaine final de Calista
// (ex. https://www.calista.com.py). Elle sert au sitemap et aux
// aperçus de partage (OG) — les liens WhatsApp en dépendent.
const SITE = 'https://calista.com.py';

// Articles du blog sans traduction portugaise (bloc « pt » avec texte) : leur page /pt/blog/…
// affiche l'espagnol en « noindex » (voir GuiaBody.astro) ; on les garde hors du sitemap.
// Même règle que src/lib/slug.ts pour l'adresse.
const slugify = (id) =>
  id.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
const DIR_GUIAS = new URL('./src/content/guias/', import.meta.url);
const guiasSinPt = new Set(
  readdirSync(DIR_GUIAS)
    .filter((f) => f.endsWith('.md'))
    .filter((f) => {
      const fm = readFileSync(new URL(f, DIR_GUIAS), 'utf8').split(/\n---/)[0];
      return !/^pt:\s*\n(?:[ \t].*\n|\s*\n)*?[ \t]+cuerpo:/m.test(fm);
    })
    .map((f) => slugify(f.replace(/\.md$/, '')))
);

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      // Anciennes adresses « /guias » (redirigées vers /blog) : hors sitemap
      // + articles en portugais pas encore traduits (voir guiasSinPt)
      filter: (page) => {
        if (/\/guias\//.test(page)) return false;
        const m = page.match(/\/pt\/blog\/(?!tema\/)([^/]+)\/?$/);
        return !(m && guiasSinPt.has(m[1]));
      },
      // Sitemap multilingue : chaque URL liste ses variantes es / fr / en.
      i18n: {
        defaultLocale: 'es',
        // Mêmes codes que les balises hreflang des pages (langue seule)
        locales: { es: 'es', fr: 'fr', en: 'en', pt: 'pt' },
      },
    }),
  ],
  // Site en 4 langues : espagnol par défaut (sans préfixe), /fr/, /en/ et /pt/ (portugais du Brésil)
  i18n: {
    locales: ['es', 'fr', 'en', 'pt'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Astro génère un site 100% statique par défaut → builds gratuits sur Netlify.
});
