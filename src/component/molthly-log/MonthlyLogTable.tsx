import React, { ReactElement } from 'react';

import { CaculatedLog } from './CaculatedLog';

import MonthlyLogRecord from "./MonthlyLogRecord";

export interface MonthlyLogTableProps {
  logs: CaculatedLog[];
  onActivate: (activeDate: string) => void,
}

export default function MonthlyLogTable(props: MonthlyLogTableProps): ReactElement {
  return (
    <table className="monthly-logs">
      <thead>
        <tr>
          <th className="date">D.</th>
          <th className="leave">Leave</th>
          <th className="startedAt time">Start</th>
          <th className="finishedAt time">Fin.</th>
          <th className="working time">Work</th>
          <th className="overall time">All</th>
          <th className="target time">Target</th>
          <th className="balance time">Bal.</th>
        </tr>
      </thead>
      <tbody id="content-container">
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
