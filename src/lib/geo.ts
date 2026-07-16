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

/** Cherche des coordonnées dans un texte HTML de Google Maps. */
function coordsEnHtml(html: string): LatLng | null {
  // 1) État interne de la page : [[[zoom, lng, lat], ...
  const init = html.match(
    /APP_INITIALIZATION_STATE=\[\[\[[\d.]+,(-?\d+\.\d+),(-?\d+\.\d+)\]/
  );
  if (init) {
    const lng = parseFloat(init[1]);
    const lat = parseFloat(init[2]);
    if (enRango(lat, lng)) return { lat, lng };
  }
  // 2) Image d'aperçu : staticmap?center=lat%2Clng
  const centro = html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
  if (centro) {
    const lat = parseFloat(centro[1]);
    const lng = parseFloat(centro[2]);
    if (enRango(lat, lng)) return { lat, lng };
  }
  // 3) Motifs génériques présents dans le HTML
  return parseGoogleMapsUrl(html);
}

/**
 * Résolution complète, utilisée AU BUILD (côté serveur) : si c'est un lien
 * court Google Maps, on le suit pour obtenir l'URL complète, puis on extrait
 * les coordonnées de l'URL finale ou du contenu de la page.
 * Toujours silencieux en cas d'échec (→ null, carte approximative) mais on
 * écrit une ligne dans le journal de build pour pouvoir diagnostiquer.
 */
export async function resolverUbicacion(
  value: string | undefined
): Promise<LatLng | null> {
  const directo = parseUbicacion(value);
  if (directo || !value || !esLinkCorto(value)) return directo;

  const url = value.trim();
  try {
    // On suit toutes les redirections automatiquement (gère aussi les
    // redirections relatives et multiples).
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        // Un navigateur "normal" : Google sert la page complète.
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        'Accept-Language': 'es-PY,es;q=0.9',
      },
    });

    // 1) L'URL finale contient souvent déjà les coordonnées
    const desdeUrlFinal = parseGoogleMapsUrl(res.url || '');
    if (desdeUrlFinal) return desdeUrlFinal;

    // 2) Page de consentement : la vraie cible est dans "continue="
    if (/consent\.google/i.test(res.url || '')) {
      const cont = (res.url || '').match(/[?&]continue=([^&]+)/);
      if (cont) {
        const objetivo = decodeURIComponent(cont[1]);
        const c = parseGoogleMapsUrl(objetivo);
        if (c) return c;
      }
    }

    // 3) Sinon, on fouille le HTML de la page
    const html = await res.text();
    const desdeHtml = coordsEnHtml(html);
    if (desdeHtml) return desdeHtml;

    console.warn(
      `[ubicacion] Link de Google Maps sin coordenadas detectables: ${url} → ${res.url}`
    );
  } catch (e) {
    console.warn(`[ubicacion] No se pudo resolver el link: ${url}`, e);
  }
  return null;
}

/**
 * Centres approximatifs des villes du Paraguay servies par l'agence.
 * Utilisés comme filet de sécurité : si une annonce n'a pas de point,
 * la carte se centre au moins sur la bonne ville (au lieu d'Asunción).
 */
export const coordsCiudad: Record<string, LatLng> = {
  'Asunción': { lat: -25.2867, lng: -57.647 },
  'Luque': { lat: -25.267, lng: -57.4872 },
  'San Lorenzo': { lat: -25.3397, lng: -57.5087 },
  'Lambaré': { lat: -25.3468, lng: -57.6063 },
  'Fernando de la Mora': { lat: -25.3196, lng: -57.5405 },
  'Mariano Roque Alonso': { lat: -25.2036, lng: -57.5323 },
  'Villa Elisa': { lat: -25.3703, lng: -57.5926 },
  'Ñemby': { lat: -25.3944, lng: -57.5355 },
  'San Antonio': { lat: -25.4227, lng: -57.5502 },
  'Capiatá': { lat: -25.3552, lng: -57.4453 },
  'Limpio': { lat: -25.1683, lng: -57.4938 },
  'Itauguá': { lat: -25.3928, lng: -57.3543 },
  'Areguá': { lat: -25.3122, lng: -57.3846 },
  'Ypacaraí': { lat: -25.4064, lng: -57.2892 },
  'San Bernardino': { lat: -25.3103, lng: -57.2957 },
  'Altos': { lat: -25.2536, lng: -57.2489 },
  'Emboscada': { lat: -25.1503, lng: -57.3453 },
  'Atyrá': { lat: -25.2833, lng: -57.1667 },
  'Caacupé': { lat: -25.3864, lng: -57.1409 },
  'Tobatí': { lat: -25.2622, lng: -57.0839 },
  'Piribebuy': { lat: -25.4914, lng: -57.0464 },
  'Paraguarí': { lat: -25.6222, lng: -57.1517 },
  'Itá': { lat: -25.5079, lng: -57.3661 },
  'Yaguarón': { lat: -25.5628, lng: -57.2872 },
  'Guarambaré': { lat: -25.4903, lng: -57.4622 },
  'Villeta': { lat: -25.5097, lng: -57.5613 },
  'Ciudad del Este': { lat: -25.5097, lng: -54.6111 },
  'Presidente Franco': { lat: -25.5628, lng: -54.6114 },
  'Hernandarias': { lat: -25.4056, lng: -54.6333 },
  'Minga Guazú': { lat: -25.4833, lng: -54.7583 },
  'Encarnación': { lat: -27.3306, lng: -55.8667 },
  'Coronel Oviedo': { lat: -25.4472, lng: -56.4406 },
  'Caaguazú': { lat: -25.4722, lng: -56.0139 },
  'Villarrica': { lat: -25.7503, lng: -56.4361 },
  'Pedro Juan Caballero': { lat: -22.5478, lng: -55.7328 },
  'Concepción': { lat: -23.4064, lng: -57.4344 },
  'Pilar': { lat: -26.8589, lng: -58.3028 },
  'San Juan Bautista': { lat: -26.6333, lng: -57.1667 },
  'San Ignacio': { lat: -26.8867, lng: -57.0283 },
  'Salto del Guairá': { lat: -24.06, lng: -54.3067 },
};
