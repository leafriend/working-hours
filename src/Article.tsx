import React from 'react';

import './Article.scss';
import { DailyLog } from './DailyLog';
import { Log, LogSource } from './log/types';

export interface ArticlaProps {
  holidays: string[];
  yearMonth: string;
  logs: Log[];
  onLogsChange: (i: number, source: LogSource) => void,
}

export const Article: React.FC<ArticlaProps> = props => {

  const logs = props.logs.map((log, i) => (
    <DailyLog
      key={i}
      holidays={props.holidays}
      log={log}
      onLogChange={source => props.onLogsChange(i, source)}
    />
  ));

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
        {logs}
      </tbody>
    </table>
  );
};
