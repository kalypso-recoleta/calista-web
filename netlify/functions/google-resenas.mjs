/**
 * Avis Google — fonction Netlify (exécutée côté serveur).
 * ───────────────────────────────────────────────────────────
 * Interroge Places API (New) pour la fiche CALISTA et renvoie au site
 * la note, le nombre d'avis et les avis (5 au maximum : limite de Google).
 *
 * La clé ne quitte jamais le serveur. Deux variables à définir dans
 * Netlify → Site configuration → Environment variables :
 *   GOOGLE_PLACES_API_KEY  la clé créée dans Google Cloud
 *   GOOGLE_PLACE_ID        l'identifiant de la fiche (ChIJ…)
 *
 * Pas de mise en cache : les règles de Google n'autorisent à conserver
 * que l'identifiant de la fiche, pas le contenu des avis.
 *
 * Plafond de coût : Google ne permet pas de baisser le quota journalier
 * de Places API (New). On compte donc nous-mêmes les appels du jour
 * (Netlify Blobs) : au-delà de LIMITE_DIARIA, on ne contacte plus Google
 * et le site affiche simplement les avis saisis à la main.
 * 30/jour ≈ 900/mois, sous les 1 000 appels gratuits mensuels de Google.
 */

import { getStore } from '@netlify/blobs';

const LIMITE_DIARIA = 30;

/** Renvoie true si on peut encore appeler Google aujourd'hui (et compte l'appel). */
async function cupoDisponible() {
  try {
    const store = getStore('google-resenas');
    const clave = `llamadas-${new Date().toISOString().slice(0, 10)}`; // jour UTC
    const n = Number((await store.get(clave)) ?? 0);
    if (n >= LIMITE_DIARIA) return false;
    await store.set(clave, String(n + 1));
    return true;
  } catch {
    // Si le compteur est indisponible, on ne bloque pas le site.
    return true;
  }
}

const LANGS = ['es', 'fr', 'en'];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });

export default async (req) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return json({ error: 'sin-configurar' }, 503);

  if (!(await cupoDisponible())) return json({ error: 'cupo-diario' }, 429);

  const pedido = new URL(req.url).searchParams.get('lang');
  const lang = LANGS.includes(pedido) ? pedido : 'es';

  let res;
  try {
    res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${lang}`,
      {
        headers: {
          'X-Goog-Api-Key': key,
          // Uniquement les champs utiles : on ne paie que ce qu'on demande.
          'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
        },
      }
    );
  } catch {
    return json({ error: 'red' }, 502);
  }
  // Quota du jour atteint, clé invalide… : le site garde ses avis habituels.
  if (!res.ok) return json({ error: 'google', status: res.status }, 502);

  const d = await res.json();
  const resenas = (d.reviews ?? [])
    .map((r) => ({
      estrellas: r.rating ?? 0,
      // Texte original de l'avis (pas la traduction automatique)
      texto: r.originalText?.text ?? r.text?.text ?? '',
      cuando: r.relativePublishTimeDescription ?? '',
      publicado: r.publishTime ?? '',
      autor: r.authorAttribution?.displayName ?? '',
      autorUrl: r.authorAttribution?.uri ?? '',
      foto: r.authorAttribution?.photoUri ?? '',
      url: r.googleMapsUri ?? '',
      reportar: r.flagContentUri ?? '',
    }))
    // Les plus récents d'abord
    .sort((a, b) => (b.publicado > a.publicado ? 1 : -1));

  return json({
    nota: d.rating ?? null,
    total: d.userRatingCount ?? null,
    url: d.googleMapsUri ?? '',
    resenas,
  });
};

export const config = { path: '/api/google-resenas' };
