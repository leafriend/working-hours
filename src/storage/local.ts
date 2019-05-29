import { lastDateOf, Nullable, zerofill } from "../lib";
import { LogSource } from "../log/types";

import { LogsSet } from "./types";

interface Hash {
  [yearMonth: string]: Nullable<LogSource>[];
}

const LOCAL_STORAGE_KEY = 'logsSet';

export class LocalLogsSet implements LogsSet {

  private readonly hash: Hash = {}

  public constructor() {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (json === null) {
      localStorage.setItem(LOCAL_STORAGE_KEY, '{}');
    } else {
      this.hash = JSON.parse(json);
    }

    // TODO Temporary code: previous version format doesn't contain date
    // -> fill date
    Object.entries(this.hash).forEach(([key, sources]) => {
      this.hash[key] = sources.map((source, i) => {
        if (source && !source.date) {
          return {
            date: `${key}-${zerofill(i + 1)}`,
            ...source,
          }
        } else {
          return source;
        }
      });
    })
  }

  public getLogSources(yearMonth: string): Nullable<LogSource>[] {
    if (yearMonth in this.hash) {
      return this.hash[yearMonth];
    }

    const [year, month] = yearMonth.split('-').map(str => parseInt(str));
    const lastDate = lastDateOf(year, month);

    const sources = Array<Nullable<LogSource>>(lastDate).fill(null);
    this.setLogSources(yearMonth, sources);
    return sources;
  }

  public setLogSources(yearMonth: string, sources: Nullable<LogSource>[]): void {
    this.hash[yearMonth] = sources.map(source => (source ? { ...source } : null));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.hash));
  }

}
