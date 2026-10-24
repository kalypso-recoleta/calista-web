import { site } from './site';

/**
 * Construit un lien wa.me avec un message pré-rempli.
 * WhatsApp est LE canal de contact dominant au Paraguay → présent partout.
 */
export function whatsappLink(mensaje?: string, numero: string = site.whatsapp): string {
  const base = `https://wa.me/${numero}`;
  if (!mensaje) return base;
  return `${base}?text=${encodeURIComponent(mensaje)}`;
}

/** Lien WhatsApp contextualisé pour un bien précis (inclut la référence). */
export function whatsappBien(opts: {
  titulo: string;
  ref: string;
  url?: string;
}): string {
  const partes = [
    `Hola, me interesa la propiedad "${opts.titulo}" (ref. ${opts.ref}).`,
    opts.url ? `\n${opts.url}` : '',
    `\n¿Podrían darme más información?`,
  ];
  return whatsappLink(partes.join(''));
}

/**
 * Pages « propriétaires » (et Historia / Alquiler temporal) : numéro d'Hélène.
 * Toutes les autres pages : numéro général. `basePath` = chemin sans langue (ex. "/administracion").
 */
const RUTAS_HELENE = ['/administracion', '/propietarios', '/tasaciones', '/historia', '/alquiler-temporal'];
export function esRutaPropietario(basePath: string): boolean {
  return RUTAS_HELENE.some((r) => basePath === r || basePath.startsWith(r + '/'));
}
export function numeroPorRuta(basePath: string): string {
  return esRutaPropietario(basePath) ? site.whatsappTemporal : site.whatsapp;
}
