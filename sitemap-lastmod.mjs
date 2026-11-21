// Dates <lastmod> du sitemap (lu par astro.config.mjs).
//
// Règle Google : lastmod n'est utilisé que s'il est fiable → on ne met une date
// QUE si on connaît la vraie date de modification de la page, jamais la date du build.
//
// Date d'une fiche / d'un article = la plus récente de :
//   - la date « fecha » saisie dans l'admin (publication),
//   - la date du dernier commit Git qui a modifié le fichier .md
//     (chaque enregistrement depuis l'admin Sveltia est un commit).
// Si Git n'a pas l'historique complet (clone « shallow »), on ne garde que « fecha » :
// sinon toutes les fiches auraient la date du dernier commit.
//
// Pages concernées : fiches (/propiedad/, /alquiler-temporal/<fiche>), articles (/blog/<article>),
// barrios (/barrios/<barrio>), liste du blog et pages de thème (= article le plus récent).
// Les autres pages (accueil, contact, rubriques…) n'ont pas de lastmod : Google l'accepte.
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const slugify = (id) =>
  id.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');

const RAIZ = fileURLToPath(new URL('./', import.meta.url));
const AHORA = new Date();

/** Dernière date de commit de chaque fichier de src/content (clé = chemin en NFC) */
function fechasGit() {
  const fechas = new Map();
  try {
    const git = (args) => execFileSync('git', ['-c', 'core.quotepath=false', ...args], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (git(['rev-parse', '--is-shallow-repository']).trim() !== 'false') {
      console.warn('[sitemap] Historique Git incomplet : lastmod = date « fecha » seulement.');
      return fechas;
    }
    // Du plus récent au plus ancien : la première date vue pour un fichier est la bonne
    const log = git(['log', '--format=@@%cI', '--name-only', '--', 'src/content']);
    let fecha = null;
    for (const linea of log.split('\n')) {
      if (linea.startsWith('@@')) fecha = new Date(linea.slice(2));
      else if (linea.trim() && fecha) {
        const clave = linea.trim().normalize('NFC');
        if (!fechas.has(clave)) fechas.set(clave, fecha);
      }
    }
  } catch {
    console.warn('[sitemap] Git indisponible : lastmod = date « fecha » seulement.');
  }
  return fechas;
}

/** Valeur d'un champ simple de l'en-tête YAML (« fecha: 2026-11-17T08:00:00 ») */
function campo(texto, nombre) {
  const fm = texto.split(/\n---/)[0];
  const m = fm.match(new RegExp(`^${nombre}:[ \\t]*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : undefined;
}

const masReciente = (...fechas) => {
  const validas = fechas.filter((f) => f instanceof Date && !isNaN(+f));
  if (!validas.length) return undefined;
  const max = new Date(Math.max(...validas.map(Number)));
  return max > AHORA ? AHORA : max; // jamais de date dans le futur
};

/**
 * Table chemin de page (sans langue, avec « / » final) → date.
 * Les versions /fr/, /en/, /pt/ viennent du même fichier : même date.
 */
export function tablaLastmod() {
  const git = fechasGit();
  const tabla = new Map();
  const leer = (carpeta) =>
    readdirSync(new URL(`./src/content/${carpeta}/`, import.meta.url))
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const texto = readFileSync(new URL(`./src/content/${carpeta}/${f}`, import.meta.url), 'utf8');
        const f0 = campo(texto, 'fecha');
        const fecha = masReciente(f0 ? new Date(f0) : undefined, git.get(`src/content/${carpeta}/${f}`.normalize('NFC')));
        return { f, texto, fecha };
      });

  for (const { f, texto, fecha } of leer('biens')) {
    if (!fecha || campo(texto, 'en_linea') === 'false') continue;
    const slug = slugify(f.replace(/\.md$/, ''));
    tabla.set(campo(texto, 'operacion') === 'temporal' ? `/alquiler-temporal/${slug}/` : `/propiedad/${slug}/`, fecha);
  }

  const porTema = new Map();
  let ultimoArticulo;
  for (const { f, texto, fecha } of leer('guias')) {
    if (!fecha || campo(texto, 'borrador') !== 'false') continue; // brouillon par défaut (voir content.config.ts)
    tabla.set(`/blog/${slugify(f.replace(/\.md$/, ''))}/`, fecha);
    ultimoArticulo = masReciente(ultimoArticulo, fecha);
    const tema = campo(texto, 'tema');
    if (tema) porTema.set(tema, masReciente(porTema.get(tema), fecha));
  }
  if (ultimoArticulo) tabla.set('/blog/', ultimoArticulo);
  for (const [tema, fecha] of porTema) tabla.set(`/blog/tema/${tema}/`, fecha);

  for (const { texto, fecha } of leer('barrios')) {
    const nombre = campo(texto, 'nombre');
    if (fecha && nombre) tabla.set(`/barrios/${slugify(nombre)}/`, fecha);
  }
  return tabla;
}
