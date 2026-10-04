import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { slugify } from '../../lib/slug';

/**
 * Un logement en alquiler temporal, quelle que soit sa source :
 *  - un bien de « Propiedades » avec Operación = Alquiler temporal (méthode actuelle)
 *  - l'ancienne collection « temporales » (compatibilité)
 * `entry` sert à afficher la description longue (render).
 */
export type Temporal = {
  id: string;
  entry: CollectionEntry<'biens'> | CollectionEntry<'temporales'>;
  orden: number;
  data: {
    titulo: string;
    gama: 'kalypso' | 'otros';
    residencia?: string;
    destacado: boolean;
    ciudad: string;
    barrio?: string;
    ubicacion?: string;
    dormitorios?: number;
    banos?: number;
    huespedes?: number;
    superficie?: number;
    moneda: 'USD' | 'PYG';
    tarifas: { duracion: string; precio: number; unidad: 'total' | 'semana' | 'mes' }[];
    precio_semana?: number;
    precio_mes?: number;
    incluye: string[];
    portada_foto?: string;
    imagenes: string[];
    descripcion: string;
    reservas: { desde: Date; hasta: Date }[];
  };
};

/** Logements actifs, triés par « orden » puis par titre */
export async function temporalesActivos(): Promise<Temporal[]> {
  const desdeBienes: Temporal[] = (
    await getCollection('biens', (b) => b.data.en_linea !== false && b.data.operacion === 'temporal')
  ).map((b) => ({
    id: b.id,
    entry: b,
    orden: 999,
    data: {
      ...b.data,
      destacado: !!b.data.lateral,
      superficie: b.data.superficie_construida ?? b.data.superficie_terreno,
    },
  }));
  const antiguos: Temporal[] = (await getCollection('temporales'))
    .filter((t) => t.data.activo)
    .map((t) => ({ id: t.id, entry: t, orden: t.data.orden ?? 999, data: t.data }));
  return [...desdeBienes, ...antiguos].sort(
    (a, b) => a.orden - b.orden || a.data.titulo.localeCompare(b.data.titulo)
  );
}

export const slugTemporal = (t: Temporal) => slugify(t.id);

/** Réservations au format compact pour le navigateur : [{d:"2026-10-10",h:"2026-10-24"}] */
export const reservasJson = (t: Temporal) =>
  JSON.stringify(
    t.data.reservas.map((r) => ({
      d: r.desde.toISOString().slice(0, 10),
      h: r.hasta.toISOString().slice(0, 10),
    }))
  );

export function precioTxt(n: number | undefined, moneda: 'USD' | 'PYG', locale: string) {
  if (n == null) return null;
  const num = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n);
  return `${moneda === 'USD' ? 'USD' : 'Gs.'} ${num}`;
}

export const LOCALE: Record<string, string> = { es: 'es-PY', fr: 'fr-FR', en: 'en-US' };

export type Rubrica = 'comprar' | 'alquilar' | 'desarrollos' | 'terrenos' | 'temporal';

/** Le bien appartient-il à la rubrique ? (mêmes règles que les pages de listes) */
function deRubrica(d: { operacion: string; tipo: string; desarrollo: boolean }, r: Rubrica): boolean {
  if (r === 'comprar') return d.operacion === 'venta' && d.tipo !== 'terreno' && !d.desarrollo;
  if (r === 'alquilar') return d.operacion === 'alquiler';
  if (r === 'desarrollos') return d.desarrollo;
  if (r === 'terrenos') return d.tipo === 'terreno';
  return false; // Alquiler temporal : seulement les logements meublés
}

/** Biens cochés « panel lateral », encore actifs, de la rubrique demandée */
export async function bienesLaterales(r: Rubrica) {
  return (await getCollection('biens', (b) => b.data.en_linea !== false))
    .filter(
      (b) =>
        b.data.lateral &&
        (b.data.estado === 'disponible' || b.data.estado === 'reservado') &&
        deRubrica(b.data, r)
    )
    .sort((a, b) => +b.data.fecha - +a.data.fecha);
}

/** Logements meublés « Destacar » : uniquement dans Alquiler temporal */
export async function temporalesLaterales(r: Rubrica) {
  if (r !== 'temporal') return [];
  return (await temporalesActivos()).filter((i) => i.data.destacado);
}

/** Y a-t-il quelque chose à montrer dans le panneau de cette rubrique ? */
export async function hayPanel(r: Rubrica): Promise<boolean> {
  return (await temporalesLaterales(r)).length > 0 || (await bienesLaterales(r)).length > 0;
}

export type Tarifa = { duracion: string; precio: number; unidad: 'total' | 'semana' | 'mes' };

/** Grille de prix ; à défaut, reconstruite depuis l'ancien format semaine / mois */
export function tarifasDe(t: Temporal): Tarifa[] {
  const d = t.data;
  if (d.tarifas.length) return d.tarifas;
  const out: Tarifa[] = [];
  if (d.precio_semana != null) out.push({ duracion: 's1', precio: d.precio_semana, unidad: 'semana' });
  if (d.precio_mes != null) out.push({ duracion: 'm1', precio: d.precio_mes, unidad: 'mes' });
  return out;
}
