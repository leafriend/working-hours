import React from 'react';

import './MonthlyLog.scss';
import { DailyLog } from './DailyLog';
import { Log, LogSource } from './log/types';

export interface ArticlaProps {
  holidays: string[];
  yearMonth: string;
  logs: Log[];
  onLogsChange: (i: number, source: LogSource) => void,
}

export const MonthlyLog: React.FC<ArticlaProps> = props => {
  return (
    <table>
      <thead>
        <tr>
          <th className="date">Date</th>
          <th>Leave</th>
          <th className="time">Started</th>
          <th className="time">Finished</th>
          <th className="time">Working</th>
          <th className="time">Balance</th>
        </tr>
      </thead>
      <tbody>
        {props.logs.map((log, i) => (
          <DailyLog
            key={i}
            holidays={props.holidays}
            log={log}
            onLogChange={source => props.onLogsChange(i, source)}
          />
        ))}
      </tbody>
    </table>
  );
};
