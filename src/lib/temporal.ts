/**
 * Outils de dates pour l'alquiler temporal.
 * On raisonne en « numéros de jour » (jours depuis 1970, en UTC) pour éviter
 * tout décalage d'heure / de fuseau. Une réservation occupe les nuits
 * [desde, hasta[ : le jour « hasta » (départ) est de nouveau libre.
 */
export const DIA_MS = 864e5;

export type Rango = { d: number; h: number };

/** "2026-10-10" → numéro de jour */
export function aDia(iso: string): number {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return Date.UTC(y, m - 1, d) / DIA_MS;
}

/** numéro de jour → "2026-10-10" */
export const aIso = (dia: number) => new Date(dia * DIA_MS).toISOString().slice(0, 10);

/** Aujourd'hui (date locale du visiteur) en numéro de jour */
export function hoy(): number {
  const n = new Date();
  return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) / DIA_MS;
}

/** Réservations (texte JSON de la page) → plages triées */
export function leerRangos(json: string | undefined): Rango[] {
  try {
    const arr = JSON.parse(json || '[]') as { d: string; h: string }[];
    return arr
      .map((r) => ({ d: aDia(r.d), h: aDia(r.h) }))
      .filter((r) => r.h > r.d)
      .sort((a, b) => a.d - b.d);
  } catch {
    return [];
  }
}

/** La nuit du jour `dia` est-elle occupée ? */
export const noche = (rangos: Rango[], dia: number) => rangos.some((r) => dia >= r.d && dia < r.h);

/** État du jour : loué ou non, et date à laquelle il redevient libre */
export function estadoHoy(rangos: Rango[], dia = hoy()): { alquilado: boolean; libre?: number } {
  if (!noche(rangos, dia)) return { alquilado: false };
  let fin = dia;
  // enchaîne les réservations qui se suivent ou se chevauchent
  while (noche(rangos, fin)) {
    const r = rangos.filter((x) => fin >= x.d && fin < x.h);
    fin = Math.max(...r.map((x) => x.h));
  }
  return { alquilado: true, libre: fin };
}

/** Ajoute n mois à un jour (même quantième, plafonné en fin de mois) */
export function masMeses(dia: number, n: number): number {
  const f = new Date(dia * DIA_MS);
  const y = f.getUTCFullYear();
  const m = f.getUTCMonth() + n;
  const ultimo = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(f.getUTCDate(), ultimo)) / DIA_MS;
}

/** "10/10/2026" (format lisible, langue du visiteur) */
export const fechaCorta = (dia: number, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(dia * DIA_MS)
  );
