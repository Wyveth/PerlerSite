export function parseTime(time: string) {
  let hours = 0;
  let minutes = 0;

  if (!time) return { hours, minutes };

  const hourMatch = time.match(/(\d+)\s*h/);
  const minuteMatch = time.match(/(\d+)\s*(min|m)/);

  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }

  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }

  return { hours, minutes };
}
