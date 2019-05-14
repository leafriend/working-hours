import { Nullable } from "../lib";
import { LogSource } from "../log/types";

export interface LogsSet {
  getLogSources(yearMonth: string): (Nullable<LogSource>)[];
  setLogSources(yearMonth: string, logs: (Nullable<LogSource>)[]): void;
}
