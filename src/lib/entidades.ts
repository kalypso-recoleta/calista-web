/**
 * Entités reliées (données structurées JSON-LD) — un seul endroit pour l'agence,
 * sa fondatrice et les sociétés liées, avec des identifiants (@id) stables.
 * Validé par Hélène le 26/11/2026 :
 *  - zone desservie : Asunción, Luque, Lambaré, Mariano Roque Alonso ;
 *  - El Solar SRL : société distincte de l'agence (pas une société sœur) ;
 *  - CALISTA Immobilier (Martinique) : agence sœur.
 * Chiffres El Solar validés le 26/11/2026 : 18 réalisations livrées depuis 2002
 * (11 en Martinique, 7 au Paraguay), 388 logements, 100 % vendus.
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
    'Constructora y desarrolladora inmobiliaria, empresa distinta de CALISTA: 18 obras entregadas desde 2002 (11 en Martinica, 7 en Paraguay), 388 viviendas.',
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

/**
 * Biographie courte d'Hélène Montourcy (fin des articles + données structurées Person).
 * Années calculées au moment du build : promotion immobilière depuis 2001, au Paraguay depuis 2015
 * (mêmes repères que la page Historia).
 */
export function bioHelene(lang: string): string {
  const anos = new Date().getFullYear() - 2001;
  const textos: Record<string, string> = {
    es: `Fundadora y directora de CALISTA Inmobiliaria – GRUPO METRIA. ${anos} años de experiencia en el sector inmobiliario y la promoción inmobiliaria. Instalada en Paraguay desde 2015, acompaña a propietarios e inversores nacionales e internacionales en sus proyectos inmobiliarios.`,
    fr: `Fondatrice et directrice de CALISTA Inmobiliaria – GRUPO METRIA. ${anos} ans d’expérience dans le secteur immobilier et la promotion immobilière. Installée au Paraguay depuis 2015, elle accompagne les propriétaires et les investisseurs nationaux et internationaux dans leurs projets immobiliers.`,
    en: `Founder and director of CALISTA Inmobiliaria – GRUPO METRIA. ${anos} years of experience in real estate and property development. Based in Paraguay since 2015, she supports local and international owners and investors in their real estate projects.`,
    pt: `Fundadora e diretora da CALISTA Inmobiliaria – GRUPO METRIA. ${anos} anos de experiência no setor imobiliário e na incorporação imobiliária. Radicada no Paraguai desde 2015, acompanha proprietários e investidores nacionais e internacionais em seus projetos imobiliários.`,
  };
  return textos[lang] ?? textos.es;
}
