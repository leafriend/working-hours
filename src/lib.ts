export type Nullable<T> = T | null;

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
  const sign = time.charAt(0) === '-' ? -1 : 1;
  const abs = sign < 0 ? time.substring(1) : time;
  const [hours, minutes] = abs.split(':').map(str => parseInt(str, 10));
  return sign * (hours * 60 + minutes);
}

export function convertMinutesToTime(minutes: number): string {
  const sign = minutes < 0 ? '-' : ''
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const rest = abs - (hours * 60);
  return `${sign}${zerofill(hours)}:${zerofill(rest)}`;
}
