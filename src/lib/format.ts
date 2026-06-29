import type { CollectionEntry } from 'astro:content';
import { useTranslations, type Lang } from '../i18n/utils';

type Bien = CollectionEntry<'biens'>['data'];

const LOCALE_NUM: Record<Lang, string> = {
  es: 'es-PY',
  fr: 'fr-FR',
  en: 'en-US',
};

/** Prix formaté avec devise. */
export function formatPrecio(bien: Bien, lang: Lang): string {
  const t = useTranslations(lang);
  const numero = new Intl.NumberFormat(LOCALE_NUM[lang], {
    maximumFractionDigits: 0,
  }).format(bien.precio);

  const etiquetaMoneda = bien.moneda === 'USD' ? 'USD' : 'Gs.';
  let texto = `${etiquetaMoneda} ${numero}`;

  if (bien.operacion === 'alquiler' && bien.periodo === 'mes')
    texto += ' ' + t('periodo.mes');
  if (bien.operacion === 'alquiler' && bien.periodo === 'dia')
    texto += ' ' + t('periodo.dia');

  return texto;
}

export const tipoLabel = (tipo: Bien['tipo'], lang: Lang) =>
  useTranslations(lang)(`tipo.${tipo}`);
export const operacionLabel = (op: Bien['operacion'], lang: Lang) =>
  useTranslations(lang)(`op.${op}`);
export const estadoLabel = (estado: Bien['estado'], lang: Lang) =>
  useTranslations(lang)(`estado.${estado}`);

/** Un bien est-il encore proposé activement ? */
export const estaActivo = (bien: Bien) =>
  bien.estado === 'disponible' || bien.estado === 'reservado';

/** Surface affichable. */
export function formatSuperficie(bien: Bien, lang: Lang): string | null {
  const t = useTranslations(lang);
  if (bien.tipo === 'terreno' && bien.superficie_terreno) {
    return `${bien.superficie_terreno} ${t('unit.terreno')}`;
  }
  if (bien.superficie_construida) {
    return `${bien.superficie_construida} ${t('unit.construidos')}`;
  }
  if (bien.superficie_terreno) {
    return `${bien.superficie_terreno} ${t('unit.m2')}`;
  }
  return null;
}

/** Localisation lisible : "Villa Morra, Asunción". */
export function formatUbicacion(bien: Bien): string {
  return [bien.barrio, bien.ciudad].filter(Boolean).join(', ');
}
