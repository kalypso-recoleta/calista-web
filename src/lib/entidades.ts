/**
 * Entités reliées (données structurées JSON-LD) — un seul endroit pour l'agence,
 * sa fondatrice et les sociétés liées, avec des identifiants (@id) stables.
 * Validé par Hélène le 26/11/2026 :
 *  - zone desservie : Asunción, Luque, Lambaré, Mariano Roque Alonso ;
 *  - El Solar SRL : société distincte de l'agence (pas une société sœur) ;
 *  - CALISTA Immobilier (Martinique) : agence sœur.
 * Chiffres El Solar validés le 26/11/2026 : 17 réalisations livrées depuis 2002
 * (11 en Martinique, 6 au Paraguay), 379 logements, 100 % vendus.
 */
const BASE = 'https://calista.com.py';

export const ID = {
  agencia: `${BASE}/#agencia`,
  helene: `${BASE}/#helene-montourcy`,
  web: `${BASE}/#web`,
  elSolar: 'https://elsolar.com.py/#empresa',
  calistaMq: 'https://www.calista.immo/#agence',
} as const;

export const zonaServida = ['Asunción', 'Luque', 'Lambaré', 'Mariano Roque Alonso'] as const;

export const areaServedLd = zonaServida.map((name) => ({
  '@type': 'City',
  name,
  containedInPlace: { '@type': 'Country', name: 'Paraguay' },
}));

export const elSolarLd = {
  '@type': 'Organization',
  '@id': ID.elSolar,
  name: 'El Solar SRL',
  url: 'https://elsolar.com.py/',
  description:
    'Constructora y desarrolladora inmobiliaria, empresa distinta de CALISTA: 17 obras entregadas desde 2002 (11 en Martinica, 6 en Paraguay), 379 viviendas.',
  founder: { '@id': ID.helene },
};

export const calistaMqLd = {
  '@type': 'RealEstateAgent',
  '@id': ID.calistaMq,
  name: 'CALISTA Immobilier',
  url: 'https://www.calista.immo/',
  description: 'Agencia hermana de CALISTA en Martinica (Francia): transacciones y administración de propiedades.',
  address: { '@type': 'PostalAddress', addressLocality: 'Schœlcher', addressRegion: 'Martinique', addressCountry: 'FR' },
  founder: { '@id': ID.helene },
};
