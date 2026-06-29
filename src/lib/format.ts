import type { CollectionEntry } from 'astro:content';

type Bien = CollectionEntry<'biens'>['data'];

/** Prix formaté avec devise. Ex. "USD 185.000", "Gs. 2.500.000 /mes". */
export function formatPrecio(bien: Bien): string {
  const { precio, moneda, periodo, operacion } = bien;

  const numero = new Intl.NumberFormat('es-PY', {
    maximumFractionDigits: 0,
  }).format(precio);

  const etiquetaMoneda = moneda === 'USD' ? 'USD' : 'Gs.';
  let texto = `${etiquetaMoneda} ${numero}`;

  if (operacion === 'alquiler' && periodo === 'mes') texto += ' /mes';
  if (operacion === 'alquiler' && periodo === 'dia') texto += ' /día';

  return texto;
}

const LABELS_TIPO: Record<Bien['tipo'], string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  duplex: 'Dúplex',
  terreno: 'Terreno',
  oficina: 'Oficina',
  local: 'Local comercial',
  deposito: 'Depósito',
  quinta: 'Quinta',
};

const LABELS_OPERACION: Record<Bien['operacion'], string> = {
  venta: 'En venta',
  alquiler: 'En alquiler',
};

const LABELS_ESTADO: Record<Bien['estado'], string> = {
  disponible: 'Disponible',
  reservado: 'Reservado',
  vendido: 'Vendido',
  alquilado: 'Alquilado',
};

export const tipoLabel = (t: Bien['tipo']) => LABELS_TIPO[t];
export const operacionLabel = (o: Bien['operacion']) => LABELS_OPERACION[o];
export const estadoLabel = (e: Bien['estado']) => LABELS_ESTADO[e];

/** Un bien est-il encore proposé activement ? */
export const estaActivo = (bien: Bien) =>
  bien.estado === 'disponible' || bien.estado === 'reservado';

/** Surface affichable. Priorité au terrain pour les terrenos. */
export function formatSuperficie(bien: Bien): string | null {
  if (bien.tipo === 'terreno' && bien.superficie_terreno) {
    return `${bien.superficie_terreno} m² de terreno`;
  }
  if (bien.superficie_construida) {
    return `${bien.superficie_construida} m² construidos`;
  }
  if (bien.superficie_terreno) {
    return `${bien.superficie_terreno} m²`;
  }
  return null;
}

/** Localisation lisible : "Villa Morra, Asunción". */
export function formatUbicacion(bien: Bien): string {
  return [bien.barrio, bien.ciudad].filter(Boolean).join(', ');
}
