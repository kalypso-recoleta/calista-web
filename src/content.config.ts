import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collection UNIQUE pour tous les biens.
 *
 * Principe clé : ta mère saisit chaque bien UNE seule fois ici.
 * Les pages (Comprar, Alquilar, Exclusivos, Desarrollos, Terrenos) ne sont
 * que des vues filtrées de cette même collection. Pas de double saisie.
 *
 *  - operacion   → Comprar (venta) / Alquilar (alquiler)
 *  - tipo=terreno → page Terrenos
 *  - exclusivo=true → page Exclusivos (un bien peut être en venta ET exclusif)
 *  - desarrollo=true → page Nuevos Desarrollos (pozo)
 *  - destacado=true → mis en avant sur la page d'accueil
 */
const biens = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/biens' }),
  schema: z.object({
    titulo: z.string(),

    // --- Classement (ce qui détermine sur quelles pages le bien apparaît) ---
    operacion: z.enum(['venta', 'alquiler']),
    tipo: z.enum([
      'casa',
      'departamento',
      'duplex',
      'terreno',
      'oficina',
      'local',
      'deposito',
      'quinta',
    ]),
    exclusivo: z.boolean().default(false),
    desarrollo: z.boolean().default(false),
    destacado: z.boolean().default(false),

    // --- État de disponibilité (permet d'archiver sans supprimer) ---
    estado: z
      .enum(['disponible', 'reservado', 'vendido', 'alquilado'])
      .default('disponible'),

    // --- Prix ---
    precio: z.number().nonnegative(),
    moneda: z.enum(['USD', 'PYG']).default('USD'),
    // Pour les locations : période. Ignoré pour une vente.
    periodo: z.enum(['mes', 'dia', 'total']).default('total'),

    // --- Localisation ---
    ciudad: z.string(),
    barrio: z.string().optional(),
    // Pin approximatif déposé sur la carte dans l'admin.
    // Format souple (GeoJSON, "lat,lng" ou objet) — voir src/lib/geo.ts
    ubicacion: z.string().optional(),

    // --- Caractéristiques (toutes optionnelles : un terrain n'a pas de chambres) ---
    dormitorios: z.number().int().nonnegative().optional(),
    banos: z.number().int().nonnegative().optional(),
    cocheras: z.number().int().nonnegative().optional(),
    superficie_terreno: z.number().nonnegative().optional(),
    superficie_construida: z.number().nonnegative().optional(),

    // --- Spécifique aux développements / pozo ---
    entrega: z.string().optional(), // ex. "Diciembre 2026"
    financiacion: z.boolean().optional(),

    // --- Médias (URLs Cloudinary — JAMAIS dans Git) ---
    imagenes: z.array(z.string()).default([]),

    // --- Texte ---
    descripcion: z.string(), // résumé court : cartes + aperçu de partage
    // Tolère un champ vide/null venant du CMS → date du jour par défaut.
    fecha: z
      .preprocess(
        (v) => (v === '' || v === null ? undefined : v),
        z.coerce.date()
      )
      .default(() => new Date()),
  }),
});

/**
 * Avis clients (reseñas). Gérés depuis l'admin par ta mère.
 * Affichés sur l'accueil (les "destacada") et sur la page /resenas.
 */
const resenas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resenas' }),
  schema: z.object({
    nombre: z.string(),
    contexto: z.string().optional(), // ex. "Compró una casa en Luque"
    estrellas: z.number().int().min(1).max(5).default(5),
    destacada: z.boolean().default(false), // mise en avant sur l'accueil
    texto: z.string(),
    fecha: z
      .preprocess(
        (v) => (v === '' || v === null ? undefined : v),
        z.coerce.date()
      )
      .default(() => new Date()),
  }),
});

export const collections = { biens, resenas };
