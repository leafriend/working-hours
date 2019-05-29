import { zerofill } from "../../lib";
import { LeaveType, Log } from "../../log/types";

export function parseu(time: string | undefined): number | undefined {
  return time === undefined
    ? undefined
    : parse(time)
    ;
}

export function parse(time: string): number {
  const sign = time.charAt(0) === '-' ? -1 : 1;
  const abs = sign < 0 ? time.substring(1) : time;
  const [hours, minutes] = abs.split(':').map(str => parseInt(str, 10));
  return sign * (hours * 60 + minutes);
}

export function formatu(minutes: number | undefined): string | undefined {
  return minutes === undefined
    ? undefined
    : format(minutes)
    ;
}

export function format(minutes: number): string {
  const sign = minutes < 0 ? '-' : ''
  const abs = Math.abs(minutes);
  const hours = Math.floor(abs / 60);
  const rest = abs - (hours * 60);
  return `${sign}${zerofill(hours)}:${zerofill(rest)}`;
}

export interface Accumulation {
  readonly overall: number;
  readonly target: number;
  readonly balance: number
}

const SATURDAY = 6;
const SUNDAY = 0;

export class CaculatedLog {

  public readonly isSaturday: boolean;

  public readonly isSunday: boolean;

  public constructor(
    private readonly log: Log,
    private readonly accumulation: Accumulation,
    public isActive: boolean,
  ) {

    const date = new Date(log.date);
    const weekday = date.getDay();

    this.isSunday = weekday === SUNDAY;
    this.isSaturday = weekday === SATURDAY;

  }

  public get date(): string {
    return this.log.date;
  }

  public get isHoliday(): boolean {
    return this.log.isHoliday;
  }

  public get leaveType(): LeaveType {
    return this.log.leaveType;
  }

  public get startedAt(): number | undefined {
    return parseu(this.log.startedAt);
  }

  public get finishedAt(): number | undefined {
    return parseu(this.log.finishedAt);
  }

  public get working(): number | undefined {
    if (this.leaveType === LeaveType.FULL) {
      return 9.5 * 60;
    }

    if (this.startedAt === undefined || this.finishedAt === undefined) {
      return undefined;
    }

    const total = this.finishedAt - this.startedAt;

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

    return working;
  }

  public get overtime(): number | undefined {
    if (this.working === undefined) {
      return undefined;
    }

    return this.working - (8 * 60);
  }

  public get overall(): number {
    if (this.working === undefined) {
      return this.accumulation.overall;
    }

    return this.accumulation.overall + this.working;
  }

  public get target(): number {

    if (this.isHoliday || this.isSaturday || this.isSunday) {
      return this.accumulation.target;
    }

    return this.accumulation.target + 8 * 60;

  }

  public get balance(): number {
    if (this.overtime === undefined) {
      return this.accumulation.balance;
    }

    return this.accumulation.balance + this.overtime;
  }

}
