import React, { ReactElement, useEffect } from 'react';

import './MonthlyLog.scss';
import DailyLog from './DailyLog';
import { Log } from './log/types';

export interface MonthlyLogProps {
  logs: Log[];
  onActivate: (activeDate: string) => void,
}

export default function MonthlyLog(props: MonthlyLogProps): ReactElement {
  useEffect(() => {
    props.logs.forEach(log => {
      if (log.isActive) {
        props.onActivate(log.date);
      }
    })
  });
  return (
    <table className="monthly-logs">
      <thead>
        <tr>
          <th className="date">D.</th>
          <th>Leave</th>
          <th className="time">Start</th>
          <th className="time">Fin.</th>
          <th className="time">Work</th>
          <th className="time">All</th>
          <th className="time">Target</th>
          <th className="time">Bal.</th>
        </tr>
      </thead>
      <tbody>
        {props.logs.map(log => (
          <DailyLog
            key={log.date}
            log={log}
            onActivate={props.onActivate}
          />
        ))}
      </tbody>
    </table>
  );
};
