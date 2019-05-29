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
