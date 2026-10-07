import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';

/** « Barrio Herrera », « herrera », « HERRERA » → « herrera » ; « Ycuá Satí » → « ycua sati » */
export const normBarrio = (s = '') =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^barrio\s+/, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export type Zona = {
  entry: CollectionEntry<'barrios'>;
  slug: string;
  nombre: string;
  ciudad: string;
  bienes: CollectionEntry<'biens'>[];
};

function coincide(z: CollectionEntry<'barrios'>, b: CollectionEntry<'biens'>): boolean {
  if (normBarrio(b.data.ciudad) !== normBarrio(z.data.ciudad)) return false;
  if (z.data.toda_la_ciudad) return true; // ex. Luque, Areguá
  const nombres = [z.data.nombre, ...z.data.alias].map(normBarrio);
  return nombres.includes(normBarrio(b.data.barrio));
}

let cache: Zona[] | null = null;

/** Zones ayant au moins une annonce en ligne (hors alquiler temporal), triées par nombre d'annonces */
export async function zonasConBienes(): Promise<Zona[]> {
  if (cache) return cache;
  const [zonas, biens] = await Promise.all([
    getCollection('barrios'),
    getCollection('biens', (b) => b.data.en_linea !== false && b.data.operacion !== 'temporal'),
  ]);
  cache = zonas
    .map((z) => ({
      entry: z,
      slug: slugify(z.data.nombre),
      nombre: z.data.nombre,
      ciudad: z.data.ciudad,
      bienes: biens.filter((b) => coincide(z, b)),
    }))
    .filter((z) => z.bienes.length > 0)
    .sort((a, b) => b.bienes.length - a.bienes.length || a.nombre.localeCompare(b.nombre));
  return cache;
}

/** La zone d'une annonce (pour le lien « Ver más propiedades en … ») */
export async function zonaDeBien(b: CollectionEntry<'biens'>): Promise<Zona | undefined> {
  return (await zonasConBienes()).find((z) => z.bienes.some((x) => x.id === b.id));
}
