import type { APIRoute } from 'astro';
import { rssResponse } from '../../lib/rss';

/** Flux RSS des biens uniquement (https://calista.com.py/feed/biens.xml) — scénario Make « biens ». */
export const GET: APIRoute = ({ site }) =>
  rssResponse(site, {
    biens: true,
    blog: false,
    titulo: 'CALISTA Inmobiliaria — Propiedades',
    descripcion: 'Propiedades en venta, alquiler, alquiler temporal y desarrollos Kalypso en Asunción.',
  });
