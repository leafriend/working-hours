export enum LeaveType {
  WORK = 'WORK',
  FULL = 'FULL',
  HALF = 'HALF',
}

export interface LeaveLog {
  leaveType: LeaveType;
  startedAt?: string;
  finishedAt?: string;
}

export interface StartedLog {
  leaveType: LeaveType;
  startedAt: string;
  finishedAt?: string;
}

export interface FinishedLog {
  leaveType: LeaveType;
  startedAt: string;
  finishedAt: string;
}

export type Log = LeaveLog | StartedLog | FinishedLog;
