export function parseSize(size: string) {
  let sizeParts = size.split(/x|×/i);
  let height = sizeParts[0].replace(',', '.').trim();
  let width = sizeParts[1].replace(',', '.').trim();

  return { height, width };
}

/**
 * Convertit une taille en perles midi (5 mm) en taille équivalente en perles mini (2,5 mm).
 * Exemple : "50 x 30" => "25 x 15"
 */
export function toMiniSize(size: string | null | undefined): string {
  if (!size || !/x|×/i.test(size)) return '';
  const { height, width } = parseSize(size);
  const half = (value: string) => {
    const n = parseFloat(value);
    if (isNaN(n)) return value;
    return (Math.round((n / 2) * 10) / 10).toString().replace('.', ',');
  };
  return `${half(height)} x ${half(width)}`;
}

/** Affiche une taille avec le signe × : "39,5 x 36,5" => "39,5 × 36,5" */
export function formatSize(size: string | null | undefined): string {
  if (!size) return '';
  return size.replace(/\s*[x×]\s*/i, ' × ').trim();
}

/** Surface approximative (cm²) d'une taille "H x L", utile pour trier par taille */
export function sizeArea(size: string | null | undefined): number {
  if (!size || !/x|×/i.test(size)) return 0;
  const { height, width } = parseSize(size);
  const h = parseFloat(height);
  const w = parseFloat(width);
  return isNaN(h) || isNaN(w) ? 0 : h * w;
}
