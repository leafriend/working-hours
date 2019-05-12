import { lastDateOf } from "../lib";
import { Log, LeaveType } from "../log/types";

import { LogsSet } from "./types";

interface Hash {
  [yearMonth: string]: Log[];
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

  public getLogs(yearMonth: string): Log[] {
    if (yearMonth in this.hash) {
      return this.hash[yearMonth];
    }

    const [year, month] = yearMonth.split('-').map(str => parseInt(str));
    const lastDate = lastDateOf(year, month);

    const logs = Array<Log>(lastDate).fill({
      leaveType: LeaveType.WORK,
      startedAt: undefined,
      finishedAt: undefined,
    });
    this.setLogs(yearMonth, logs);
    return logs;
  }

  public setLogs(yearMonth: string, logs: Log[]): void {
    this.hash[yearMonth] = logs;

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.hash));
  }

}
