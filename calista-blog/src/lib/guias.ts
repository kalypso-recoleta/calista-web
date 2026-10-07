import { getCollection } from 'astro:content';
import { slugify } from './slug';

/** Articles du blog publiés (« borrador » décoché), les plus récents d'abord */
export async function guiasPublicadas() {
  const g = await getCollection('guias', (x) => !x.data.borrador);
  return g.sort((a, b) => +b.data.fecha - +a.data.fecha).map((entry) => ({ entry, slug: slugify(entry.id) }));
}

/** Nom des catégories, par langue */
export const CATEGORIAS: Record<string, Record<'guia' | 'actualidad', string>> = {
  es: { guia: 'Guías', actualidad: 'Actualidad' },
  fr: { guia: 'Guides', actualidad: 'Actualité' },
  en: { guia: 'Guides', actualidad: 'News' },
};
