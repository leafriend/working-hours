export enum LeaveType {
  WORK = 'WORK',
  FULL = 'FULL',
  HALF = 'HALF',
}

export interface Log {
  leaveType: LeaveType;
  startedAt?: string;
  finishedAt?: string;
  working?: string;
  balance: string;
}
