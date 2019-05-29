export enum LeaveType {
  WORK = 'WORK',
  HALF = 'HALF',
  FULL = 'FULL',
}

export interface Log {
  readonly date: string;
  readonly leaveType: LeaveType;
  readonly startedAt?: string;
  readonly finishedAt?: string;
}
