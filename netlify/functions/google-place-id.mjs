/**
 * OUTIL TEMPORAIRE — trouver l'identifiant (Place ID) de la fiche Google.
 * ───────────────────────────────────────────────────────────
 * Ouvrir : https://www.calista.com.py/api/google-place-id
 *          (ou ?q=autre+recherche pour chercher autre chose)
 * La page liste les fiches trouvées avec leur identifiant « ChIJ… ».
 * Copier le bon dans Netlify (variable GOOGLE_PLACE_ID), puis
 * SUPPRIMER ce fichier : il ne sert qu'une fois.
 */

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const page = (body, status = 200) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Place ID</title>
<style>body{font:16px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem;color:#212b35}
h1{font-size:1.3rem;color:#3e0055}li{margin:0 0 1rem;padding:1rem;border:1px solid #e6e6ea;border-top:4px solid #3e0055;border-radius:4px;list-style:none}
code{display:inline-block;margin-top:.3rem;padding:.3rem .5rem;background:#f7f2f9;border-radius:4px;font-size:15px;user-select:all}
ul{padding:0}form{margin:1rem 0}input{padding:.5rem;width:70%}button{padding:.5rem 1rem}</style>${body}`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );

export default async (req) => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return page('<h1>Falta la variable GOOGLE_PLACES_API_KEY en Netlify.</h1>', 503);

  const q = new URL(req.url).searchParams.get('q') || 'CALISTA Inmobiliaria Asunción';
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.googleMapsUri',
    },
    body: JSON.stringify({ textQuery: q, languageCode: 'es' }),
  });
  const form = `<form><input name="q" value="${esc(q)}"><button>Buscar</button></form>`;
  if (!res.ok) {
    const txt = await res.text();
    return page(`<h1>Error de Google (${res.status})</h1>${form}<pre>${esc(txt).slice(0, 1500)}</pre>`, 502);
  }
  const d = await res.json();
  const items = (d.places ?? [])
    .map(
      (p) => `<li><strong>${esc(p.displayName?.text)}</strong><br>${esc(p.formattedAddress)}<br>
      <code>${esc(p.id)}</code> ${p.googleMapsUri ? `· <a href="${esc(p.googleMapsUri)}" target="_blank" rel="noopener">ver en Google Maps</a>` : ''}</li>`
    )
    .join('');
  return page(`<h1>Fichas encontradas para « ${esc(q)} »</h1>${form}<ul>${items || '<li>Ningún resultado. Probá otra búsqueda.</li>'}</ul>`);
};

export const config = { path: '/api/google-place-id' };
