export enum LeaveType {
  WORK = 'WORK',
  HALF = 'HALF',
  FULL = 'FULL',
}

export interface Log {
  readonly date: string;
  readonly isHoliday: boolean;
  readonly leaveType: LeaveType;
  readonly startedAt?: string;
  readonly finishedAt?: string;
}

export interface YearMonthLog {
  readonly yearMonth: string;
  readonly logs: Log[];
}
