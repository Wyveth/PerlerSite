import { formatSize, parseSize, sizeArea, toMiniSize } from './parseSize';

describe('parseSize utils', () => {
  it('should split a size into height and width', () => {
    expect(parseSize('39,5 x 36,5')).toEqual({ height: '39.5', width: '36.5' });
    expect(parseSize('50X30')).toEqual({ height: '50', width: '30' });
  });

  it('should halve a Midi size to get the Mini size', () => {
    expect(toMiniSize('50 x 30')).toBe('25 x 15');
    expect(toMiniSize('39,5 x 36,5')).toBe('19,8 x 18,3');
    expect(toMiniSize('')).toBe('');
    expect(toMiniSize(undefined)).toBe('');
  });

  it('should format a size with the × sign', () => {
    expect(formatSize('39,5 x 36,5')).toBe('39,5 × 36,5');
    expect(formatSize(null)).toBe('');
  });

  it('should compute an approximate area', () => {
    expect(sizeArea('10 x 20')).toBe(200);
    expect(sizeArea('abc')).toBe(0);
  });
});
