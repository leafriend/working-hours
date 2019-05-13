import React from 'react';

import './Article.scss';
import { Log, LeaveType } from './log/types';
import { DailyLog } from './DailyLog';
import { convertTimeToMinutes, convertMinutesToTime } from './lib';

export interface ArticlaProps {
  yearMonth: string;
  logs: Log[];
  onLogsChange: (logs: Log[]) => void,
}

export const Article: React.FC<ArticlaProps> = props => {
  const [year, month] = props.yearMonth.split('-').map(str => parseInt(str, 10));

  const logs = props.logs.map((log, i) => {
    const date = i + 1;

    function handleLogChange(log: Log) {
      const logs = props.logs.slice();
      logs[i] = log;
      let balance = 0;
      props.onLogsChange(logs.map(log => {
        if (log.working) {
          const minimum = (log.leaveType === LeaveType.HALF ? 4 : 8) * 60;
          const working = convertTimeToMinutes(log.working) - minimum;
          balance += working;
        }
        return {
          ...log,
          balance: convertMinutesToTime(balance),
        };
      }));
    }

    return (
      <DailyLog
        key={i}
        date={new Date(year, month - 1, date)}
        log={log}
        onLogChange={handleLogChange}
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
