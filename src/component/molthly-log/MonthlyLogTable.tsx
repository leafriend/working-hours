import React, { ReactElement } from 'react';

import { Log } from '../../log/types';

import MonthlyLogRecord from "./MonthlyLogRecord";

export interface MonthlyLogTableProps {
  logs: Log[];
  onActivate: (activeDate: string) => void,
}

export default function MonthlyLogTable(props: MonthlyLogTableProps): ReactElement {
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
          <MonthlyLogRecord
            key={log.date}
            log={log}
            onActivate={props.onActivate}
          />
        ))}
      </tbody>
    </table>
  );
}
