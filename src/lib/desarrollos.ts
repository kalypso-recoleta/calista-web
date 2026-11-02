/**
 * Un bien « desarrollo » est un programme Kalypso (le nôtre, El Solar SRL)
 * quand le champ promotor est vide ou mentionne El Solar / Kalypso.
 * Sinon, c'est un programme d'un autre promoteur commercialisé par CALISTA.
 */
export function esKalypso(d: { desarrollo?: boolean; promotor?: string }): boolean {
  if (!d.desarrollo) return false;
  const p = (d.promotor ?? '').trim();
  return p === '' || /el\s*solar|kalypso/i.test(p);
}
