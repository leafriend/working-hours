import { lastDateOf, zerofill } from "../lib";
import { Log, LeaveType } from "../log/types";

import { LogsSet } from "./types";

type StoredLog = Pick<Log, 'date' | 'leaveType' | 'startedAt' | 'finishedAt'>;

const HOLIDAYS = [
  '2019-05-01', // 노동절(근로자의날)
  '2019-05-05', // 어린이날
  '2019-05-06', // 어린이날(대체휴일)
  '2019-06-06', // 현충일
  '2019-08-15', // 광복절
  '2019-09-12', // 추석연휴
  '2019-09-13', // 추석
  '2019-09-14', // 추석연휴
  '2019-10-03', // 개천절
  '2019-10-09', // 한글날
  '2019-12-25', // 성탄절
];

interface Hash<T> {
  [yearMonth: string]: T[];
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

  private readonly hash: Hash<Log> = {}

  public constructor() {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (json === null) {
      localStorage.setItem(LOCAL_STORAGE_KEY, '{}');
    } else {
      const hash: Hash<StoredLog | null> = JSON.parse(json);
      Object.entries(hash).forEach(([yearMonth, logs]) => {
        this.hash[yearMonth] = logs.map(
          (log, i) => {
            if (log === null) {
              const date = `${yearMonth}-${zerofill(i + 1)}`;
              return {
                date,
                isHoliday: HOLIDAYS.includes(date),
                leaveType: LeaveType.WORK,
              }
            } else {
              return {
                ...log,
                isHoliday: HOLIDAYS.includes(log.date),
              }
            }
          }
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

    const hash: Hash<StoredLog> = {};
    Object.entries(this.hash).forEach(([yearMonth, logs]) => {
      hash[yearMonth] = logs.map(
        ({ date, leaveType, startedAt, finishedAt }) =>
          ({ date, leaveType, startedAt, finishedAt })
      );
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(hash));
  }

}
