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
      // Sitemap multilingue : chaque URL liste ses variantes es / fr / en.
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es-PY', fr: 'fr-FR', en: 'en-US' },
      },
    }),
  ],
  // Site trilingue : espagnol par défaut (sans préfixe), /fr/ et /en/
  i18n: {
    locales: ['es', 'fr', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Astro génère un site 100% statique par défaut → builds gratuits sur Netlify.
});
