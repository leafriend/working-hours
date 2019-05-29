import { zerofill, Nullable } from "../../lib";
import { LeaveType, Log } from "../../log/types";

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

export function toSource(source: Nullable<Log>): Nullable<Log> {
  if (source === null) {
    return null;
  }
  const { date, leaveType, startedAt, finishedAt } = source;
  if (leaveType === LeaveType.WORK && startedAt === undefined && finishedAt === undefined) {
    return null
  }
  return { date, leaveType, startedAt, finishedAt };
}

export interface BalanceHolder {
  readonly overall: string;
  readonly target: string;
  readonly balance: string
}

const SATURDAY = 6;
const SUNDAY = 0;

export class CaculatedLog {

  public readonly date: string;

  public readonly leaveType: LeaveType;

  public readonly startedAt?: string;

  public readonly finishedAt?: string;

  public readonly isSaturday: boolean;

  public readonly isSunday: boolean;

  public constructor(
    log: Log,
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

    if (this.leaveType !== LeaveType.FULL && (this.startedAt === undefined || this.finishedAt === undefined)) {
      return this.balanceHolder.overall;
    }

    const overall = convertTimeToMinutes(this.balanceHolder.overall);
    const working = convertTimeToMinutes(this.working!);
    return convertMinutesToTime(overall + working);

  }

  public get target(): string {

    if (this.isHoliday || this.isSaturday || this.isSunday) {
      return this.balanceHolder.target;
    }

    const target = convertTimeToMinutes(this.balanceHolder.target);
    return convertMinutesToTime(target + 8 * 60);

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
