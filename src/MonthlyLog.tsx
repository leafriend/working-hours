import React from 'react';

import './MonthlyLog.scss';
import { DailyLog } from './DailyLog';
import { Log, LogSource } from './log/types';

export interface ArticlaProps {
  holidays: string[];
  yearMonth: string;
  logs: Log[];
  onLogsChange: (source: LogSource) => void,
}

export const MonthlyLog: React.FC<ArticlaProps> = props => {
  return (
    <table className="monthly-logs">
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
        {props.logs.map(log => (
          <DailyLog
            key={log.date}
            holidays={props.holidays}
            log={log}
            onLogChange={source => props.onLogsChange(source)}
          />
        ))}
      </tbody>
    </table>
  );
};
