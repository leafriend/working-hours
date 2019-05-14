import { convertMinutesToTime, convertTimeToMinutes } from "../lib";

export enum LeaveType {
  WORK = 'WORK',
  FULL = 'FULL',
  HALF = 'HALF',
}

export interface LogSource {
  readonly leaveType: LeaveType;
  readonly startedAt?: string;
  readonly finishedAt?: string;
}

export interface BalanceHolder {
  readonly balance: string
}

export class Log {

  public readonly leaveType: LeaveType;

  public readonly startedAt?: string;

  public readonly finishedAt?: string;

  public constructor(
    log: LogSource,
    private readonly balanceHolder: BalanceHolder,
  ) {
    this.leaveType = log.leaveType;
    this.startedAt = log.startedAt;
    this.finishedAt = log.finishedAt;
  }

  public get working(): string | undefined {
    if (this.startedAt === undefined || this.finishedAt === undefined) {
      return undefined;
    }

    const startedAt = convertTimeToMinutes(this.startedAt);
    const finishedAt = convertTimeToMinutes(this.finishedAt);
    const total = finishedAt - startedAt;

    const working = (() => {
      if (this.leaveType !== LeaveType.WORK && total < (4.5 * 1) * 60) {
        return total - (30 * (1 - 1));

      } else if (this.leaveType !== LeaveType.WORK && total < (4.5 * 2) * 60) {
        return total - (30 * (2 - 1));

      } else if (total < (4.5 * 3) * 60) {
        return total - (30 * (3 - 1));

      } else {
        return total - 90;
      }
    })()

    return convertMinutesToTime(working);
  }

  public get overtime(): string | undefined {
    const working = this.working;
    if (working === undefined) {
      return undefined;
    }

    const basetime = this.leaveType === LeaveType.HALF ? 4 : 8;
    const overMinutes = convertTimeToMinutes(working) - (basetime * 60);
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

export function toSource({ leaveType, startedAt, finishedAt }: LogSource): LogSource {
  return { leaveType, startedAt, finishedAt };
}
