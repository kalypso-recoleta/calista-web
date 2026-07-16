import type { Lang } from './utils';

// Toutes les chaînes de l'interface, en 3 langues.
// Les annonces (titre/description des biens) restent dans la langue
// saisie par l'agence — elles ne passent pas par ici.
export const ui: Record<Lang, Record<string, string>> = {
  es: {
    // Navigation
    'nav.comprar': 'Comprar',
    'nav.alquilar': 'Alquilar',
    'nav.desarrollos': 'Desarrollos',
    'nav.terrenos': 'Terrenos',
    'nav.exclusivos': 'Exclusivos',
    'nav.propietarios': 'Gestión / Venta',
    'nav.resenas': 'Reseñas',
    'nav.historia': 'Historia',
    'nav.contacto': 'Contacto',
    'nav.contactar': 'Contactar',
    'nav.skip': 'Saltar al contenido',
    'nav.wa_consulta': 'Hola Calista, quisiera hacer una consulta.',

    // Footer
    'footer.propiedades': 'Propiedades',
    'footer.propietarios': 'Propietarios',
    'footer.vender': 'Vender mi propiedad',
    'footer.administracion': 'Administración de alquileres',
    'footer.agencia': 'Agencia',
    'footer.nuestra_historia': 'Nuestra historia',
    'footer.contacto': 'Contacto',
    'footer.contacto_titulo': 'Contacto',
    'footer.desarrollos': 'Nuevos desarrollos',

    // Communs
    'common.ver': 'Ver →',
    'common.ver_todas': 'Ver todas →',
    'common.ver_propiedad': 'Ver propiedad',
    'common.consultar_wa': 'Consultar por WhatsApp',

    // Étiquettes — type de bien
    'tipo.casa': 'Casa',
    'tipo.departamento': 'Departamento',
    'tipo.duplex': 'Dúplex',
    'tipo.terreno': 'Terreno',
    'tipo.oficina': 'Oficina',
    'tipo.local': 'Local comercial',
    'tipo.deposito': 'Depósito',
    'tipo.quinta': 'Quinta',
    'tipoP.casa': 'Casas',
    'tipoP.departamento': 'Departamentos',
    'tipoP.duplex': 'Dúplex',
    'tipoP.terreno': 'Terrenos',
    'tipoP.oficina': 'Oficinas',
    'tipoP.local': 'Locales',
    'tipoP.deposito': 'Depósitos',
    'tipoP.quinta': 'Quintas',
    // Opération / état
    'op.venta': 'En venta',
    'op.alquiler': 'En alquiler',
    'estado.disponible': 'Disponible',
    'estado.reservado': 'Reservado',
    'estado.vendido': 'Vendido',
    'estado.alquilado': 'Alquilado',
    'periodo.mes': '/mes',
    'periodo.dia': '/día',
    'badge.pozo': 'Pozo',
    'badge.pozo_largo': 'En pozo',
    'badge.exclusivo': 'Exclusivo',
    // Specs
    'spec.dorm': 'dorm.',
    'spec.banos': 'baños',
    'spec.coch': 'coch.',
    'spec.dormitorios': 'Dormitorios',
    'spec.banos_full': 'Baños',
    'spec.cocheras': 'Cocheras',
    'spec.superficie': 'Superficie',
    'spec.entrega': 'Entrega',
    'spec.financiacion': 'Financiación',
    'spec.financiacion_si': 'Disponible',
    'unit.terreno': 'm² de terreno',
    'unit.construidos': 'm² construidos',
    'unit.m2': 'm²',

    // Filtres
    'filtros.buscar': 'Buscar por título, barrio…',
    'filtros.todas_ciudades': 'Todas las ciudades',
    'filtros.todos_barrios': 'Todos los barrios',
    'filtros.todo_tipo': 'Todo tipo',
    'filtros.dormitorios': 'Dormitorios',
    'filtros.banos': 'Baños',
    'filtros.limpiar': 'Limpiar',
    'filtros.propiedades': 'propiedades',
    'filtros.vacio':
      'No encontramos propiedades con esos criterios. Probá ampliar la búsqueda o escribinos directamente.',

    // Carte
    'map.aprox': 'Ubicación aproximada',
    'map.nota':
      'La dirección exacta se comparte al coordinar una visita.',

    // Accueil
    'home.hero_eyebrow': 'Inmobiliaria en Asunción',
    'home.hero_title': 'Encontrá tu lugar, con quien conoce el terreno.',
    'home.hero_lead':
      '11 años de experiencia en el mercado inmobiliario paraguayo, acompañando a familias e inversores en Asunción y alrededores. Asesoramiento honesto, criterio real y cero presión.',
    'home.ver_propiedades': 'Ver propiedades',
    'seo.home_title': 'Inmobiliaria en Asunción — Compra, venta y alquiler',
    'seo.home_desc':
      'Calista Inmobiliaria: 11 años de experiencia en el mercado inmobiliario paraguayo. Casas, departamentos, terrenos y desarrollos en Asunción y alrededores. Asesoramiento honesto y atención personal.',
    'home.hablar_wa': 'Hablar por WhatsApp',
    'home.cat_comprar': 'Comprar',
    'home.cat_comprar_d': 'Casas y departamentos en venta',
    'home.cat_alquilar': 'Alquilar',
    'home.cat_alquilar_d': 'Opciones en alquiler verificadas',
    'home.cat_desarrollos': 'Desarrollos',
    'home.cat_desarrollos_d': 'Unidades en pozo y proyectos',
    'home.cat_terrenos': 'Terrenos',
    'home.cat_terrenos_d': 'Lotes para construir o invertir',
    'home.destacados_eyebrow': 'Selección',
    'home.destacados_title': 'Propiedades destacadas',
    'home.porque_eyebrow': 'Cómo trabajamos',
    'home.porque_title': 'Una manera distinta de comprar y vender.',
    'home.porque_lead':
      'En un mercado donde abunda el apuro y la letra chica, elegimos lo contrario: información clara, propiedades que conocemos de verdad y tu decisión en el centro.',
    'home.valor1_t': 'Experiencia real',
    'home.valor1_d':
      '11 años de experiencia en el mercado inmobiliario paraguayo. Conocemos los barrios, los precios reales y lo que hay detrás de cada zona.',
    'home.valor2_t': 'Acompañamiento honesto',
    'home.valor2_d':
      'Te explicamos cada paso y te derivamos a profesionales legales independientes para escrituras y trámites. Sin paquetes atados.',
    'home.valor3_t': 'Atención personal',
    'home.valor3_d':
      'Hablás siempre con una persona, no con un sistema. Respondemos por WhatsApp y coordinamos cada visita con cuidado.',
    'home.cifra1_v': '11',
    'home.cifra1_l': 'Años en el mercado paraguayo',
    'home.cifra2_v': '2',
    'home.cifra2_l': 'Continentes: Martinica y Paraguay',
    'home.cifra3_v': '+100',
    'home.cifra3_l': 'Propiedades en gestión',
    'home.cifras_nota':
      'Junto a nuestra agencia hermana Calista Immobilier en Martinica (Francia), llevamos más de una década acompañando a propietarios e inversores a ambos lados del Atlántico.',
    'home.resenas_eyebrow': 'Reseñas',
    'home.resenas_title': 'Lo que dicen nuestros clientes',
    'home.prop_eyebrow': 'Para propietarios',
    'home.prop_title': '¿Querés vender o alquilar tu propiedad?',
    'home.prop_lead':
      'Tasamos, fotografiamos y publicamos tu propiedad con criterio. Y si alquilás, nos ocupamos de la administración para que vos no tengas que estar encima.',
    'home.prop_cta': 'Conocer más',
    'home.prop_wa': 'Consultar ahora',
    'home.prop_wa_msg': 'Hola Calista, quiero vender / alquilar mi propiedad.',

    // Listings
    'lista.comprar_eyebrow': 'En venta',
    'lista.comprar_title': 'Propiedades en venta',
    'lista.comprar_intro':
      'Casas, departamentos y más, seleccionados con criterio. Filtrá por ciudad, barrio o tipo para encontrar lo que buscás.',
    'lista.alquilar_eyebrow': 'En alquiler',
    'lista.alquilar_title': 'Propiedades en alquiler',
    'lista.alquilar_intro':
      'Opciones en alquiler verificadas y acompañadas de principio a fin, desde la visita hasta la firma del contrato.',
    'lista.terrenos_eyebrow': 'Lotes',
    'lista.terrenos_title': 'Terrenos',
    'lista.terrenos_intro':
      'Lotes para construir tu casa o invertir, con documentación verificada y asesoramiento sobre la zona.',
    'lista.desarrollos_eyebrow': 'En pozo',
    'lista.desarrollos_title': 'Nuevos desarrollos',
    'lista.desarrollos_intro':
      'Proyectos en construcción y unidades en pozo. Comprar en esta etapa suele significar un mejor precio y planes de pago durante la obra.',
    'lista.vacia':
      'Por el momento no hay propiedades publicadas en esta sección. Escribinos y te avisamos apenas ingrese algo acorde a lo que buscás.',

    // Exclusivos
    'excl.hero_eyebrow': 'Cartera exclusiva',
    'excl.hero_title': 'Propiedades exclusivas',
    'excl.hero_lead':
      'Una selección reducida de propiedades de excepción. Las comercializamos con discreción y de forma personalizada, coordinando visitas únicamente con clientes calificados.',
    'excl.vacia':
      'Por el momento no hay propiedades publicadas en la cartera exclusiva. Si buscás algo en particular, escribinos para una búsqueda privada.',
    'excl.cierre_eyebrow': 'Búsqueda privada',
    'excl.cierre_title': '¿Buscás algo a la altura?',
    'excl.cierre_text':
      'Algunas propiedades no las publicamos abiertamente, por pedido de sus dueños. Contanos qué buscás y lo gestionamos con total discreción.',
    'excl.cierre_cta': 'Hacer una consulta privada',
    'excl.cierre_wa':
      'Hola Calista, me interesa la cartera exclusiva. Quisiera una consulta privada.',
    'excl.feature_wa': 'Consulta privada',

    // Historia
    'hist.eyebrow': 'Quiénes somos',
    'hist.title': 'Una inmobiliaria que se construyó sobre la confianza.',
    'hist.lead':
      'Calista nació en Asunción hace once años, con una idea simple: tratar cada propiedad y cada cliente como si fueran propios.',
    'hist.p1':
      'En todo este tiempo acompañamos a familias que compraron su primera casa, a propietarios que confiaron en nosotros para vender o alquilar, y a inversores que buscaban crecer con criterio. No trabajamos con volumen ni con apuro: trabajamos con personas.',
    'hist.p_martinica':
      'Nuestra historia empezó del otro lado del Atlántico: en Martinica (Francia), donde nuestra agencia hermana Calista Immobilier acompaña a propietarios desde hace más de una década. Hace 11 años trajimos esa misma manera de trabajar a Paraguay. Hoy, entre ambas agencias, gestionamos más de cien propiedades en dos continentes.',
    'hist.h2_creemos': 'En qué creemos',
    'hist.p_creemos':
      'Conocemos bien el mercado paraguayo, también sus zonas grises. Por eso elegimos hacer las cosas de otra manera. Cuando un cliente del exterior se acerca, lo asesoramos con la misma honestidad que a cualquiera: explicamos el proceso y lo derivamos a profesionales legales independientes para escrituras, residencia y trámites. Nunca atamos un servicio a otro ni usamos los trámites como excusa para empujar una propiedad.',
    'hist.p_reputacion':
      'Nuestra reputación se construyó recomendación por recomendación. Eso es lo que más cuidamos.',
    'hist.h2_acompanamos': 'Cómo te acompañamos',
    'hist.p_acompanamos':
      'Desde la primera consulta hasta la firma, hablás siempre con una persona. Visitamos cada propiedad, conocemos a los propietarios y te contamos lo bueno y lo no tan bueno de cada zona. Si algo no te conviene, te lo decimos.',
    'hist.cta_ver': 'Ver propiedades',
    'hist.cta_wa': 'Conversar',
    'hist.cta_wa_msg': 'Hola Calista, me gustaría conocerlos mejor.',

    // Propietarios
    'prop.hero_eyebrow': 'Para propietarios',
    'prop.hero_title': 'Tenés una propiedad. Nosotros nos ocupamos del resto.',
    'prop.hero_lead':
      'Sea para venderla, alquilarla o administrarla, te acompañamos con la misma honestidad de siempre: precios realistas, información clara y tu decisión en el centro.',
    'prop.cta_vender': 'Quiero vender',
    'prop.cta_admin': 'Quiero alquilar / administrar',
    'prop.vender_eyebrow': 'Vender',
    'prop.vender_title': 'Vendé tu propiedad con acompañamiento real.',
    'prop.vender_lead':
      'No trabajamos con apuro ni con letra chica. Te explicamos cada paso y cuidamos tu propiedad como si fuera nuestra.',
    'prop.paso1_t': 'Tasación honesta',
    'prop.paso1_d':
      'Visitamos tu propiedad y te damos un precio realista, basado en la zona y el mercado actual. Sin inflar para captarte ni subvaluar para vender rápido.',
    'prop.paso2_t': 'Fotos y publicación',
    'prop.paso2_d':
      'Fotografiamos la propiedad y la publicamos acá, con buena presentación y difusión por nuestros canales y WhatsApp.',
    'prop.paso3_t': 'Visitas y negociación',
    'prop.paso3_d':
      'Coordinamos y acompañamos cada visita, filtramos a los interesados serios y negociamos por vos.',
    'prop.paso4_t': 'Cierre con respaldo legal',
    'prop.paso4_d':
      'Te derivamos a profesionales legales independientes para la escritura y los trámites. Acompañamos hasta la firma.',
    'prop.vender_wa': 'Quiero vender mi propiedad',
    'prop.vender_wa_msg':
      'Hola Calista, quiero vender mi propiedad. ¿Cómo es el proceso?',
    'prop.vender_form': 'Enviar los datos por formulario',
    'prop.admin_eyebrow': 'Administración de alquileres',
    'prop.admin_title': '¿Alquilás tu propiedad? Olvidate de estar encima.',
    'prop.admin_lead':
      'Nos ocupamos de todo el ciclo del alquiler para que vos solo recibas tu renta, tranquilo. Ideal si vivís lejos o no querés lidiar con el día a día.',
    'prop.admin_wa': 'Quiero administrar mi alquiler',
    'prop.admin_wa_msg':
      'Hola Calista, quiero que administren el alquiler de mi propiedad.',
    'prop.admin_i1': 'Búsqueda y selección de inquilinos',
    'prop.admin_i2': 'Contrato y garantías en regla',
    'prop.admin_i3': 'Cobro del alquiler y rendición mensual',
    'prop.admin_i4': 'Coordinación de mantenimiento y reparaciones',
    'prop.admin_i5': 'Un solo interlocutor: nosotros nos ocupamos',
    'prop.cierre_title': '¿Hablamos de tu propiedad?',
    'prop.cierre_text':
      'Contanos qué tenés y qué querés hacer. Te respondemos personalmente.',
    'prop.cierre_wa': 'Escribir por WhatsApp',
    'prop.cierre_form': 'Ir al formulario',

    // Contacto
    'cont.eyebrow': 'Contacto',
    'cont.title': 'Hablemos.',
    'cont.lead':
      'La forma más rápida es WhatsApp. También podés escribirnos por email o dejar tus datos en el formulario y te contactamos a la brevedad.',
    'cont.email': 'Email',
    'cont.telefono': 'Teléfono',
    'cont.donde': 'Dónde estamos',
    'cont.f_nombre': 'Nombre',
    'cont.f_email': 'Email',
    'cont.f_telefono': 'Teléfono / WhatsApp',
    'cont.f_motivo': '¿En qué te ayudamos?',
    'cont.f_mensaje': 'Mensaje',
    'cont.f_enviar': 'Enviar consulta',
    'cont.m1': 'Quiero comprar',
    'cont.m2': 'Quiero alquilar',
    'cont.m3': 'Quiero vender mi propiedad',
    'cont.m4': 'Quiero alquilar mi propiedad / administración',
    'cont.m5': 'Otra consulta',

    // Gracias
    'grac.eyebrow': 'Recibido',
    'grac.title': '¡Gracias por escribirnos!',
    'grac.lead':
      'Recibimos tu consulta y te vamos a responder a la brevedad. Si es algo urgente, escribinos directamente por WhatsApp.',
    'grac.volver': 'Volver al inicio',
    'grac.abrir_wa': 'Abrir WhatsApp',
    'grac.wa_msg': 'Hola Calista, acabo de enviar una consulta.',

    // Reseñas (page)
    'res.eyebrow': 'Reseñas',
    'res.title': 'Lo que dicen nuestros clientes.',
    'res.lead':
      'Nuestra mejor carta de presentación son las personas que ya confiaron en nosotros. Esto es lo que cuentan.',
    'res.vacia': 'Pronto vas a ver acá las experiencias de nuestros clientes.',
    'res.cta': 'Quiero trabajar con ustedes',

    // Détail propriété
    'det.inicio': 'Inicio',
    'det.ubicacion': 'Ubicación',
    'det.ref': 'Ref.',
    'det.enviar_consulta': 'Enviar consulta',
    'det.nota': 'Te respondemos personalmente. Sin intermediarios automáticos.',
    'det.wa_msg_a': 'Hola, me interesa la propiedad',
    'det.wa_msg_b': '¿Podrían darme más información?',
  },

  fr: {
    // Navigation
    'nav.comprar': 'Acheter',
    'nav.alquilar': 'Louer',
    'nav.desarrollos': 'Programmes neufs',
    'nav.terrenos': 'Terrains',
    'nav.exclusivos': 'Exclusivités',
    'nav.propietarios': 'Gestion / Vente',
    'nav.resenas': 'Avis',
    'nav.historia': 'Notre histoire',
    'nav.contacto': 'Contact',
    'nav.contactar': 'Nous contacter',
    'nav.skip': 'Aller au contenu',
    'nav.wa_consulta': 'Bonjour Calista, je souhaiterais un renseignement.',

    // Footer
    'footer.propiedades': 'Propriétés',
    'footer.propietarios': 'Propriétaires',
    'footer.vender': 'Vendre mon bien',
    'footer.administracion': 'Gestion locative',
    'footer.agencia': 'Agence',
    'footer.nuestra_historia': 'Notre histoire',
    'footer.contacto': 'Contact',
    'footer.contacto_titulo': 'Contact',
    'footer.desarrollos': 'Programmes neufs',

    // Communs
    'common.ver': 'Voir →',
    'common.ver_todas': 'Tout voir →',
    'common.ver_propiedad': 'Voir le bien',
    'common.consultar_wa': 'Demander par WhatsApp',

    // Étiquettes — type
    'tipo.casa': 'Maison',
    'tipo.departamento': 'Appartement',
    'tipo.duplex': 'Duplex',
    'tipo.terreno': 'Terrain',
    'tipo.oficina': 'Bureau',
    'tipo.local': 'Local commercial',
    'tipo.deposito': 'Entrepôt',
    'tipo.quinta': 'Maison de campagne',
    'tipoP.casa': 'Maisons',
    'tipoP.departamento': 'Appartements',
    'tipoP.duplex': 'Duplex',
    'tipoP.terreno': 'Terrains',
    'tipoP.oficina': 'Bureaux',
    'tipoP.local': 'Locaux',
    'tipoP.deposito': 'Entrepôts',
    'tipoP.quinta': 'Maisons de campagne',
    'op.venta': 'À vendre',
    'op.alquiler': 'À louer',
    'estado.disponible': 'Disponible',
    'estado.reservado': 'Réservé',
    'estado.vendido': 'Vendu',
    'estado.alquilado': 'Loué',
    'periodo.mes': '/mois',
    'periodo.dia': '/jour',
    'badge.pozo': 'Sur plan',
    'badge.pozo_largo': 'Sur plan',
    'badge.exclusivo': 'Exclusivité',
    'spec.dorm': 'ch.',
    'spec.banos': 'sdb',
    'spec.coch': 'gar.',
    'spec.dormitorios': 'Chambres',
    'spec.banos_full': 'Salles de bain',
    'spec.cocheras': 'Garages',
    'spec.superficie': 'Surface',
    'spec.entrega': 'Livraison',
    'spec.financiacion': 'Financement',
    'spec.financiacion_si': 'Disponible',
    'unit.terreno': 'm² de terrain',
    'unit.construidos': 'm² habitables',
    'unit.m2': 'm²',

    // Filtres
    'filtros.buscar': 'Rechercher par titre, quartier…',
    'filtros.todas_ciudades': 'Toutes les villes',
    'filtros.todos_barrios': 'Tous les quartiers',
    'filtros.todo_tipo': 'Tous les types',
    'filtros.dormitorios': 'Chambres',
    'filtros.banos': 'Salles de bain',
    'filtros.limpiar': 'Effacer',
    'filtros.propiedades': 'biens',
    'filtros.vacio':
      "Aucun bien ne correspond à ces critères. Élargissez la recherche ou écrivez-nous directement.",

    // Carte
    'map.aprox': 'Localisation approximative',
    'map.nota':
      "L'adresse exacte est communiquée au moment d'organiser une visite.",

    // Accueil
    'home.hero_eyebrow': 'Agence immobilière à Asunción',
    'home.hero_title': 'Trouvez votre lieu, avec ceux qui connaissent le terrain.',
    'home.hero_lead':
      "11 ans d'expérience sur le marché immobilier paraguayen, à accompagner familles et investisseurs à Asunción et ses environs. Un conseil honnête, un vrai discernement et aucune pression.",
    'home.ver_propiedades': 'Voir les biens',
    'seo.home_title': 'Agence immobilière à Asunción — Achat, vente et location',
    'seo.home_desc':
      "Calista Inmobiliaria : 11 ans d'expérience sur le marché immobilier paraguayen. Maisons, appartements, terrains et programmes neufs à Asunción et ses environs. Un conseil honnête et un suivi personnel.",
    'home.hablar_wa': 'Discuter sur WhatsApp',
    'home.cat_comprar': 'Acheter',
    'home.cat_comprar_d': 'Maisons et appartements à vendre',
    'home.cat_alquilar': 'Louer',
    'home.cat_alquilar_d': 'Des locations vérifiées',
    'home.cat_desarrollos': 'Programmes neufs',
    'home.cat_desarrollos_d': 'Achats sur plan et projets',
    'home.cat_terrenos': 'Terrains',
    'home.cat_terrenos_d': 'Lots à construire ou pour investir',
    'home.destacados_eyebrow': 'Sélection',
    'home.destacados_title': 'Biens à la une',
    'home.porque_eyebrow': 'Notre façon de travailler',
    'home.porque_title': "Une autre manière d'acheter et de vendre.",
    'home.porque_lead':
      "Dans un marché où règnent la précipitation et les petites lignes, nous faisons l'inverse : une information claire, des biens que nous connaissons vraiment, et votre décision au centre.",
    'home.valor1_t': 'Une vraie expérience',
    'home.valor1_d':
      "11 ans d'expérience sur le marché immobilier paraguayen. Nous connaissons les quartiers, les vrais prix et ce qui se cache derrière chaque zone.",
    'home.valor2_t': 'Un accompagnement honnête',
    'home.valor2_d':
      "Nous vous expliquons chaque étape et vous orientons vers des juristes indépendants pour les actes et démarches. Sans services imposés.",
    'home.valor3_t': 'Un suivi personnel',
    'home.valor3_d':
      "Vous parlez toujours à une personne, pas à un système. Nous répondons sur WhatsApp et organisons chaque visite avec soin.",
    'home.cifra1_v': '11',
    'home.cifra1_l': 'Ans sur le marché paraguayen',
    'home.cifra2_v': '2',
    'home.cifra2_l': 'Continents : Martinique et Paraguay',
    'home.cifra3_v': '+100',
    'home.cifra3_l': 'Biens en gestion',
    'home.cifras_nota':
      "Avec notre agence sœur Calista Immobilier en Martinique (France), nous accompagnons depuis plus de dix ans propriétaires et investisseurs des deux côtés de l'Atlantique.",
    'home.resenas_eyebrow': 'Avis',
    'home.resenas_title': 'Ce que disent nos clients',
    'home.prop_eyebrow': 'Pour les propriétaires',
    'home.prop_title': 'Vous voulez vendre ou louer votre bien ?',
    'home.prop_lead':
      "Nous estimons, photographions et publions votre bien avec discernement. Et si vous louez, nous nous occupons de la gestion pour que vous n'ayez plus à y penser.",
    'home.prop_cta': 'En savoir plus',
    'home.prop_wa': 'Nous consulter',
    'home.prop_wa_msg':
      'Bonjour Calista, je souhaite vendre / louer mon bien.',

    // Listings
    'lista.comprar_eyebrow': 'À vendre',
    'lista.comprar_title': 'Biens à vendre',
    'lista.comprar_intro':
      "Maisons, appartements et plus encore, sélectionnés avec soin. Filtrez par ville, quartier ou type pour trouver ce que vous cherchez.",
    'lista.alquilar_eyebrow': 'À louer',
    'lista.alquilar_title': 'Biens à louer',
    'lista.alquilar_intro':
      "Des locations vérifiées et accompagnées de bout en bout, de la visite à la signature du bail.",
    'lista.terrenos_eyebrow': 'Lots',
    'lista.terrenos_title': 'Terrains',
    'lista.terrenos_intro':
      "Des terrains pour construire votre maison ou investir, avec des documents vérifiés et des conseils sur la zone.",
    'lista.desarrollos_eyebrow': 'Sur plan',
    'lista.desarrollos_title': 'Programmes neufs',
    'lista.desarrollos_intro':
      "Projets en construction et achats sur plan. Acheter à ce stade, c'est souvent un meilleur prix et des paiements échelonnés pendant les travaux.",
    'lista.vacia':
      "Aucun bien publié dans cette section pour le moment. Écrivez-nous et nous vous préviendrons dès qu'une offre correspond à ce que vous cherchez.",

    // Exclusivos
    'excl.hero_eyebrow': 'Portefeuille exclusif',
    'excl.hero_title': "Biens d'exception",
    'excl.hero_lead':
      "Une sélection restreinte de biens d'exception. Nous les commercialisons avec discrétion et de façon personnalisée, en organisant les visites uniquement avec des clients qualifiés.",
    'excl.vacia':
      "Aucun bien dans le portefeuille exclusif pour le moment. Si vous cherchez quelque chose de précis, écrivez-nous pour une recherche privée.",
    'excl.cierre_eyebrow': 'Recherche privée',
    'excl.cierre_title': "Vous cherchez quelque chose à la hauteur ?",
    'excl.cierre_text':
      "Certains biens ne sont pas publiés ouvertement, à la demande de leurs propriétaires. Dites-nous ce que vous cherchez, nous le gérons en toute discrétion.",
    'excl.cierre_cta': 'Faire une demande privée',
    'excl.cierre_wa':
      "Bonjour Calista, le portefeuille exclusif m'intéresse. Je souhaiterais une demande privée.",
    'excl.feature_wa': 'Demande privée',

    // Historia
    'hist.eyebrow': 'Qui sommes-nous',
    'hist.title': "Une agence bâtie sur la confiance.",
    'hist.lead':
      "Calista est née à Asunción il y a onze ans, avec une idée simple : traiter chaque bien et chaque client comme les nôtres.",
    'hist.p1':
      "Pendant toutes ces années, nous avons accompagné des familles qui achetaient leur première maison, des propriétaires qui nous ont confié une vente ou une location, et des investisseurs qui voulaient grandir avec discernement. Nous ne travaillons ni au volume ni dans la précipitation : nous travaillons avec des personnes.",
    'hist.p_martinica':
      "Notre histoire a commencé de l'autre côté de l'Atlantique : en Martinique (France), où notre agence sœur Calista Immobilier accompagne les propriétaires depuis plus de dix ans. Il y a 11 ans, nous avons apporté cette même façon de travailler au Paraguay. Aujourd'hui, entre les deux agences, nous gérons plus de cent biens sur deux continents.",
    'hist.h2_creemos': 'Ce en quoi nous croyons',
    'hist.p_creemos':
      "Nous connaissons bien le marché paraguayen, y compris ses zones grises. C'est pourquoi nous faisons les choses autrement. Quand un client de l'étranger nous contacte, nous le conseillons avec la même honnêteté que tout le monde : nous expliquons le processus et l'orientons vers des juristes indépendants pour les actes, la résidence et les démarches. Nous ne lions jamais un service à un autre et n'utilisons jamais les démarches comme prétexte pour pousser un bien.",
    'hist.p_reputacion':
      "Notre réputation s'est construite recommandation après recommandation. C'est ce que nous protégeons le plus.",
    'hist.h2_acompanamos': 'Comment nous vous accompagnons',
    'hist.p_acompanamos':
      "De la première question à la signature, vous parlez toujours à une personne. Nous visitons chaque bien, connaissons les propriétaires et vous disons le bon comme le moins bon de chaque zone. Si quelque chose ne vous convient pas, nous vous le disons.",
    'hist.cta_ver': 'Voir les biens',
    'hist.cta_wa': 'Échanger',
    'hist.cta_wa_msg': 'Bonjour Calista, je souhaiterais mieux vous connaître.',

    // Propietarios
    'prop.hero_eyebrow': 'Pour les propriétaires',
    'prop.hero_title': "Vous avez un bien. Nous nous occupons du reste.",
    'prop.hero_lead':
      "Pour le vendre, le louer ou le gérer, nous vous accompagnons avec la même honnêteté : des prix réalistes, une information claire et votre décision au centre.",
    'prop.cta_vender': 'Je veux vendre',
    'prop.cta_admin': 'Je veux louer / faire gérer',
    'prop.vender_eyebrow': 'Vendre',
    'prop.vender_title': 'Vendez votre bien avec un vrai accompagnement.',
    'prop.vender_lead':
      "Ni précipitation, ni petites lignes. Nous vous expliquons chaque étape et prenons soin de votre bien comme du nôtre.",
    'prop.paso1_t': 'Estimation honnête',
    'prop.paso1_d':
      "Nous visitons votre bien et vous donnons un prix réaliste, basé sur la zone et le marché actuel. Sans gonfler pour vous capter ni sous-évaluer pour vendre vite.",
    'prop.paso2_t': 'Photos et publication',
    'prop.paso2_d':
      "Nous photographions le bien et le publions ici, avec une belle présentation et une diffusion sur nos canaux et WhatsApp.",
    'prop.paso3_t': 'Visites et négociation',
    'prop.paso3_d':
      "Nous organisons et accompagnons chaque visite, filtrons les acquéreurs sérieux et négocions pour vous.",
    'prop.paso4_t': 'Clôture avec appui juridique',
    'prop.paso4_d':
      "Nous vous orientons vers des juristes indépendants pour l'acte et les démarches. Nous accompagnons jusqu'à la signature.",
    'prop.vender_wa': 'Je veux vendre mon bien',
    'prop.vender_wa_msg':
      'Bonjour Calista, je veux vendre mon bien. Comment se passe le processus ?',
    'prop.vender_form': 'Envoyer mes informations par formulaire',
    'prop.admin_eyebrow': 'Gestion locative',
    'prop.admin_title': 'Vous louez votre bien ? Ne soyez plus sur le pont.',
    'prop.admin_lead':
      "Nous prenons en charge tout le cycle de la location pour que vous n'ayez plus qu'à percevoir votre loyer, tranquille. Idéal si vous vivez loin ou ne voulez pas gérer le quotidien.",
    'prop.admin_wa': 'Je veux faire gérer ma location',
    'prop.admin_wa_msg':
      'Bonjour Calista, je veux que vous gériez la location de mon bien.',
    'prop.admin_i1': 'Recherche et sélection des locataires',
    'prop.admin_i2': 'Bail et garanties en règle',
    'prop.admin_i3': 'Encaissement du loyer et compte rendu mensuel',
    'prop.admin_i4': "Coordination de l'entretien et des réparations",
    'prop.admin_i5': 'Un seul interlocuteur : nous nous occupons de tout',
    'prop.cierre_title': 'On parle de votre bien ?',
    'prop.cierre_text':
      "Dites-nous ce que vous avez et ce que vous souhaitez faire. Nous vous répondons personnellement.",
    'prop.cierre_wa': 'Écrire sur WhatsApp',
    'prop.cierre_form': 'Aller au formulaire',

    // Contacto
    'cont.eyebrow': 'Contact',
    'cont.title': 'Parlons-en.',
    'cont.lead':
      "Le plus rapide, c'est WhatsApp. Vous pouvez aussi nous écrire par email ou laisser vos coordonnées dans le formulaire, nous vous recontactons rapidement.",
    'cont.email': 'Email',
    'cont.telefono': 'Téléphone',
    'cont.donde': 'Où nous sommes',
    'cont.f_nombre': 'Nom',
    'cont.f_email': 'Email',
    'cont.f_telefono': 'Téléphone / WhatsApp',
    'cont.f_motivo': 'Comment pouvons-nous aider ?',
    'cont.f_mensaje': 'Message',
    'cont.f_enviar': 'Envoyer la demande',
    'cont.m1': 'Je veux acheter',
    'cont.m2': 'Je veux louer',
    'cont.m3': 'Je veux vendre mon bien',
    'cont.m4': 'Je veux louer mon bien / gestion',
    'cont.m5': 'Autre demande',

    // Gracias
    'grac.eyebrow': 'Bien reçu',
    'grac.title': 'Merci de nous avoir écrit !',
    'grac.lead':
      "Nous avons bien reçu votre demande et vous répondrons rapidement. Si c'est urgent, écrivez-nous directement sur WhatsApp.",
    'grac.volver': "Retour à l'accueil",
    'grac.abrir_wa': 'Ouvrir WhatsApp',
    'grac.wa_msg': "Bonjour Calista, je viens d'envoyer une demande.",

    // Reseñas
    'res.eyebrow': 'Avis',
    'res.title': 'Ce que disent nos clients.',
    'res.lead':
      "Notre meilleure carte de visite, ce sont les personnes qui nous ont déjà fait confiance. Voici ce qu'elles racontent.",
    'res.vacia': 'Vous verrez bientôt ici les expériences de nos clients.',
    'res.cta': 'Je veux travailler avec vous',

    // Détail
    'det.inicio': 'Accueil',
    'det.ubicacion': 'Localisation',
    'det.ref': 'Réf.',
    'det.enviar_consulta': 'Envoyer une demande',
    'det.nota':
      "Nous vous répondons personnellement. Sans intermédiaire automatique.",
    'det.wa_msg_a': "Bonjour, je suis intéressé(e) par le bien",
    'det.wa_msg_b': 'Pourriez-vous me donner plus d\u2019informations ?',
  },

  en: {
    // Navigation
    'nav.comprar': 'Buy',
    'nav.alquilar': 'Rent',
    'nav.desarrollos': 'New developments',
    'nav.terrenos': 'Land',
    'nav.exclusivos': 'Exclusive',
    'nav.propietarios': 'Management / Sales',
    'nav.resenas': 'Reviews',
    'nav.historia': 'About us',
    'nav.contacto': 'Contact',
    'nav.contactar': 'Contact us',
    'nav.skip': 'Skip to content',
    'nav.wa_consulta': 'Hello Calista, I would like some information.',

    // Footer
    'footer.propiedades': 'Properties',
    'footer.propietarios': 'Owners',
    'footer.vender': 'Sell my property',
    'footer.administracion': 'Rental management',
    'footer.agencia': 'Agency',
    'footer.nuestra_historia': 'About us',
    'footer.contacto': 'Contact',
    'footer.contacto_titulo': 'Contact',
    'footer.desarrollos': 'New developments',

    // Communs
    'common.ver': 'View →',
    'common.ver_todas': 'View all →',
    'common.ver_propiedad': 'View property',
    'common.consultar_wa': 'Ask on WhatsApp',

    // Étiquettes
    'tipo.casa': 'House',
    'tipo.departamento': 'Apartment',
    'tipo.duplex': 'Duplex',
    'tipo.terreno': 'Land',
    'tipo.oficina': 'Office',
    'tipo.local': 'Commercial space',
    'tipo.deposito': 'Warehouse',
    'tipo.quinta': 'Country house',
    'tipoP.casa': 'Houses',
    'tipoP.departamento': 'Apartments',
    'tipoP.duplex': 'Duplexes',
    'tipoP.terreno': 'Land',
    'tipoP.oficina': 'Offices',
    'tipoP.local': 'Commercial spaces',
    'tipoP.deposito': 'Warehouses',
    'tipoP.quinta': 'Country houses',
    'op.venta': 'For sale',
    'op.alquiler': 'For rent',
    'estado.disponible': 'Available',
    'estado.reservado': 'Reserved',
    'estado.vendido': 'Sold',
    'estado.alquilado': 'Rented',
    'periodo.mes': '/month',
    'periodo.dia': '/day',
    'badge.pozo': 'Off-plan',
    'badge.pozo_largo': 'Off-plan',
    'badge.exclusivo': 'Exclusive',
    'spec.dorm': 'bd',
    'spec.banos': 'ba',
    'spec.coch': 'gar.',
    'spec.dormitorios': 'Bedrooms',
    'spec.banos_full': 'Bathrooms',
    'spec.cocheras': 'Garages',
    'spec.superficie': 'Area',
    'spec.entrega': 'Delivery',
    'spec.financiacion': 'Financing',
    'spec.financiacion_si': 'Available',
    'unit.terreno': 'm² of land',
    'unit.construidos': 'm² built',
    'unit.m2': 'm²',

    // Filtres
    'filtros.buscar': 'Search by title, neighborhood…',
    'filtros.todas_ciudades': 'All cities',
    'filtros.todos_barrios': 'All neighborhoods',
    'filtros.todo_tipo': 'All types',
    'filtros.dormitorios': 'Bedrooms',
    'filtros.banos': 'Bathrooms',
    'filtros.limpiar': 'Clear',
    'filtros.propiedades': 'properties',
    'filtros.vacio':
      "No properties match those filters. Try widening your search or message us directly.",

    // Carte
    'map.aprox': 'Approximate location',
    'map.nota': 'The exact address is shared when arranging a visit.',

    // Accueil
    'home.hero_eyebrow': 'Real estate in Asunción',
    'home.hero_title': 'Find your place, with people who know the ground.',
    'home.hero_lead':
      '11 years of experience in the Paraguayan real estate market, guiding families and investors in Asunción and nearby. Honest advice, real judgment and zero pressure.',
    'home.ver_propiedades': 'View properties',
    'seo.home_title': 'Real estate agency in Asunción — Buy, sell and rent',
    'seo.home_desc':
      'Calista Inmobiliaria: 11 years of experience in the Paraguayan real estate market. Houses, apartments, land and new developments in Asunción and nearby. Honest advice and personal service.',
    'home.hablar_wa': 'Chat on WhatsApp',
    'home.cat_comprar': 'Buy',
    'home.cat_comprar_d': 'Houses and apartments for sale',
    'home.cat_alquilar': 'Rent',
    'home.cat_alquilar_d': 'Verified rental options',
    'home.cat_desarrollos': 'Developments',
    'home.cat_desarrollos_d': 'Off-plan units and projects',
    'home.cat_terrenos': 'Land',
    'home.cat_terrenos_d': 'Lots to build on or invest',
    'home.destacados_eyebrow': 'Selection',
    'home.destacados_title': 'Featured properties',
    'home.porque_eyebrow': 'How we work',
    'home.porque_title': 'A different way to buy and sell.',
    'home.porque_lead':
      'In a market full of rush and fine print, we chose the opposite: clear information, properties we truly know, and your decision at the center.',
    'home.valor1_t': 'Real experience',
    'home.valor1_d':
      '11 years of experience in the Paraguayan real estate market. We know the neighborhoods, the real prices and what lies behind each area.',
    'home.valor2_t': 'Honest guidance',
    'home.valor2_d':
      'We explain every step and refer you to independent legal professionals for deeds and paperwork. No bundled services.',
    'home.valor3_t': 'Personal attention',
    'home.valor3_d':
      'You always talk to a person, not a system. We answer on WhatsApp and arrange every visit with care.',
    'home.cifra1_v': '11',
    'home.cifra1_l': 'Years in the Paraguayan market',
    'home.cifra2_v': '2',
    'home.cifra2_l': 'Continents: Martinique and Paraguay',
    'home.cifra3_v': '+100',
    'home.cifra3_l': 'Properties under management',
    'home.cifras_nota':
      'Together with our sister agency Calista Immobilier in Martinique (France), we have been guiding owners and investors on both sides of the Atlantic for over a decade.',
    'home.resenas_eyebrow': 'Reviews',
    'home.resenas_title': 'What our clients say',
    'home.prop_eyebrow': 'For owners',
    'home.prop_title': 'Want to sell or rent out your property?',
    'home.prop_lead':
      "We appraise, photograph and list your property with judgment. And if you rent it out, we handle the management so you don't have to.",
    'home.prop_cta': 'Learn more',
    'home.prop_wa': 'Get in touch',
    'home.prop_wa_msg': 'Hello Calista, I want to sell / rent out my property.',

    // Listings
    'lista.comprar_eyebrow': 'For sale',
    'lista.comprar_title': 'Properties for sale',
    'lista.comprar_intro':
      'Houses, apartments and more, carefully selected. Filter by city, neighborhood or type to find what you need.',
    'lista.alquilar_eyebrow': 'For rent',
    'lista.alquilar_title': 'Properties for rent',
    'lista.alquilar_intro':
      'Verified rentals, supported from start to finish, from the visit to signing the lease.',
    'lista.terrenos_eyebrow': 'Lots',
    'lista.terrenos_title': 'Land',
    'lista.terrenos_intro':
      'Lots to build your home or invest, with verified documents and advice about the area.',
    'lista.desarrollos_eyebrow': 'Off-plan',
    'lista.desarrollos_title': 'New developments',
    'lista.desarrollos_intro':
      'Projects under construction and off-plan units. Buying at this stage usually means a better price and payment plans during construction.',
    'lista.vacia':
      "No properties listed in this section yet. Write to us and we'll let you know as soon as something matches what you're looking for.",

    // Exclusivos
    'excl.hero_eyebrow': 'Exclusive portfolio',
    'excl.hero_title': 'Exclusive properties',
    'excl.hero_lead':
      'A small selection of exceptional properties. We market them discreetly and personally, arranging visits only with qualified clients.',
    'excl.vacia':
      "No properties in the exclusive portfolio yet. If you're after something specific, write to us for a private search.",
    'excl.cierre_eyebrow': 'Private search',
    'excl.cierre_title': 'Looking for something special?',
    'excl.cierre_text':
      "Some properties we don't list publicly, at the owners' request. Tell us what you're after and we'll handle it with full discretion.",
    'excl.cierre_cta': 'Make a private enquiry',
    'excl.cierre_wa':
      "Hello Calista, I'm interested in the exclusive portfolio. I'd like a private enquiry.",
    'excl.feature_wa': 'Private enquiry',

    // Historia
    'hist.eyebrow': 'Who we are',
    'hist.title': 'An agency built on trust.',
    'hist.lead':
      'Calista was born in Asunción eleven years ago, with a simple idea: to treat every property and every client as our own.',
    'hist.p1':
      "Over all this time we've guided families buying their first home, owners who trusted us to sell or rent, and investors looking to grow wisely. We don't work by volume or in a rush: we work with people.",
    'hist.p_martinica':
      'Our story began on the other side of the Atlantic: in Martinique (France), where our sister agency Calista Immobilier has been serving owners for over a decade. Eleven years ago we brought that same way of working to Paraguay. Today, across both agencies, we manage more than one hundred properties on two continents.',
    'hist.h2_creemos': 'What we believe',
    'hist.p_creemos':
      "We know the Paraguayan market well, including its grey areas. That's why we do things differently. When a client from abroad reaches out, we advise them with the same honesty as anyone: we explain the process and refer them to independent legal professionals for deeds, residency and paperwork. We never tie one service to another, nor use paperwork as an excuse to push a property.",
    'hist.p_reputacion':
      'Our reputation was built referral by referral. That is what we protect most.',
    'hist.h2_acompanamos': 'How we support you',
    'hist.p_acompanamos':
      "From the first question to the signing, you always talk to a person. We visit every property, know the owners, and tell you the good and the not-so-good about each area. If something isn't right for you, we'll say so.",
    'hist.cta_ver': 'View properties',
    'hist.cta_wa': 'Talk to us',
    'hist.cta_wa_msg': "Hello Calista, I'd like to get to know you better.",

    // Propietarios
    'prop.hero_eyebrow': 'For owners',
    'prop.hero_title': 'You have a property. We take care of the rest.',
    'prop.hero_lead':
      'Whether to sell, rent or manage it, we support you with the same honesty as always: realistic prices, clear information and your decision at the center.',
    'prop.cta_vender': 'I want to sell',
    'prop.cta_admin': 'I want to rent out / have it managed',
    'prop.vender_eyebrow': 'Sell',
    'prop.vender_title': 'Sell your property with real support.',
    'prop.vender_lead':
      "No rush, no fine print. We explain every step and look after your property as if it were ours.",
    'prop.paso1_t': 'Honest appraisal',
    'prop.paso1_d':
      "We visit your property and give you a realistic price, based on the area and the current market. No inflating to win you over, no undervaluing to sell fast.",
    'prop.paso2_t': 'Photos and listing',
    'prop.paso2_d':
      'We photograph the property and list it here, with great presentation and reach across our channels and WhatsApp.',
    'prop.paso3_t': 'Visits and negotiation',
    'prop.paso3_d':
      'We arrange and accompany every visit, filter serious buyers and negotiate for you.',
    'prop.paso4_t': 'Closing with legal support',
    'prop.paso4_d':
      'We refer you to independent legal professionals for the deed and paperwork. We support you through to signing.',
    'prop.vender_wa': 'I want to sell my property',
    'prop.vender_wa_msg':
      'Hello Calista, I want to sell my property. How does the process work?',
    'prop.vender_form': 'Send my details via the form',
    'prop.admin_eyebrow': 'Rental management',
    'prop.admin_title': 'Renting out your property? Stop being on call.',
    'prop.admin_lead':
      "We handle the whole rental cycle so you just receive your rent, stress-free. Ideal if you live far away or don't want to deal with the day-to-day.",
    'prop.admin_wa': 'I want my rental managed',
    'prop.admin_wa_msg':
      'Hello Calista, I want you to manage my property rental.',
    'prop.admin_i1': 'Tenant search and screening',
    'prop.admin_i2': 'Lease and guarantees in order',
    'prop.admin_i3': 'Rent collection and monthly reporting',
    'prop.admin_i4': 'Coordination of maintenance and repairs',
    'prop.admin_i5': 'One single contact: we take care of it',
    'prop.cierre_title': 'Shall we talk about your property?',
    'prop.cierre_text':
      'Tell us what you have and what you want to do. We answer personally.',
    'prop.cierre_wa': 'Message on WhatsApp',
    'prop.cierre_form': 'Go to the form',

    // Contacto
    'cont.eyebrow': 'Contact',
    'cont.title': "Let's talk.",
    'cont.lead':
      'The fastest way is WhatsApp. You can also email us or leave your details in the form and we will get back to you shortly.',
    'cont.email': 'Email',
    'cont.telefono': 'Phone',
    'cont.donde': 'Where we are',
    'cont.f_nombre': 'Name',
    'cont.f_email': 'Email',
    'cont.f_telefono': 'Phone / WhatsApp',
    'cont.f_motivo': 'How can we help?',
    'cont.f_mensaje': 'Message',
    'cont.f_enviar': 'Send enquiry',
    'cont.m1': 'I want to buy',
    'cont.m2': 'I want to rent',
    'cont.m3': 'I want to sell my property',
    'cont.m4': 'I want to rent out my property / management',
    'cont.m5': 'Other enquiry',

    // Gracias
    'grac.eyebrow': 'Received',
    'grac.title': 'Thanks for writing to us!',
    'grac.lead':
      'We received your enquiry and will reply shortly. If it is urgent, message us directly on WhatsApp.',
    'grac.volver': 'Back to home',
    'grac.abrir_wa': 'Open WhatsApp',
    'grac.wa_msg': 'Hello Calista, I just sent an enquiry.',

    // Reseñas
    'res.eyebrow': 'Reviews',
    'res.title': 'What our clients say.',
    'res.lead':
      'Our best introduction is the people who have already trusted us. Here is what they share.',
    'res.vacia': "You'll soon see our clients' experiences here.",
    'res.cta': 'I want to work with you',

    // Détail
    'det.inicio': 'Home',
    'det.ubicacion': 'Location',
    'det.ref': 'Ref.',
    'det.enviar_consulta': 'Send enquiry',
    'det.nota': 'We reply personally. No automated middlemen.',
    'det.wa_msg_a': "Hello, I'm interested in the property",
    'det.wa_msg_b': 'Could you give me more information?',
  },
};
