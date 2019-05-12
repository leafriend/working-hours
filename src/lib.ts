export function lastDateOf(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function zerofill(i: number): string {
  if (i < 10) {
    return `0${i}`;
  } else {
    return i.toString();
  }
}

export function convertTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(str => parseInt(str, 10));
  return hours * 60 + minutes;
}

export function convertMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes - (hours * 60);
  return `${zerofill(hours)}:${zerofill(rest)}`;
}
