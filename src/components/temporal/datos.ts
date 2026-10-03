import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { slugify } from '../../lib/slug';

export type Temporal = CollectionEntry<'temporales'>;

/** Logements actifs, triés par « orden » puis par titre */
export async function temporalesActivos(): Promise<Temporal[]> {
  return (await getCollection('temporales'))
    .filter((t) => t.data.activo)
    .sort(
      (a, b) =>
        (a.data.orden ?? 999) - (b.data.orden ?? 999) || a.data.titulo.localeCompare(b.data.titulo)
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

/** Biens (vente / location) cochés « panel lateral », encore actifs */
export async function bienesLaterales() {
  return (await getCollection('biens'))
    .filter((b) => b.data.lateral && (b.data.estado === 'disponible' || b.data.estado === 'reservado'))
    .sort((a, b) => +b.data.fecha - +a.data.fecha);
}

/** Y a-t-il quelque chose à montrer dans le panneau latéral ? */
export async function hayPanel(): Promise<boolean> {
  const t = (await temporalesActivos()).some((i) => i.data.destacado);
  return t || (await bienesLaterales()).length > 0;
}
