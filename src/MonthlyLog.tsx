import React, { PropsWithChildren, ReactElement } from 'react';

import './MonthlyLog.scss';
import { DailyLog } from './DailyLog';
import { Log, LogSource } from './log/types';

export interface ArticlaProps {
  holidays: string[];
  yearMonth: string;
  logs: Log[];
  onLogsChange: (source: LogSource) => void,
}

export function MonthlyLog(props: PropsWithChildren<ArticlaProps>): ReactElement {
  return (
    <table className="monthly-logs">
      <thead>
        <tr>
          <th className="date">D.</th>
          <th>Leave</th>
          <th className="time">Start</th>
          <th className="time">Fin.</th>
          <th className="time">Work</th>
          <th className="time">Bal.</th>
          <th className="time">All</th>
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
