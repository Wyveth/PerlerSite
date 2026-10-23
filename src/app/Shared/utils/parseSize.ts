export function parseSize(size: string) {
  let sizeParts = size.split('x');
  let height = sizeParts[0].replace(',', '.').trim();
  let width = sizeParts[1].replace(',', '.').trim();

  return { height, width };
}

/**
 * Convertit une taille en perles midi (5 mm) en taille équivalente en perles mini (2,5 mm).
 * Exemple : "50 x 30" => "25 x 15"
 */
export function toMiniSize(size: string | null | undefined): string {
  if (!size || !size.includes('x')) return '';
  const { height, width } = parseSize(size);
  const half = (value: string) => {
    const n = parseFloat(value);
    if (isNaN(n)) return value;
    return (Math.round((n / 2) * 10) / 10).toString().replace('.', ',');
  };
  return `${half(height)} x ${half(width)}`;
}
