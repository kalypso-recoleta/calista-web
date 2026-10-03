import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Le CMS (Sveltia) écrit `null` ou `''` quand un champ optionnel est laissé
 * vide. Ces helpers convertissent ces valeurs en `undefined` pour que le
 * schéma les accepte sans casser le build.
 */
const vacio = (v: unknown) => (v === '' || v === null ? undefined : v);
const numOpc = () =>
  z.preprocess(vacio, z.coerce.number().nonnegative().optional());
const entOpc = () =>
  z.preprocess(vacio, z.coerce.number().int().nonnegative().optional());
const strOpc = () => z.preprocess(vacio, z.string().optional());
const boolOpc = () => z.preprocess(vacio, z.coerce.boolean().optional());

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
    // ⭐ Une seule annonce cochée "portada" = la grande image de l'accueil
    portada: boolOpc(),

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
    barrio: strOpc(),
    // Pin approximatif déposé sur la carte dans l'admin.
    // Format souple (GeoJSON, "lat,lng" ou objet) — voir src/lib/geo.ts
    ubicacion: strOpc(),

    // --- Caractéristiques (toutes optionnelles : un terrain n'a pas de chambres) ---
    dormitorios: entOpc(),
    banos: entOpc(),
    cocheras: entOpc(),
    superficie_terreno: numOpc(),
    superficie_construida: numOpc(),

    // --- Spécifique aux développements / pozo ---
    entrega: strOpc(), // ex. "Diciembre 2026"
    financiacion: boolOpc(),
    // Si renseigné, la vignette envoie vers ce site externe (ex. kalypso.com.py)
    link_externo: strOpc(),

    // --- Médias (URLs Cloudinary — JAMAIS dans Git) ---
    // Photo de couverture explicite ; sinon la 1ère de la liste
    portada_foto: strOpc(),
    imagenes: z.array(z.string()).default([]),
    // Fiche commerciale PDF (stockée dans public/uploads/fichas) — optionnelle
    ficha_pdf: strOpc(),

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
    contexto: strOpc(), // ex. "Compró una casa en Luque"
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

/**
 * Alquiler temporal (location meublée de 7 jours à 6 mois).
 * Collection À PART des biens : ces logements restent toujours en ligne ;
 * seul leur état change (Disponible / Alquilado), calculé dans le navigateur
 * à partir des réservations saisies dans l'admin.
 * ⚠️ Le dépôt GitHub est public : ne jamais saisir de nom de locataire,
 * seulement les dates.
 */
const fecha = () =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), z.coerce.date());

const temporales = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/temporales' }),
  schema: z.object({
    titulo: z.string(),
    // Gamme : résidences de la marque Kalypso (Yrupé…) ou logements gérés pour d'autres propriétaires
    gama: z.enum(['kalypso', 'otros']).default('otros'),
    residencia: strOpc(), // nom de la résidence Kalypso, ex. « Yrupé »
    activo: z.boolean().default(true), // décocher pour retirer du site sans supprimer
    orden: entOpc(), // ordre d'affichage (1 = en premier)
    ciudad: z.string(),
    barrio: strOpc(),
    ubicacion: strOpc(),
    dormitorios: entOpc(),
    banos: entOpc(),
    huespedes: entOpc(),
    superficie: numOpc(),
    moneda: z.enum(['USD', 'PYG']).default('USD'),
    precio_semana: numOpc(),
    precio_mes: numOpc(),
    incluye: z.preprocess((v) => (v == null ? [] : v), z.array(z.string())).default([]),
    portada_foto: strOpc(),
    imagenes: z.preprocess((v) => (v == null ? [] : v), z.array(z.string())).default([]),
    descripcion: z.string(),
    // Périodes occupées : « hasta » = jour de départ (libre ce jour-là)
    reservas: z
      .preprocess(
        (v) => (v == null ? [] : v),
        z.array(z.object({ desde: fecha(), hasta: fecha() }))
      )
      .default([]),
  }),
});

export const collections = { biens, resenas, temporales };
