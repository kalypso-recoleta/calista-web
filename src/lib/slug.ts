/**
 * Transforme l'identifiant d'une annonce (issu du titre, avec accents et
 * symboles) en adresse web propre et universelle.
 * Ex. : "¡exclusivo!-departamento-1-dorm.-en-las-lomas"
 *   →  "exclusivo-departamento-1-dorm-en-las-lomas"
 * "casa-—-250-m²-piscina" → "casa-250-m2-piscina"
 * Indispensable : les caractères spéciaux dans les URLs provoquent des
 * erreurs 404 selon les navigateurs/serveurs.
 */
export function slugify(id: string): string {
  return id
    .normalize('NFKD') // décompose é→e+́ , ²→2
    .replace(/[\u0300-\u036f]/g, '') // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // tout le reste devient un tiret
    .replace(/^-+|-+$/g, '') // pas de tiret en début/fin
    .replace(/-{2,}/g, '-'); // jamais deux tirets de suite
}
