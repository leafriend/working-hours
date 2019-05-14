import { lastDateOf, Nullable } from "../lib";
import { LogSource, toSource } from "../log/types";

import { LogsSet } from "./types";

interface Hash {
  [yearMonth: string]: (Nullable<LogSource>)[];
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
  }

  public getLogSources(yearMonth: string): (Nullable<LogSource>)[] {
    if (yearMonth in this.hash) {
      return this.hash[yearMonth];
    }

    const [year, month] = yearMonth.split('-').map(str => parseInt(str));
    const lastDate = lastDateOf(year, month);

    const sources = Array<LogSource>(lastDate);
    this.setLogSources(yearMonth, sources);
    return sources;
  }

  public setLogSources(yearMonth: string, sources: (Nullable<LogSource>)[]): void {
    this.hash[yearMonth] = sources.map(toSource);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.hash));
  }

}
