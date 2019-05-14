import { lastDateOf } from "../lib";
import { LeaveType, LogSource, toSource } from "../log/types";

import { LogsSet } from "./types";

interface Hash {
  [yearMonth: string]: LogSource[];
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

  public getLogs(yearMonth: string): LogSource[] {
    if (yearMonth in this.hash) {
      return this.hash[yearMonth];
    }

    const [year, month] = yearMonth.split('-').map(str => parseInt(str));
    const lastDate = lastDateOf(year, month);

    const logs = Array<LogSource>(lastDate).fill({
      leaveType: LeaveType.WORK,
      startedAt: undefined,
      finishedAt: undefined,
    });
    this.setLogs(yearMonth, logs);
    return logs;
  }

  public setLogs(yearMonth: string, logs: LogSource[]): void {
    this.hash[yearMonth] = logs.map(toSource);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.hash));
  }

}
