import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugify } from '../../lib/slug';
import { formatPrecio, tipoLabel, operacionLabel, formatUbicacion, estaActivo } from '../../lib/format';
import { tarifasDe, precioTxt, temporalesActivos } from '../../components/temporal/datos';

/**
 * Flux RSS de toutes les annonces en ligne (https://calista.com.py/feed/propiedades.xml).
 * Sert à publier automatiquement chaque nouveau bien sur Facebook / Instagram
 * (Make, Zapier…) et, plus tard, à alimenter d'autres portails.
 * Une annonce = un <item> ; son lien (guid) ne change jamais.
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://calista.com.py')).toString().replace(/\/$/, '');
  const abs = (u?: string) => (!u ? '' : /^https?:\/\//.test(u) ? u : base + encodeURI(u));

  type Item = { titulo: string; link: string; desc: string; precio: string; foto: string; fecha: Date; categoria: string };
  const items: Item[] = [];

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

  items.sort((a, b) => +b.fecha - +a.fecha);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>CALISTA Inmobiliaria — Propiedades</title>
<link>${base}/</link>
<description>Propiedades en venta, alquiler, alquiler temporal y desarrollos Kalypso en Asunción.</description>
<language>es-PY</language>
${items
  .map(
    (i) => `<item>
<title>${esc(i.titulo)}</title>
<link>${esc(i.link)}</link>
<guid isPermaLink="true">${esc(i.link)}</guid>
<pubDate>${i.fecha.toUTCString()}</pubDate>
<category>${esc(i.categoria)}</category>
<description>${esc(`${i.precio} — ${i.desc}`)}</description>
${i.foto ? `<enclosure url="${esc(i.foto)}" type="image/jpeg" length="0" />\n<media:content url="${esc(i.foto)}" medium="image" />` : ''}
</item>`
  )
  .join('\n')}
</channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
