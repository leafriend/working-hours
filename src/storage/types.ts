import { Nullable } from "../lib";
import { LogSource } from "../log/types";

export interface LogsSet {
  getLogs(yearMonth: string): (Nullable<LogSource>)[];
  setLogs(yearMonth: string, logs: (Nullable<LogSource>)[]): void;
}
