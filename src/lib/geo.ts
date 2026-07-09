/**
 * Le champ "ubicacion" est rempli dans l'admin. Pour que ce soit simple
 * pour l'utilisatrice, on accepte TOUTES ces formes :
 *   - Lien Google Maps court (Partager) : https://maps.app.goo.gl/xxxx
 *     → résolu au moment du build (on suit la redirection côté serveur).
 *   - URL Google Maps complète (barre d'adresse) : .../@-25.29,-57.63,17z/...
 *   - "lat,lng" : '-25.29,-57.63'
 *   - GeoJSON : '{"type":"Point","coordinates":[-57.63,-25.29]}'
 * Si rien n'est lisible, on renvoie null et la carte affiche le centre-ville.
 */
export type LatLng = { lat: number; lng: number };

const enRango = (lat: number, lng: number) =>
  isFinite(lat) && isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;

/** Extrait des coordonnées d'une URL Google Maps COMPLÈTE. */
function parseGoogleMapsUrl(url: string): LatLng | null {
  const decoded = decodeURIComponent(url);

  // 1) Pin exact d'un lieu : "!3d<lat>!4d<lng>" (le plus précis)
  const pin = decoded.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (pin) {
    const lat = parseFloat(pin[1]);
    const lng = parseFloat(pin[2]);
    if (enRango(lat, lng)) return { lat, lng };
  }

  // 2) Paramètres q= / ll= / query= / center= / destination= "lat,lng"
  const param = decoded.match(
    /[?&](?:q|ll|query|center|destination)=(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/
  );
  if (param) {
    const lat = parseFloat(param[1]);
    const lng = parseFloat(param[2]);
    if (enRango(lat, lng)) return { lat, lng };
  }

  // 3) Centre de la vue : "@<lat>,<lng>,17z"
  const at = decoded.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) {
    const lat = parseFloat(at[1]);
    const lng = parseFloat(at[2]);
    if (enRango(lat, lng)) return { lat, lng };
  }

  return null;
}

/** Lecture synchrone : coordonnées, GeoJSON, ou URL Google Maps complète. */
export function parseUbicacion(value: string | undefined): LatLng | null {
  if (!value) return null;
  const trimmed = value.trim();

  // Cas 1 : GeoJSON
  if (trimmed.startsWith('{')) {
    try {
      const geo = JSON.parse(trimmed);
      const coords = geo?.coordinates ?? geo?.geometry?.coordinates;
      if (Array.isArray(coords) && coords.length >= 2) {
        // GeoJSON = [lng, lat]
        const [lng, lat] = coords;
        if (enRango(lat, lng)) return { lat, lng };
      }
    } catch {
      /* on tente le format suivant */
    }
  }

  // Cas 2 : URL Google Maps complète
  if (/^https?:\/\//i.test(trimmed)) {
    const desdeUrl = parseGoogleMapsUrl(trimmed);
    if (desdeUrl) return desdeUrl;
    return null; // URL sans coordonnées (ex. lien court) → voir resolverUbicacion
  }

  // Cas 3 : "lat,lng"
  const parts = trimmed.split(',').map((p) => parseFloat(p.trim()));
  if (parts.length === 2 && parts.every((n) => isFinite(n))) {
    if (enRango(parts[0], parts[1])) return { lat: parts[0], lng: parts[1] };
  }

  return null;
}

const esLinkCorto = (v: string) =>
  /^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|g\.co\/kgs)\//i.test(v.trim());

/**
 * Résolution complète, utilisée AU BUILD (côté serveur, pas dans le
 * navigateur) : si c'est un lien court Google Maps, on suit la redirection
 * pour obtenir l'URL complète, puis on en extrait les coordonnées.
 * Toujours silencieux en cas d'échec (→ null, la carte reste approximative).
 */
export async function resolverUbicacion(
  value: string | undefined
): Promise<LatLng | null> {
  const directo = parseUbicacion(value);
  if (directo || !value || !esLinkCorto(value)) return directo;

  try {
    let url = value.trim();
    // On suit jusqu'à 3 redirections à la main pour lire les URLs intermédiaires.
    for (let i = 0; i < 3; i++) {
      const res = await fetch(url, { redirect: 'manual' });
      const destino = res.headers.get('location');
      if (!destino) {
        // Certaines réponses finales contiennent l'URL complète dans le HTML.
        const html = await res.text();
        const enHtml = parseGoogleMapsUrl(html);
        return enHtml;
      }
      // Page de consentement Google : la vraie cible est dans "continue="
      const cont = destino.match(/[?&]continue=([^&]+)/);
      url = cont ? decodeURIComponent(cont[1]) : destino;
      const coords = parseGoogleMapsUrl(url);
      if (coords) return coords;
    }
  } catch {
    /* réseau indisponible au build → carte approximative */
  }
  return null;
}
