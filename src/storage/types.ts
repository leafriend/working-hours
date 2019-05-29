import { Log } from "../log/types";

export interface LogsSet {
  getLogs(yearMonth: string): Log[];
  setLogs(yearMonth: string, logs: Log[]): void;
}
