import { ui } from './ui';

export const LOCALES = ['es', 'fr', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'es';

export const LANG_LABEL: Record<Lang, string> = {
  es: 'ES',
  fr: 'FR',
  en: 'EN',
};

/** Détecte la langue à partir de l'URL (/fr/…, /en/…, sinon es). */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  if (seg === 'fr' || seg === 'en') return seg;
  return 'es';
}

/** Retourne une fonction t(clé) pour la langue donnée. */
export function useTranslations(lang: Lang) {
  const dict = ui[lang] ?? ui[DEFAULT_LANG];
  const fallback = ui[DEFAULT_LANG];
  return function t(key: string): string {
    return dict[key] ?? fallback[key] ?? key;
  };
}

/** Préfixe un chemin (écrit sans préfixe, façon "es") avec la langue. */
export function localizePath(path: string, lang: Lang): string {
  const clean = path === '/' ? '' : path.replace(/\/$/, '');
  if (lang === 'es') return clean || '/';
  return `/${lang}${clean}`;
}

/** Enlève le préfixe de langue d'un pathname pour retrouver le chemin "es". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/');
  if (parts[1] === 'fr' || parts[1] === 'en') {
    parts.splice(1, 1);
    const p = parts.join('/');
    return p === '' ? '/' : p;
  }
  return pathname || '/';
}
