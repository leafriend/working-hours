export interface StartedLog {
  startedAt: string;
}

export interface FinishedLog {
  startedAt: string;
  finishedAt: string;
}

export enum LeaveType {
  FULL,
  HALF,
}

export interface LeaveLog {
  leaveType: LeaveType;
}

export type Log = StartedLog | FinishedLog | LeaveLog;
