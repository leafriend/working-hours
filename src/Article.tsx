import React from 'react';

import './Article.scss';
import { Log } from './log/types';

export interface ArticlaProps {
  logs: Log[];
}

export const Articla: React.FC<ArticlaProps> = props => {
  const logs = props.logs.map((log, i) => {
    const startedAt = log && 'startedAt' in log ? log.startedAt : undefined;
    const finishedAt = log && 'finishedAt' in log ? log.finishedAt : undefined;

    return (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>
          <input
            readOnly
            type="time"
            value={startedAt}
          />
        </td>
        <td>
          <input
            readOnly
            type="time"
            value={finishedAt}
          />
        </td>
        <td>
          <label>
            <input type="checkbox" />
            Leave
          </label>
        </td>
        <td>00:00</td>
        <td>00:00</td>
      </tr>
    );
  });
  return (
    <article>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Started</th>
            <th>Finished</th>
            <th>Leave</th>
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
