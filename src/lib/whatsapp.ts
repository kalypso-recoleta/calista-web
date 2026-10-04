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
