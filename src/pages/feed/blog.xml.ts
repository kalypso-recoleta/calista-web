import type { APIRoute } from 'astro';
import { rssResponse } from '../../lib/rss';

/** Flux RSS du blog uniquement (https://calista.com.py/feed/blog.xml) — scénario Make « blog ». */
export const GET: APIRoute = ({ site }) =>
  rssResponse(site, {
    biens: false,
    blog: true,
    titulo: 'CALISTA Inmobiliaria — Blog',
    descripcion: 'Guías y actualidad inmobiliaria en Paraguay.',
  });
