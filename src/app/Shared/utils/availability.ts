import { Product } from 'src/app/api/models/class/product';

/** État de disponibilité d'une pièce pour une taille de perle */
export type AvailabilityStatus = 'stock' | 'demand' | 'none';

export interface SizeAvailability {
  status: AvailabilityStatus;
  quantity: number;
}

export function sizeAvailability(stock: number | null | undefined, onDemand: boolean | null | undefined): SizeAvailability {
  const quantity = Math.max(0, Math.floor(Number(stock) || 0));
  if (quantity > 0) return { status: 'stock', quantity };
  if (onDemand) return { status: 'demand', quantity: 0 };
  return { status: 'none', quantity: 0 };
}

/** Vrai si la disponibilité a déjà été renseignée dans l'admin (anciennes pièces : non) */
export function hasAvailability(product: Product): boolean {
  return [product.stockMidi, product.stockMini, product.onDemandMidi, product.onDemandMini].some(
    v => v !== undefined && v !== null
  );
}

/** Badge résumé pour la galerie : en stock (Midi ou Mini) > sur demande > rien */
export function availabilityBadge(product: Product): AvailabilityStatus | null {
  if (!hasAvailability(product)) return null;
  const midi = sizeAvailability(product.stockMidi, product.onDemandMidi);
  const mini = sizeAvailability(product.stockMini, product.onDemandMini);
  if (midi.status === 'stock' || mini.status === 'stock') return 'stock';
  if (midi.status === 'demand' || mini.status === 'demand') return 'demand';
  return null;
}
