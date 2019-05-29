import { Nullable } from "../lib";
import { Log } from "../log/types";

export interface LogsSet {
  getLogs(yearMonth: string): Log[];
  setLogs(yearMonth: string, logs: Nullable<Log>[]): void;
}
