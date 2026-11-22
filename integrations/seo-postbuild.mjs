/**
 * Retouches SEO appliquées au site construit (dossier dist), après le build Astro.
 *
 * 1. Liens internes avec « / » final : /comprar → /comprar/. C'est l'adresse servie par Netlify
 *    (sans « / », Netlify redirige) et l'adresse « canonical » : Google ne voit plus deux adresses.
 * 2. Articles du blog à adresse traduite (/fr/blog/combien-coute-…) :
 *    - les liens qui pointent encore vers l'ancienne adresse (slug espagnol sous /fr/, /en/, /pt/)
 *      sont réécrits vers la nouvelle ;
 *    - une redirection 301 ancienne → nouvelle adresse est ajoutée dans dist/_redirects.
 * 3. Sitemap : chaque adresse reçoit ses variantes de langue (hreflang) lues dans la page elle-même,
 *    ce qui reste juste quand l'adresse change d'une langue à l'autre.
 *
 * Doit être déclarée APRÈS l'intégration sitemap dans astro.config.mjs.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const LANGS = ['fr', 'en', 'pt'];

function htmlFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** hreflang → adresse, lus dans les balises <link rel="alternate" hreflang> de la page */
function hreflangs(html) {
  const m = {};
  for (const tag of html.match(/<link[^>]+hreflang=[^>]*>/g) ?? []) {
    const lang = tag.match(/hreflang="([^"]+)"/)?.[1];
    const href = tag.match(/href="([^"]+)"/)?.[1];
    if (lang && href && /rel="alternate"/.test(tag)) m[lang] = href;
  }
  return m;
}

export default function seoPostbuild({ site }) {
  const origen = new URL(site).origin;
  return {
    name: 'calista-seo-postbuild',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const dist = fileURLToPath(dir);
        const files = htmlFiles(dist);

        // ── Adresses traduites des articles : ancien slug espagnol → nouveau slug, par langue
        const mapa = { fr: {}, en: {}, pt: {} };
        const redirecciones = [];
        for (const lang of LANGS) {
          const base = join(dist, lang, 'blog');
          if (!existsSync(base)) continue;
          for (const slug of readdirSync(base)) {
            const f = join(base, slug, 'index.html');
            if (slug === 'tema' || !existsSync(f)) continue;
            const es = hreflangs(readFileSync(f, 'utf8')).es;
            const esSlug = es && new URL(es).pathname.match(/^\/blog\/([^/]+)\/$/)?.[1];
            if (esSlug && esSlug !== slug) {
              mapa[lang][esSlug] = slug;
              redirecciones.push(`/${lang}/blog/${esSlug}  /${lang}/blog/${slug}/  301`);
            }
          }
        }

        // ── Réécriture des liens internes
        const corregir = (ruta) => {
          const m = ruta.match(/^\/(fr|en|pt)\/blog\/([^/]+)\/?$/);
          if (m && mapa[m[1]][m[2]]) ruta = `/${m[1]}/blog/${mapa[m[1]][m[2]]}/`;
          const ultimo = ruta.split('/').pop();
          if (!ruta.endsWith('/') && !ultimo.includes('.')) ruta += '/';
          return ruta;
        };
        let cambios = 0;
        for (const f of files) {
          const html = readFileSync(f, 'utf8');
          const nuevo = html.replace(/href="((?:https:\/\/calista\.com\.py)?)(\/(?!\/)[^"?#]*)([^"]*)"/g, (todo, dom, ruta, resto) => {
            const r = corregir(ruta);
            if (r === ruta) return todo;
            cambios++;
            return `href="${dom}${r}${resto}"`;
          });
          if (nuevo !== html) writeFileSync(f, nuevo);
        }

        // ── Sitemap : variantes de langue lues dans chaque page
        let urls = 0;
        for (const name of readdirSync(dist).filter((n) => /^sitemap-\d+\.xml$/.test(n))) {
          const p = join(dist, name);
          const original = readFileSync(p, 'utf8');
          // Dates de modification connues (les adresses traduites reprennent celle de la version espagnole)
          const fechas = {};
          for (const [, l, d] of original.matchAll(/<url><loc>([^<]+)<\/loc>(?:(?!<\/url>)[\s\S])*?<lastmod>([^<]+)<\/lastmod>/g)) fechas[l] = d;
          const xml = original.replace(/<url>([\s\S]*?)<\/url>/g, (bloque, interior) => {
            const loc = interior.match(/<loc>([^<]+)<\/loc>/)?.[1];
            if (!loc) return bloque;
            const ruta = new URL(loc).pathname;
            const f = join(dist, ruta, 'index.html');
            if (!existsSync(f)) return bloque;
            const alt = hreflangs(readFileSync(f, 'utf8'));
            delete alt['x-default'];
            const links = Object.entries(alt)
              .filter(([, href]) => href.startsWith(origen))
              .map(([l, href]) => `<xhtml:link rel="alternate" hreflang="${l}" href="${href}"/>`)
              .join('');
            urls++;
            let cuerpo = interior.replace(/<xhtml:link[^>]*\/>/g, '').replace('</loc>', `</loc>${links}`);
            if (!/<lastmod>/.test(cuerpo) && alt.es && fechas[alt.es]) cuerpo = cuerpo.replace(`${links}`, `${links}<lastmod>${fechas[alt.es]}</lastmod>`);
            return `<url>${cuerpo}</url>`;
          });
          writeFileSync(p, xml);
        }

        // ── Redirections 301 des anciennes adresses d'articles
        if (redirecciones.length) {
          appendFileSync(join(dist, '_redirects'), `\n# Articles du blog : ancienne adresse (slug espagnol) → adresse traduite (généré au build)\n${redirecciones.join('\n')}\n`);
        }
        logger.info(`${cambios} liens corrigés, ${redirecciones.length} redirections d'articles, ${urls} adresses du sitemap avec hreflang`);
      },
    },
  };
}
