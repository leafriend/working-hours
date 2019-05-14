import React from 'react';

import './Article.scss';
import { DailyLog } from './DailyLog';
import { Log, LogSource } from './log/types';

export interface ArticlaProps {
  yearMonth: string;
  logs: Log[];
  onLogsChange: (i: number, source: LogSource) => void,
}

export const Article: React.FC<ArticlaProps> = props => {
  const [year, month] = props.yearMonth.split('-').map(str => parseInt(str, 10));

  const logs = props.logs.map((log, i) => (
    <DailyLog
      key={i}
      date={new Date(year, month - 1, i + 1)}
      log={log}
      onLogChange={source => props.onLogsChange(i, source)}
    />
  ));

  return (
    <article>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Leave</th>
            <th>Started</th>
            <th>Finished</th>
            <th>Working</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {logs}
        </tbody>
      </table>
    </article>
  );
};
