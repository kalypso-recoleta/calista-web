import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { estaActivo } from '../../lib/format';
import { slugify } from '../../lib/slug';
import { resolverUbicacion, coordsCiudad } from '../../lib/geo';
import { site } from '../../lib/site';
import { tarifasDe, temporalesActivos } from '../../components/temporal/datos';

/**
 * Flux d'import InfoCasas (https://calista.com.py/feed/infocasas.xml).
 * Format : « InfoCasas — Sistema de importación de propiedades en XML ».
 * À donner une seule fois à InfoCasas : ensuite chaque bien publié sur le site
 * apparaît dans le flux, et disparaît quand il est vendu / alquilado / hors ligne.
 *
 * ⚠️ Champs obligatoires InfoCasas : id, tipoPropiedad, tipoOperacion,
 * departamento, zona, latitud, longitud, au moins 1 image JPG.
 * Un bien dont le barrio / la ville n'a pas d'ID de zone connu est ignoré
 * (message dans le journal de build) → ajouter le barrio dans ZONAS ci-dessous.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const norm = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^barrio\s+/, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Zones d'Asunción (département 21) — IDs de l'annexe InfoCasas
const ZONAS_ASU: Record<string, number> = {
  herrera: 357, hipodromo: 358, 'los laureles': 359, 'mcal estigarribia': 360, 'mariscal estigarribia': 360,
  nazareth: 361, recoleta: 362, 'san jorge': 363, 'san pablo': 364, 'santa maria': 365, 'sta maria': 365,
  tembetary: 366, terminal: 367, 'villa aurelia': 368, 'villa morra': 369, 'villa mora': 369,
  'ycua sati': 370, 'ykua sati': 370, ytay: 371, 'canada del ybyray': 372, 'las carmelitas': 373,
  carmelitas: 373, 'las lomas': 374, manora: 375, mburucuya: 376, 'mme lynch': 377, 'madame lynch': 377,
  'salvador del mundo': 378, 'santa rosa': 379, 'sta rosa': 379, 'santo domingo': 380, 'sto domingo': 380,
  trinidad: 381, 'virgen de fatima': 382, 'virgen de la asuncion': 383, botanico: 384,
  'de las residentas': 385, 'las residentas': 385, 'loma pyta': 386, mbocayaty: 387, 'nu guazu': 388,
  'san blas': 389, 'zeballos cue': 390, 'bella vista': 391, 'virgen del huerto': 392, jara: 393,
  'las mercedes': 394, 'mcal lopez': 395, 'mariscal lopez': 395, mburicao: 396,
  'bernardino caballero': 397, 'ciudad nueva': 398, pinoza: 399, 'vista alegre': 400, 'san vicente': 401,
  pettirossi: 402, 'san roque': 403, catedral: 404, 'gral diaz': 405, 'general diaz': 405, obrero: 406,
  republicano: 407, 'santa ana': 408, 'sta ana': 408, 'ita enramada': 409, 'roberto l petit': 410,
  'la encarnacion': 411, tacumbu: 412, 'dr francia': 413, 'c a lopez': 414, sajonia: 415,
  'ita pyta punta': 416, 'san antonio': 417,
};

// Villes du département Central (22) : une zone par ville
const ZONAS_CENTRAL: Record<string, number> = {
  aregua: 418, capiata: 419, 'fernando de la mora': 420, guarambare: 421, ita: 422, itaugua: 423,
  'j a saldivar': 424, 'j augusto saldivar': 424, lambare: 425, limpio: 426, luque: 427,
  'mariano roque alonso': 428, nemby: 429, 'nueva italia': 430, 'san antonio': 431, 'san lorenzo': 432,
  'villa elisa': 433, villeta: 434, ypacarai: 435, ypane: 436,
};

function zonaDe(ciudad: string, barrio?: string): { departamento: number; zona: number } | null {
  const c = norm(ciudad);
  if (c === 'asuncion') {
    const z = ZONAS_ASU[norm(barrio)];
    return z ? { departamento: 21, zona: z } : null;
  }
  const z = ZONAS_CENTRAL[c];
  return z ? { departamento: 22, zona: z } : null;
}

const TIPO: Record<string, number> = {
  casa: 1, duplex: 1, departamento: 2, terreno: 3, local: 4, oficina: 5, quinta: 6, deposito: 12,
};
const OPERACION: Record<string, number> = { venta: 1, alquiler: 2, temporal: 4 };
const MONEDA: Record<string, number> = { USD: 1, PYG: 3 };
const DIAS: Record<string, number> = { s1: 7, s2: 14, s3: 21, m1: 30, m2: 60, m3: 90, m6: 180 };

const idDormitorios = (n?: number) => (n == null ? undefined : Math.min(n + 1, 6));
const idBanios = (n?: number) => (n == null || n < 1 ? undefined : Math.min(n, 3));

/** Markdown → texte brut lisible (InfoCasas : « texto ») */
const textoPlano = (md = '') =>
  md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/(\*\*|__|\*|_|`)/g, '')
    .replace(/^\s*[-*+]\s+/gm, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

type Prop = {
  id: string;
  tipo: string;
  operacion: string;
  ciudad: string;
  barrio?: string;
  ubicacion?: string;
  dormitorios?: number;
  banos?: number;
  cocheras?: number;
  m2terreno?: number;
  m2edificados?: number;
  desarrollo?: boolean;
  financia?: boolean;
  titulo: string;
  descripcion: string;
  precio?: number;
  moneda: 'USD' | 'PYG';
  mensual?: number;
  estadiaMinima?: number;
  fotos: string[];
  telefono: string;
};

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const base = (siteUrl ?? new URL('https://calista.com.py')).toString().replace(/\/$/, '');
  const abs = (u: string) => (/^https?:\/\//.test(u) ? u : base + encodeURI(u));
  const esJpg = (u: string) => /\.jpe?g(\?|$)/i.test(u);

  const props: Prop[] = [];

  const biens = await getCollection(
    'biens',
    (b) => b.data.en_linea !== false && b.data.operacion !== 'temporal' && estaActivo(b.data)
  );
  for (const b of biens) {
    const d = b.data;
    props.push({
      id: b.id,
      tipo: d.tipo,
      operacion: d.operacion,
      ciudad: d.ciudad,
      barrio: d.barrio,
      ubicacion: d.ubicacion,
      dormitorios: d.dormitorios,
      banos: d.banos,
      cocheras: d.cocheras,
      m2terreno: d.superficie_terreno,
      m2edificados: d.superficie_construida,
      desarrollo: d.desarrollo,
      financia: d.financiacion,
      titulo: d.titulo,
      descripcion: textoPlano(b.body) || d.descripcion,
      precio: d.precio || undefined,
      moneda: d.moneda,
      fotos: [d.portada_foto, ...d.imagenes].filter((x): x is string => !!x),
      telefono: site.telefono,
    });
  }

  for (const t of await temporalesActivos()) {
    const d = t.data;
    const tarifas = tarifasDe(t);
    const mes = tarifas.find((r) => r.duracion === 'm1');
    const mensual = mes ? (mes.unidad === 'semana' ? undefined : mes.precio) : undefined;
    const minimo = tarifas.map((r) => DIAS[r.duracion]).filter(Boolean).sort((a, b) => a - b)[0];
    props.push({
      id: t.id,
      tipo: (t.entry.data as { tipo?: string }).tipo ?? 'departamento',
      operacion: 'temporal',
      ciudad: d.ciudad,
      barrio: d.barrio,
      ubicacion: d.ubicacion,
      dormitorios: d.dormitorios,
      banos: d.banos,
      m2edificados: d.superficie,
      titulo: d.titulo,
      descripcion: textoPlano((t.entry as { body?: string }).body) || d.descripcion,
      moneda: d.moneda,
      mensual,
      estadiaMinima: minimo,
      fotos: [d.portada_foto, ...d.imagenes].filter((x): x is string => !!x),
      telefono: '+595 984 333003',
    });
  }

  const bloques: string[] = [];
  for (const p of props) {
    const z = zonaDe(p.ciudad, p.barrio);
    const fotos = [...new Set(p.fotos)].filter(esJpg).slice(0, 15).map(abs);
    if (!z || !fotos.length || !TIPO[p.tipo]) {
      console.warn(
        `[infocasas] Excluido "${p.titulo}": ${!z ? `zona desconocida (${p.barrio ?? '—'}, ${p.ciudad})` : !fotos.length ? 'sin foto JPG' : 'tipo'}`
      );
      continue;
    }
    const exacto = await resolverUbicacion(p.ubicacion);
    const pos = exacto ?? coordsCiudad[p.ciudad] ?? site.mapaCentro;

    const campos: [string, string | number | undefined][] = [
      ['id', slugify(p.id)],
      ['tipoPropiedad', TIPO[p.tipo]],
      ['tipoOperacion', OPERACION[p.operacion]],
      ['departamento', z.departamento],
      ['zona', z.zona],
      ['idDormitorios', p.tipo === 'terreno' ? undefined : idDormitorios(p.dormitorios)],
      ['idBanios', idBanios(p.banos)],
      ['estado', p.desarrollo ? 8 : undefined],
      ['financia', p.financia ? 1 : undefined],
      ['m2terreno', p.m2terreno],
      ['m2edificados', p.m2edificados],
      ['garage', p.cocheras || undefined],
      ['titulo', p.titulo],
      ['descripcion', p.descripcion],
      ['latitud', pos.lat],
      ['longitud', pos.lng],
      ['ubicacionAproximada', exacto ? 0 : 1],
    ];
    if (p.operacion === 'venta') {
      campos.push(['precioVenta', p.precio ?? 0], ['monedaVenta', MONEDA[p.moneda]], ['ocultarPrecioV', p.precio ? 0 : 1]);
    } else if (p.operacion === 'alquiler') {
      campos.push(['precioAlquiler', p.precio ?? 0], ['monedaAlquiler', MONEDA[p.moneda]], ['ocultarPrecioA', p.precio ? 0 : 1]);
    } else {
      campos.push(
        ['precioAlquilerMensual', p.mensual ?? 0],
        ['monedaAlquilerMensual', MONEDA[p.moneda]],
        ['estadiaMinima', p.estadiaMinima]
      );
    }

    bloques.push(`  <propiedad>
${campos
  .filter(([, v]) => v !== undefined && v !== '')
  .map(([k, v]) => `    <${k}>${esc(String(v))}</${k}>`)
  .join('\n')}
    <imagenes>
${fotos.map((u) => `      <url>${esc(u)}</url>`).join('\n')}
    </imagenes>
    <vendedor>
      <email>${esc(site.email)}</email>
      <nombre>CALISTA Inmobiliaria</nombre>
      <telefono>${esc(p.telefono)}</telefono>
    </vendedor>
  </propiedad>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>\n<xml>\n${bloques.join('\n')}\n</xml>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
