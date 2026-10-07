import { getCollection } from 'astro:content';
import { slugify } from './slug';

/** Guías publiées (« borrador » décoché), les plus récentes d'abord */
export async function guiasPublicadas() {
  const g = await getCollection('guias', (x) => !x.data.borrador);
  return g.sort((a, b) => +b.data.fecha - +a.data.fecha).map((entry) => ({ entry, slug: slugify(entry.id) }));
}
