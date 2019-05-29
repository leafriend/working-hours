import { zerofill } from "../../lib";
import { LeaveType, Log } from "../../log/types";

export function parse(time: string): number {
  const sign = time.charAt(0) === '-' ? -1 : 1;
  const abs = sign < 0 ? time.substring(1) : time;
  const [hours, minutes] = abs.split(':').map(str => parseInt(str, 10));
  return sign * (hours * 60 + minutes);
}

export function format(minutes: number): string {
  const sign = minutes < 0 ? '-' : ''
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const rest = abs - (hours * 60);
  return `${sign}${zerofill(hours)}:${zerofill(rest)}`;
}

export interface Accumulation {
  readonly overall: string;
  readonly target: string;
  readonly balance: string
}

const SATURDAY = 6;
const SUNDAY = 0;

export class CaculatedLog {

  public readonly date: string;

  public readonly isHoliday: boolean;

  public readonly leaveType: LeaveType;

  public readonly startedAt?: string;

  public readonly finishedAt?: string;

  public readonly isSaturday: boolean;

  public readonly isSunday: boolean;

  public constructor(
    log: Log,
    private readonly accumulation: Accumulation,
    public isActive: boolean,
  ) {
    this.date = log.date;
    this.isHoliday = log.isHoliday;
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
      return this.accumulation.overall;
    }

    const overall = parse(this.accumulation.overall);
    const working = parse(this.working!);
    return format(overall + working);

  }

  public get target(): string {

    if (this.isHoliday || this.isSaturday || this.isSunday) {
      return this.accumulation.target;
    }

    const target = parse(this.accumulation.target);
    return format(target + 8 * 60);

  }

  public get working(): string | undefined {
    if (this.leaveType === LeaveType.FULL) {
      return format(9.5 * 60);
    }

    if (this.startedAt === undefined || this.finishedAt === undefined) {
      return undefined;
    }

    const startedAt = parse(this.startedAt);
    const finishedAt = parse(this.finishedAt);
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

    return format(working);
  }

  public get overtime(): string | undefined {
    const working = this.working;
    if (working === undefined) {
      return undefined;
    }

    const overMinutes = parse(working) - (8 * 60);
    return format(overMinutes);
  }

  public get balance(): string {
    const overtime = this.overtime;
    if (overtime === undefined) {
      return this.accumulation.balance;
    }

    const balanceMinutes = parse(this.accumulation.balance);
    const overtimeMinutes = parse(overtime);

    return format(balanceMinutes + overtimeMinutes);
  }

}
