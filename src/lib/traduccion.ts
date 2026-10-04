/**
 * Traductions des annonces : chaque bien peut avoir un bloc `fr` et un bloc `en`
 * (titre, description courte, texte complet) rempli dans l'admin.
 * Sur les pages FR / EN, on affiche la traduction ; si un champ est vide, l'espagnol.
 */
import { marked } from 'marked';

type Trad = { titulo?: string; descripcion?: string; cuerpo?: string } | undefined;

export function localizar<T extends { titulo: string; descripcion: string }>(data: T, lang: string): T {
  if (lang !== 'fr' && lang !== 'en') return data;
  const tr = (data as unknown as Record<string, Trad>)[lang];
  if (!tr) return data;
  return {
    ...data,
    titulo: tr.titulo?.trim() || data.titulo,
    descripcion: tr.descripcion?.trim() || data.descripcion,
  };
}

/** Texte complet traduit, en HTML (null = utiliser le texte espagnol d'origine). */
export function cuerpoTraducido(data: object, lang: string): string | null {
  if (lang !== 'fr' && lang !== 'en') return null;
  const c = (data as Record<string, Trad>)[lang]?.cuerpo?.trim();
  return c ? (marked.parse(c, { async: false }) as string) : null;
}
