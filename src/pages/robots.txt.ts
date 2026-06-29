import type { APIRoute } from 'astro';

// Génère /robots.txt automatiquement à partir du domaine configuré (astro.config.mjs).
// Autorise l'indexation et indique l'emplacement du sitemap.
export const GET: APIRoute = ({ site }) => {
  const base = site ? site.toString() : 'https://calista-inmobiliaria.netlify.app/';
  const body = `User-agent: *
Allow: /

Sitemap: ${base}sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
