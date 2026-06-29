/**
 * Le champ "ubicacion" vient du sélecteur de carte de Sveltia CMS.
 * Selon la config, il peut arriver sous plusieurs formes. Ce parseur
 * accepte tout, pour que le build ne casse jamais :
 *   - GeoJSON : '{"type":"Point","coordinates":[-57.63,-25.29]}'
 *   - "lat,lng" : '-25.29,-57.63'
 *   - objet déjà parsé
 */
export type LatLng = { lat: number; lng: number };

export function parseUbicacion(value: string | undefined): LatLng | null {
  if (!value) return null;

  // Cas 1 : GeoJSON
  const trimmed = value.trim();
  if (trimmed.startsWith('{')) {
    try {
      const geo = JSON.parse(trimmed);
      const coords = geo?.coordinates ?? geo?.geometry?.coordinates;
      if (Array.isArray(coords) && coords.length >= 2) {
        // GeoJSON = [lng, lat]
        const [lng, lat] = coords;
        if (isFinite(lat) && isFinite(lng)) return { lat, lng };
      }
    } catch {
      /* on tente le format suivant */
    }
  }

  // Cas 2 : "lat,lng"
  const parts = trimmed.split(',').map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && parts.every((n) => isFinite(n))) {
    return { lat: parts[0], lng: parts[1] };
  }

  return null;
}
