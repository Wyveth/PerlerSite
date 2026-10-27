import { Product } from 'src/app/api/models/class/product';
import { availabilityBadge, hasAvailability, sizeAvailability } from './availability';

describe('availability utils', () => {
  const product = (fields: Partial<Product>) => fields as Product;

  it('should report stock first, then on-demand, then nothing', () => {
    expect(sizeAvailability(2, false)).toEqual({ status: 'stock', quantity: 2 });
    expect(sizeAvailability(0, true)).toEqual({ status: 'demand', quantity: 0 });
    expect(sizeAvailability(undefined, false)).toEqual({ status: 'none', quantity: 0 });
    expect(sizeAvailability(-3, false).status).toBe('none');
  });

  it('should ignore products whose availability was never filled in', () => {
    expect(hasAvailability(product({}))).toBeFalse();
    expect(availabilityBadge(product({}))).toBeNull();
  });

  it('should compute the gallery badge', () => {
    expect(availabilityBadge(product({ stockMini: 1, onDemandMidi: false }))).toBe('stock');
    expect(availabilityBadge(product({ stockMidi: 0, onDemandMidi: true }))).toBe('demand');
    expect(availabilityBadge(product({ stockMidi: 0, onDemandMidi: false }))).toBeNull();
  });
});
