import { site } from './site';

/**
 * Optimise une URL d'image Cloudinary à la volée :
 * redimensionne, compresse et sert en WebP/AVIF automatiquement.
 * Les images restent sur Cloudinary — jamais dans Git.
 *
 * Les chemins locaux (/uploads/…) passent par le Netlify Image CDN en production.
 * Les URLs externes sont renvoyées telles quelles.
 */
export function img(
  url: string | undefined,
  opts: { w?: number; h?: number; crop?: 'fill' | 'fit' } = {}
): string {
  if (!url) return '/placeholder.svg';

  const { w = 800, h, crop = 'fill' } = opts;

  // Images locales (ex. /uploads/… ajoutées depuis le CMS) : en production,
  // on les fait passer par le Netlify Image CDN, qui les redimensionne et
  // les sert en WebP compressé. En local (astro dev), on garde le fichier brut.
  if (url.startsWith('/') && !url.startsWith('//') && !/\.svg$/i.test(url)) {
    if (!import.meta.env.PROD) return url;
    const params = new URLSearchParams({ url, w: String(w), fm: 'webp', q: '75' });
    if (h) {
      params.set('h', String(h));
      params.set('fit', crop === 'fit' ? 'contain' : 'cover');
    }
    return `/.netlify/images?${params.toString()}`;
  }

  // N'optimise que les URLs Cloudinary "/upload/"
  const marker = '/upload/';
  if (!url.includes('res.cloudinary.com') || !url.includes(marker)) {
    return url;
  }

  const tx = [
    'f_auto', // format auto (WebP/AVIF)
    'q_auto', // qualité auto
    `w_${w}`,
    h ? `h_${h}` : '',
    h ? `c_${crop}` : '',
    'dpr_auto',
  ]
    .filter(Boolean)
    .join(',');

  return url.replace(marker, `${marker}${tx}/`);
}

/** Construit une URL Cloudinary à partir d'un public_id (si jamais utile). */
export function cloudinaryUrl(publicId: string): string {
  return `https://res.cloudinary.com/${site.cloudinaryCloudName}/image/upload/${publicId}`;
}
