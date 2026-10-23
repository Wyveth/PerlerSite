/** Retourne la première image d'un champ pictureUrl (string, tableau ou null) */
export function firstPicture(pictureUrl: string | string[] | null | undefined): string {
  if (!pictureUrl) return '';
  return Array.isArray(pictureUrl) ? (pictureUrl[0] ?? '') : pictureUrl;
}

/** Retourne toutes les images d'un champ pictureUrl sous forme de tableau */
export function allPictures(pictureUrl: string | string[] | null | undefined): string[] {
  if (!pictureUrl) return [];
  return Array.isArray(pictureUrl) ? pictureUrl.filter(Boolean) : [pictureUrl];
}
