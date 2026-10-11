import type { APIRoute } from 'astro';
import { rssResponse } from '../../lib/rss';

/**
 * Flux RSS complet (https://calista.com.py/feed/propiedades.xml) : biens + articles du blog.
 * Pour Facebook, Make utilise désormais /feed/biens.xml et /feed/blog.xml (voir src/lib/rss.ts).
 */
export const GET: APIRoute = ({ site }) =>
  rssResponse(site, {
    biens: true,
    blog: true,
    titulo: 'CALISTA Inmobiliaria — Propiedades',
    descripcion: 'Propiedades en venta, alquiler, alquiler temporal y desarrollos Kalypso en Asunción, y artículos del blog.',
  });
