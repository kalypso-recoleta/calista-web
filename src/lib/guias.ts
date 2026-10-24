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
};

/** Thèmes qui ont au moins un article publié (les autres n'ont pas de page) */
export async function temasConArticulos(): Promise<Tema[]> {
  const usados = new Set((await guiasPublicadas()).map((g) => g.entry.data.tema));
  return TEMAS.filter((t) => usados.has(t));
}
