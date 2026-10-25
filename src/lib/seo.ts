/**
 * Titres et descriptions pour Google (balises <title> et meta description).
 * Google coupe les titres au-delà d'environ 60 caractères et les descriptions
 * au-delà d'environ 155-160 : on génère des versions courtes, sans toucher
 * au titre affiché sur la page.
 */
import type { CollectionEntry } from 'astro:content';
import { useTranslations, type Lang } from '../i18n/utils';
import { formatPrecio } from './format';

type Bien = CollectionEntry<'biens'>['data'];

const DORM: Record<Lang, string> = { es: 'dorm.', fr: 'ch.', en: 'bed' };
const minuscula = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** Ex. « Departamento 2 dorm. en alquiler, Recoleta – Gs. 5.500.000 /mes » */
export function tituloBien(b: Bien, lang: Lang): string {
  const t = useTranslations(lang);
  const partes = [t(`tipo.${b.tipo}`)];
  if (b.dormitorios) partes.push(`${b.dormitorios} ${DORM[lang]}`);
  if (b.tipo === 'terreno' && b.superficie_terreno) partes.push(`${b.superficie_terreno} m²`);
  if (b.operacion === 'venta' || b.operacion === 'alquiler') partes.push(minuscula(t(`op.${b.operacion}`)));
  let titulo = partes.join(' ');
  const zona = b.barrio || b.ciudad;
  if (zona) titulo += `, ${zona}`;
  if (b.precio > 0) titulo += ` – ${formatPrecio(b, lang)}`;
  return titulo;
}

/** Ex. « Alquiler temporal amoblado 1 dorm., Mburucuyá » */
export function tituloTemporal(d: { dormitorios?: number; barrio?: string; ciudad: string }, lang: Lang): string {
  const base = { es: 'Alquiler temporal amoblado', fr: 'Location meublée temporaire', en: 'Furnished short-term rental' }[lang];
  let titulo = base;
  if (d.dormitorios) titulo += ` ${d.dormitorios} ${DORM[lang]}`;
  const zona = d.barrio || d.ciudad;
  if (zona) titulo += `, ${zona}`;
  return titulo;
}

/** Coupe un texte à `max` caractères sur une fin de mot, avec « … ». Retire le markdown simple. */
export function recortar(texto: string, max = 155): string {
  const limpio = texto.replace(/[*_#>`]/g, '').replace(/\s+/g, ' ').trim();
  if (limpio.length <= max) return limpio;
  const corte = limpio.slice(0, max - 1);
  const espacio = corte.lastIndexOf(' ');
  return (espacio > max * 0.6 ? corte.slice(0, espacio) : corte).replace(/[\s,;:.–-]+$/, '') + '…';
}
