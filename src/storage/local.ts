import { lastDateOf, Nullable, zerofill } from "../lib";
import { Log } from "../log/types";

import { LogsSet } from "./types";

interface Hash {
  [yearMonth: string]: Nullable<Log>[];
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
    Object.entries(this.hash).forEach(([key, logs]) => {
      this.hash[key] = logs.map((log, i) => {
        if (log && !log.date) {
          return {
            date: `${key}-${zerofill(i + 1)}`,
            ...log,
          }
        } else {
          return log;
        }
      });
    })
  }

  public getLogs(yearMonth: string): Nullable<Log>[] {
    if (yearMonth in this.hash) {
      return this.hash[yearMonth];
    }

    const [year, month] = yearMonth.split('-').map(str => parseInt(str));
    const lastDate = lastDateOf(year, month);

    const logs = Array<Nullable<Log>>(lastDate).fill(null);
    this.setLogs(yearMonth, logs);
    return logs;
  }

  public setLogs(yearMonth: string, logs: Nullable<Log>[]): void {
    this.hash[yearMonth] = logs.map(log => (log ? { ...log } : null));

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.hash));
  }

}
