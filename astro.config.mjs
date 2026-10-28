// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT : remplace cette URL par le domaine final de Calista
// (ex. https://www.calista.com.py). Elle sert au sitemap et aux
// aperçus de partage (OG) — les liens WhatsApp en dépendent.
const SITE = 'https://calista.com.py';

export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      // Anciennes adresses « /guias » (redirigées vers /blog) : hors sitemap
      // Articles du blog en portugais pas encore traduits (texte espagnol, noindex) : hors sitemap.
      // À retirer quand les articles auront leur traduction « pt ».
      filter: (page) => !/\/guias\//.test(page) && !/\/pt\/blog\/(?!tema\/)[^/]+\/?$/.test(page),
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
