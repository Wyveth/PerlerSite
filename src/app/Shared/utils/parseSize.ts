export function parseSize(size: string) {
  let sizeParts = size.split('x');
  let height = sizeParts[0].replace(',', '.').trim();
  let width = sizeParts[1].replace(',', '.').trim();

  return { height, width };
}
