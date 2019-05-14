import { LogSource } from "../log/types";

export interface LogsSet {
  getLogs(yearMonth: string): LogSource[];
  setLogs(yearMonth: string, logs: LogSource[]): void;
}
