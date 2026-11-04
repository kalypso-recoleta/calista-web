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
 * 30 appels Google/jour ≈ 900/mois, sous les 1 000 appels gratuits mensuels de Google.
 * Chaque visite qui charge les avis consomme 2 appels (espagnol + anglais),
 * donc environ 15 visites par jour reçoivent les avis Google ; au-delà, les
 * avis saisis à la main s'affichent.
 */

import { getStore } from '@netlify/blobs';

const LIMITE_DIARIA = 30;

/** Renvoie true si on peut encore appeler Google aujourd'hui (et compte les appels). */
async function cupoDisponible(llamadas = 1) {
  try {
    const store = getStore('google-resenas');
    const clave = `llamadas-${new Date().toISOString().slice(0, 10)}`; // jour UTC
    const n = Number((await store.get(clave)) ?? 0);
    if (n + llamadas > LIMITE_DIARIA) return false;
    await store.set(clave, String(n + llamadas));
    return true;
  } catch {
    // Si le compteur est indisponible, on ne bloque pas le site.
    return true;
  }
}

const LANGS = ['es', 'fr', 'en', 'pt'];

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

  if (!(await cupoDisponible(2))) return json({ error: 'cupo-diario' }, 429);

  const pedido = new URL(req.url).searchParams.get('lang');
  const lang = LANGS.includes(pedido) ? pedido : 'es';

  // Google ne renvoie que 5 avis par appel, choisis selon la langue demandée.
  // Pour afficher des avis de toutes les langues sur toutes les pages, on
  // interroge Google en espagnol ET en anglais (2 appels), puis on fusionne.
  // L'avis est toujours affiché dans sa langue d'origine.
  const IDIOMAS_GOOGLE = ['es', 'en'];

  const llamar = async (idioma) => {
    const r = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${idioma}`,
      {
        headers: {
          'X-Goog-Api-Key': key,
          // Uniquement les champs utiles : on ne paie que ce qu'on demande.
          'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
        },
      }
    );
    if (!r.ok) throw new Error(`google ${r.status}`);
    return r.json();
  };

  let respuestas;
  try {
    respuestas = await Promise.allSettled(IDIOMAS_GOOGLE.map(llamar));
  } catch {
    return json({ error: 'red' }, 502);
  }
  const ok = respuestas.filter((x) => x.status === 'fulfilled').map((x) => x.value);
  // Quota du jour atteint, clé invalide… : le site garde ses avis habituels.
  if (!ok.length) return json({ error: 'google' }, 502);
  const d = ok[0];

  const vistos = new Set();
  const resenas = ok
    .flatMap((x) => x.reviews ?? [])
    .map((r) => ({
      estrellas: r.rating ?? 0,
      // Texte original de l'avis (pas la traduction automatique)
      texto: r.originalText?.text ?? r.text?.text ?? '',
      idioma: (r.originalText?.languageCode ?? '').slice(0, 2),
      cuando: r.relativePublishTimeDescription ?? '',
      publicado: r.publishTime ?? '',
      autor: r.authorAttribution?.displayName ?? '',
      autorUrl: r.authorAttribution?.uri ?? '',
      foto: r.authorAttribution?.photoUri ?? '',
      url: r.googleMapsUri ?? '',
      reportar: r.flagContentUri ?? '',
    }))
    // Un même avis peut revenir dans les deux appels : on le garde une fois
    .filter((r) => {
      const id = r.url || `${r.autor}|${r.publicado}`;
      if (vistos.has(id)) return false;
      vistos.add(id);
      return true;
    })
    // D'abord les avis écrits dans la langue de la page, puis les plus récents
    .sort((a, b) => (b.idioma === lang) - (a.idioma === lang) || (b.publicado > a.publicado ? 1 : -1));

  return json({
    nota: d.rating ?? null,
    total: d.userRatingCount ?? null,
    url: d.googleMapsUri ?? '',
    resenas,
  });
};

export const config = { path: '/api/google-resenas' };
