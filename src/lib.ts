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
