import { convertMinutesToTime, convertTimeToMinutes, Nullable } from "../lib";

export enum LeaveType {
  WORK = 'WORK',
  HALF = 'HALF',
  FULL = 'FULL',
}

export interface LogSource {
  readonly date: string;
  readonly leaveType: LeaveType;
  readonly startedAt?: string;
  readonly finishedAt?: string;
}

export interface BalanceHolder {
  readonly overall: string;
  readonly balance: string
}

const SATURDAY = 6;
const SUNDAY = 0;

export class Log {

  public readonly date: string;

  public readonly leaveType: LeaveType;

  public readonly startedAt?: string;

  public readonly finishedAt?: string;

  public readonly isSaturday: boolean;

  public readonly isSunday: boolean;

  public constructor(
    log: LogSource,
    private readonly balanceHolder: BalanceHolder,
    public readonly isHoliday: boolean,
    public isActive: boolean,
  ) {
    this.date = log.date;
    this.leaveType = log.leaveType;
    this.startedAt = log.startedAt;
    this.finishedAt = log.finishedAt;

    const date = new Date(log.date);
    const weekday = date.getDay();

    this.isSunday = weekday === SUNDAY;
    this.isSaturday = weekday === SATURDAY;

  }

  public get overall(): string {

    if (this.startedAt === undefined || this.finishedAt === undefined) {
      return this.balanceHolder.overall;
    }

    const overall = convertTimeToMinutes(this.balanceHolder.overall);
    const working = convertTimeToMinutes(this.working!);
    return convertMinutesToTime(overall + working);

  }

  public get working(): string | undefined {
    if (this.leaveType === LeaveType.FULL) {
      return convertMinutesToTime(9.5 * 60);
    }

    if (this.startedAt === undefined || this.finishedAt === undefined) {
      return undefined;
    }

    const startedAt = convertTimeToMinutes(this.startedAt);
    const finishedAt = convertTimeToMinutes(this.finishedAt);
    const total = finishedAt - startedAt;

    const working = (() => {
      switch (this.leaveType) {

        case LeaveType.HALF:
          if (total >= 4 * 60) {
            return 8 * 60;
          }
          return 4 * 60 + total;

        case LeaveType.WORK:
          if (total < (4.5 * 1) * 60) {
            return total - (30 * (1 - 1));

          } else if (total < (4.5 * 2) * 60) {
            return total - (30 * (2 - 1));

          } else if (total < (4.5 * 3) * 60) {
            return total - (30 * (3 - 1));

          } else {
            return total - 90;
          }
      }

    })()

    return convertMinutesToTime(working);
  }

  public get overtime(): string | undefined {
    const working = this.working;
    if (working === undefined) {
      return undefined;
    }

    const overMinutes = convertTimeToMinutes(working) - (8 * 60);
    return convertMinutesToTime(overMinutes);
  }

  public get balance(): string {
    const overtime = this.overtime;
    if (overtime === undefined) {
      return this.balanceHolder.balance;
    }

    const balanceMinutes = convertTimeToMinutes(this.balanceHolder.balance);
    const overtimeMinutes = convertTimeToMinutes(overtime);

    return convertMinutesToTime(balanceMinutes + overtimeMinutes);
  }

}

export function toSource(source: Nullable<LogSource>): Nullable<LogSource> {
  if (source === null) {
    return null;
  }
  const { date, leaveType, startedAt, finishedAt } = source;
  if (leaveType === LeaveType.WORK && startedAt === undefined && finishedAt === undefined) {
    return null
  }
  return { date, leaveType, startedAt, finishedAt };
}
