/**
 * Configuration centrale de Calista.
 * ───────────────────────────────────────────────────────────
 * Louis : c'est LE fichier à personnaliser. Tout le site lit ici.
 */

export const site = {
  nombre: 'Calista Inmobiliaria',
  // Slogan court affiché sous le logo / dans le hero
  lema: 'Acompañamiento inmobiliario en Asunción, con criterio y honestidad.',

  // ⚠️ Numéro WhatsApp au format international SANS "+", ni espaces, ni "0".
  // Paraguay = 595. Ex. pour 0981 123 456 → "595981123456"
  whatsapp: '595981000000',

  email: 'contacto@calista.com.py',
  telefono: '+595 21 000 000',
  direccion: 'Asunción, Paraguay',

  // Cloudinary : nom du "cloud" (visible dans ton dashboard Cloudinary).
  // Sert à optimiser les images à la volée.
  cloudinaryCloudName: 'TU_CLOUD_NAME',

  // Réseaux (laisse vide pour masquer)
  instagram: '',
  facebook: '',

  // Centre de carte par défaut (Asunción) si un bien n'a pas de pin.
  mapaCentro: { lat: -25.2967, lng: -57.6359 },
} as const;

/**
 * Villes / barrios proposés dans les filtres et l'admin.
 * Couvre Asunción, tout le Gran Asunción (département Central)
 * et les zones de quintas/week-end (lacs, Cordillera).
 * Pour en ajouter une : ici ET dans public/admin/config.yml (options de "ciudad").
 */
export const ciudades = [
  // Gran Asunción (departamento Central)
  'Asunción',
  'Lambaré',
  'Fernando de la Mora',
  'San Lorenzo',
  'Luque',
  'Mariano Roque Alonso',
  'Ñemby',
  'Villa Elisa',
  'San Antonio',
  'Limpio',
  'Capiatá',
  'Itauguá',
  'Itá',
  'Areguá',
  'Ypané',
  'Guarambaré',
  'J. Augusto Saldívar',
  'Villeta',
  'Nueva Italia',
  'Ypacaraí',
  // Cordillera / zonas de quintas
  'San Bernardino',
  'Altos',
  'Atyrá',
  'Tobatí',
  'Caacupé',
  'Piribebuy',
  'Paraguarí',
  // Alto Paraná
  'Ciudad del Este',
  'Presidente Franco',
  'Hernandarias',
  'Minga Guazú',
  // Itapúá
  'Encarnación',
  // Otras ciudades importantes del interior
  'Coronel Oviedo',
  'Caaguazú',
  'Villarrica',
  'Pedro Juan Caballero',
  'Concepción',
  'Pilar',
  'San Juan Bautista',
  'San Ignacio',
  'Salto del Guairá',
] as const;

/**
 * Liste maîtresse des barrios, par ville. Sert à remplir le filtre "barrio"
 * (indépendamment des annonces existantes). Asunción est couverte au complet ;
 * pour les autres villes, le filtre complète avec les barrios réellement publiés.
 * Pour en ajouter : ajoute simplement le nom dans la bonne ville.
 */
export const barriosPorCiudad: Record<string, readonly string[]> = {
  Asunción: [
    'Barrio Jara',
    'Bella Vista',
    'Botánico',
    'Carmelitas',
    'Ciudad Nueva',
    'Dr. Gaspar Rodríguez de Francia',
    'General Díaz',
    'Herrera',
    'Hipódromo',
    'Ita Enramada',
    'Itá Pytã Punta',
    'Jukyty',
    'La Catedral',
    'La Encarnación',
    'Las Lomas',
    'Las Mercedes',
    'Loma Pytã',
    'Los Laureles',
    'Madame Lynch',
    'Manorá',
    'Mariscal Estigarribia',
    'Mariscal López',
    'Mburicaó',
    'Mburucuyá',
    'Mbocayaty',
    'Nazareth',
    'Obrero',
    'Pettirossi',
    'Pinozá',
    'Recoleta',
    'Republicano',
    'Ricardo Brugada (La Chacarita)',
    'Roberto L. Pettit',
    'Sajonia',
    'Salamanca',
    'San Antonio',
    'San Blas',
    'San Cayetano',
    'San Jorge',
    'San Pablo',
    'San Roque',
    'San Vicente',
    'Santa Librada',
    'Santa María',
    'Santa Rosa',
    'Santísima Trinidad',
    'Tablada Nueva',
    'Tacumbú',
    'Tembetary',
    'Villa Morra',
    'Vista Alegre',
    'Ycuá Satí',
    'Ytay',
    'Zeballos Cué',
  ],
};
