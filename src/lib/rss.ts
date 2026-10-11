import { getCollection } from 'astro:content';
import { slugify } from './slug';
import { formatPrecio, tipoLabel, operacionLabel, formatUbicacion, estaActivo } from './format';
import { tarifasDe, precioTxt, temporalesActivos } from '../components/temporal/datos';
import { guiasPublicadas } from './guias';

/**
 * Construit un flux RSS (biens et/ou articles du blog).
 * Utilisé par :
 *  - /feed/propiedades.xml : tout (biens + blog)
 *  - /feed/biens.xml       : uniquement les biens (scénario Make « biens »)
 *  - /feed/blog.xml        : uniquement le blog (scénario Make « blog »)
 * Un élément = un <item> ; son lien (guid) ne change jamais.
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Version carrée JPEG 1080×1080 d'une photo, pour Instagram (qui n'accepte que le JPEG
 * et un format entre 4:5 et 1,91:1). Images locales : Netlify Image CDN.
 * Images Cloudinary : transformation Cloudinary. Autres URLs : renvoyées telles quelles.
 */
function fotoInstagram(base: string, u: string): string {
  if (!u) return '';
  if (u.includes('res.cloudinary.com') && u.includes('/upload/')) {
    return u.replace('/upload/', '/upload/c_fill,w_1080,h_1080,f_jpg,q_85/');
  }
  const path = u.startsWith(base) ? u.slice(base.length) : u;
  if (!path.startsWith('/')) return u;
  const q = new URLSearchParams({ url: decodeURI(path), w: '1080', h: '1080', fit: 'cover', fm: 'jpg', q: '85' });
  return `${base}/.netlify/images?${q.toString()}`;
}

type Item = { titulo: string; link: string; desc: string; precio: string; foto: string; fecha: Date; categoria: string };

export async function rssResponse(
  site: URL | undefined,
  opts: { biens: boolean; blog: boolean; titulo: string; descripcion: string }
): Promise<Response> {
  const base = (site ?? new URL('https://calista.com.py')).toString().replace(/\/$/, '');
  const abs = (u?: string) => (!u ? '' : /^https?:\/\//.test(u) ? u : base + encodeURI(u));
  const items: Item[] = [];

  if (opts.biens) {
    // Ventes, locations, développements, terrains
    const biens = await getCollection('biens', (b) => b.data.en_linea !== false && b.data.operacion !== 'temporal' && estaActivo(b.data));
    for (const b of biens) {
      const d = b.data;
      items.push({
        titulo: d.titulo,
        link: `${base}/propiedad/${slugify(b.id)}/`,
        desc: d.descripcion,
        precio: (d.desarrollo ? 'Desde ' : '') + formatPrecio(d, 'es'),
        foto: abs(d.portada_foto || d.imagenes[0]),
        fecha: d.fecha,
        categoria: `${operacionLabel(d.operacion, 'es')} · ${tipoLabel(d.tipo, 'es')} · ${formatUbicacion(d)}`,
      });
    }

    // Alquiler temporal
    for (const it of await temporalesActivos()) {
      const d = it.data;
      const r = tarifasDe(it)[0];
      items.push({
        titulo: d.titulo,
        link: `${base}/alquiler-temporal/${slugify(it.id)}/`,
        desc: d.descripcion,
        precio: r ? `Desde ${precioTxt(r.precio, d.moneda, 'es-PY')}` : 'Consultar',
        foto: abs(d.portada_foto || d.imagenes[0]),
        fecha: ((it.entry.data as { fecha?: Date }).fecha) ?? new Date(),
        categoria: `Alquiler temporal · ${[d.barrio, d.ciudad].filter(Boolean).join(', ')}`,
      });
    }
  }

  if (opts.blog) {
    // Articles du blog (guides et actualité)
    for (const { entry, slug } of await guiasPublicadas()) {
      const d = entry.data;
      items.push({
        titulo: d.titulo,
        link: `${base}/blog/${slug}/`,
        desc: d.descripcion,
        precio: '',
        foto: abs(d.portada_foto),
        fecha: d.fecha,
        categoria: d.categoria === 'actualidad' ? 'Blog · Actualidad' : 'Blog · Guía',
      });
    }
  }

  items.sort((a, b) => +b.fecha - +a.fecha);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(opts.titulo)}</title>
<link>${base}/</link>
<description>${esc(opts.descripcion)}</description>
<language>es-PY</language>
${items
  .map(
    (i) => `<item>
<title>${esc(i.titulo)}</title>
<link>${esc(i.link)}</link>
<guid isPermaLink="true">${esc(i.link)}</guid>
<pubDate>${i.fecha.toUTCString()}</pubDate>
<category>${esc(i.categoria)}</category>
<description>${esc(i.precio ? `${i.precio} — ${i.desc}` : i.desc)}</description>
${i.foto ? `<enclosure url="${esc(i.foto)}" type="${/\.png$/i.test(i.foto) ? 'image/png' : 'image/jpeg'}" length="0" />\n<enclosure url="${esc(fotoInstagram(base, i.foto))}" type="image/jpeg" length="0" />\n<media:content url="${esc(i.foto)}" medium="image" />` : ''}
</item>`
  )
  .join('\n')}
</channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
