import React from 'react';

import './Article.scss';
import { Log } from './log/types';
import { DailyLog } from './DailyLog';

export interface ArticlaProps {
  logs: Log[];
}

export const Article: React.FC<ArticlaProps> = props => {
  const logs = props.logs.map((log, i) => {
    const date = i + 1;
    return (
      <DailyLog
        key={i}
        date={date}
        log={log}
      />
    );
  });
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
