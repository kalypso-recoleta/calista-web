import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';
import { localizePath, type Lang } from '../i18n/utils';

/** Articles du blog publiés (« borrador » décoché), les plus récents d'abord */
export async function guiasPublicadas() {
  const g = await getCollection('guias', (x) => !x.data.borrador);
  return g.sort((a, b) => +b.data.fecha - +a.data.fecha).map((entry) => ({ entry, slug: slugify(entry.id) }));
}

/**
 * Adresse d'un article dans une langue (SEO : adresse traduite).
 * - espagnol : nom du fichier ;
 * - fr / en / pt : champ « Dirección web » de la traduction s'il est rempli, sinon le titre traduit ;
 * - article pas encore traduit (texte vide dans cette langue) : même adresse que l'espagnol.
 * Les anciennes adresses (slug espagnol sous /fr/, /en/, /pt/) redirigent en 301 vers la nouvelle
 * (redirections générées au build, voir integrations/seo-postbuild.mjs).
 */
export function slugGuia(entry: CollectionEntry<'guias'>, lang: Lang | string): string {
  const base = slugify(entry.id);
  if (lang === 'es') return base;
  const tr = (entry.data as unknown as Record<string, { titulo?: string; slug?: string; cuerpo?: string } | undefined>)[lang];
  if (!tr?.cuerpo?.trim()) return base;
  const fuente = tr.slug?.trim() || tr.titulo?.trim();
  return fuente ? slugify(fuente) || base : base;
}

/** Lien vers un article dans une langue (avec « / » final, adresse servie par Netlify) */
export function hrefGuia(entry: CollectionEntry<'guias'>, lang: Lang): string {
  return localizePath(`/blog/${slugGuia(entry, lang)}`, lang) + '/';
}

/** Adresses de l'article dans les 4 langues (balises hreflang et sélecteur de langue) */
export function alternosGuia(entry: CollectionEntry<'guias'>): Record<Lang, string> {
  return { es: hrefGuia(entry, 'es'), fr: hrefGuia(entry, 'fr'), en: hrefGuia(entry, 'en'), pt: hrefGuia(entry, 'pt') };
}

/** Nom des catégories, par langue */
export type Categoria = 'guia' | 'actualidad' | 'opinion';
export const CATEGORIAS: Record<string, Record<Categoria, string>> = {
  es: { guia: 'Guías', actualidad: 'Actualidad', opinion: 'La mirada de CALISTA' },
  fr: { guia: 'Guides', actualidad: 'Actualité', opinion: 'Le regard de CALISTA' },
  en: { guia: 'Guides', actualidad: 'News', opinion: 'CALISTA’s view' },
  pt: { guia: 'Guias', actualidad: 'Notícias', opinion: 'O olhar da CALISTA' },
};
/** Ordre des catégories (boutons de filtre du blog) */
export const ORDEN_CATEGORIAS: Categoria[] = ['guia', 'actualidad', 'opinion'];

/** « Lo esencial » de l'article dans une langue (vide si la traduction n'en a pas : jamais l'espagnol sous un texte traduit) */
export function esencialGuia(entry: CollectionEntry<'guias'>, lang: string): string[] {
  const d = entry.data as unknown as { esencial?: string[] } & Record<string, { esencial?: string[]; cuerpo?: string } | undefined>;
  if (lang === 'es') return d.esencial ?? [];
  const tr = d[lang];
  if (tr?.cuerpo?.trim()) return tr.esencial ?? [];
  return d.esencial ?? []; // article non traduit : texte espagnol, donc encadré espagnol
}

/** Thèmes du blog (une page par thème : /blog/tema/<clé>). L'ordre = ordre d'affichage. */
export const TEMAS = ['comprar', 'alquilar', 'invertir', 'propietarios', 'vivir', 'mercado'] as const;
export type Tema = (typeof TEMAS)[number];

/** Nom et présentation de chaque thème, par langue */
export const TEMA_TXT: Record<string, Record<Tema, { n: string; d: string }>> = {
  es: {
    comprar: { n: 'Comprar', d: 'Pasos, contratos, financiación y puntos a revisar para comprar un inmueble en Paraguay.' },
    alquilar: { n: 'Alquilar', d: 'Alquiler tradicional o temporal: contratos, garantías y gestión, del lado del inquilino y del propietario.' },
    invertir: { n: 'Invertir', d: 'Rentabilidad real, comprar para alquilar y cómo evaluar una inversión inmobiliaria.' },
    propietarios: { n: 'Propietarios', d: 'Vender, tasar y administrar tu inmueble: lo que conviene saber.' },
    vivir: { n: 'Vivir en Paraguay', d: 'Para extranjeros que se instalan o invierten en Paraguay.' },
    mercado: { n: 'Mercado', d: 'Precios, tendencias, dólar y crédito: nuestra lectura del mercado inmobiliario.' },
  },
  fr: {
    comprar: { n: 'Acheter', d: 'Étapes, contrats, financement et points à vérifier pour acheter un bien au Paraguay.' },
    alquilar: { n: 'Louer', d: 'Location classique ou temporaire : contrats, garanties et gestion, côté locataire comme côté propriétaire.' },
    invertir: { n: 'Investir', d: 'Rendement réel, acheter pour louer et comment évaluer un investissement immobilier.' },
    propietarios: { n: 'Propriétaires', d: 'Vendre, faire estimer et gérer votre bien : ce qu’il faut savoir.' },
    vivir: { n: 'Vivre au Paraguay', d: 'Pour les étrangers qui s’installent ou investissent au Paraguay.' },
    mercado: { n: 'Marché', d: 'Prix, tendances, dollar et crédit : notre lecture du marché immobilier.' },
  },
  en: {
    comprar: { n: 'Buying', d: 'Steps, contracts, financing and what to check when buying property in Paraguay.' },
    alquilar: { n: 'Renting', d: 'Long-term or short-term rentals: contracts, guarantees and management, for tenants and landlords.' },
    invertir: { n: 'Investing', d: 'Real returns, buy-to-let and how to assess a real estate investment.' },
    propietarios: { n: 'Owners', d: 'Selling, valuing and managing your property: what you should know.' },
    vivir: { n: 'Living in Paraguay', d: 'For foreigners settling or investing in Paraguay.' },
    mercado: { n: 'Market', d: 'Prices, trends, the dollar and credit: our reading of the real estate market.' },
  },
  pt: {
    comprar: { n: 'Comprar', d: 'Etapas, contratos, financiamento e pontos a verificar para comprar um imóvel no Paraguai.' },
    alquilar: { n: 'Alugar', d: 'Aluguel tradicional ou temporário: contratos, garantias e gestão, do lado do inquilino e do proprietário.' },
    invertir: { n: 'Investir', d: 'Rentabilidade real, comprar para alugar e como avaliar um investimento imobiliário.' },
    propietarios: { n: 'Proprietários', d: 'Vender, avaliar e administrar o seu imóvel: o que é bom saber.' },
    vivir: { n: 'Morar no Paraguai', d: 'Para estrangeiros que se mudam ou investem no Paraguai.' },
    mercado: { n: 'Mercado', d: 'Preços, tendências, dólar e crédito: a nossa leitura do mercado imobiliário.' },
  },
};

/** Thèmes qui ont au moins un article publié (les autres n'ont pas de page) */
export async function temasConArticulos(): Promise<Tema[]> {
  const usados = new Set((await guiasPublicadas()).map((g) => g.entry.data.tema));
  return TEMAS.filter((t) => usados.has(t));
}
