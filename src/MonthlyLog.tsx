import React, { ReactElement } from 'react';

import './MonthlyLog.scss';
import DailyLog from './DailyLog';
import { Log, LogSource } from './log/types';

export interface MonthlyLogProps {
  holidays: string[];
  yearMonth: string;
  logs: Log[];
  onLogChange: (source: LogSource) => void,
  onActivate: (activeDate: string) => void,
}

export default function MonthlyLog(props: MonthlyLogProps): ReactElement {
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
            onLogChange={source => props.onLogChange(source)}
            onActivate={props.onActivate}
          />
        ))}
      </tbody>
    </table>
  );
};
