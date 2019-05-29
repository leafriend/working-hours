import { lastDateOf, zerofill } from "../lib";
import { Log, LeaveType } from "../log/types";

import { LogsSet } from "./types";

const HOLIDAYS = [
  '2019-05-01',
  '2019-05-06',
  '2019-06-06',
];

interface Hash {
  [yearMonth: string]: Log[];
}

const LOCAL_STORAGE_KEY = 'logsSet';

function newLog(yearMonth: string, day: number): Log {
  const date = `${yearMonth}-${zerofill(day)}`;
  return {
    date,
    isHoliday: HOLIDAYS.includes(date),
    leaveType: LeaveType.WORK,
  };
}

function fill(yearMonth: string): (log: Log | null, i: number) => Log {
  return (log: Log | null, i: number) =>
    log === null ? newLog(yearMonth, i + 1) : log
    ;
}

export class LocalLogsSet implements LogsSet {

  private readonly hash: Hash = {}

  public constructor() {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (json === null) {
      localStorage.setItem(LOCAL_STORAGE_KEY, '{}');
    } else {
      this.hash = JSON.parse(json);

      // Old data fixing: isHoliday
      Object.entries(this.hash).forEach(([yearMonth, logs]) => {
        this.hash[yearMonth] = logs.map(
          ({ date, leaveType, startedAt, finishedAt}) =>
            ({ date, isHoliday: HOLIDAYS.includes(date), leaveType, startedAt, finishedAt})
        );
      });
    }
  }

  public getLogs(yearMonth: string): Log[] {
    if (yearMonth in this.hash) {
      return this.hash[yearMonth].map(fill(yearMonth));
    }

    const [year, month] = yearMonth.split('-').map(str => parseInt(str));
    const lastDate = lastDateOf(year, month);

    const logs = Array<null>(lastDate).fill(null).map(fill(yearMonth));
    this.setLogs(yearMonth, logs);
    return logs;
  }

  public setLogs(yearMonth: string, logs: Log[]): void {
    this.hash[yearMonth] = logs.map(
      ({ date, isHoliday, leaveType, startedAt, finishedAt }) =>
        ({ date, isHoliday, leaveType, startedAt, finishedAt })
    );

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.hash));
  }

}
