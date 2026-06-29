// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT : remplace cette URL par le domaine final de Calista
// (ex. https://www.calista.com.py). Elle sert au sitemap et aux
// aperçus de partage (OG) — les liens WhatsApp en dépendent.
const SITE = 'https://calista-inmobiliaria.netlify.app';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  // Astro génère un site 100% statique par défaut → builds gratuits sur Netlify.
});
