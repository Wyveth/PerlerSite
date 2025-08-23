export function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;

  // Si format 'dd/MM/yyyy'
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1; // JS months: 0-11
  const year = Number(parts[2]);

  return new Date(year, month, day);
}
