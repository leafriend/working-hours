import React from 'react';

import { Log, LeaveType } from './log/types';

export interface DailyLogProps {
  date: number;
  log: Log;
}

export const DailyLog: React.FC<DailyLogProps> = props => {
  const log = props.log;
  const leaveType = log.leaveType;
  const startedAt = log && 'startedAt' in log ? log.startedAt : undefined;
  const finishedAt = log && 'finishedAt' in log ? log.finishedAt : undefined;

  return (
    <tr>
      <td>{props.date}</td>
      <td>
      <select
          value={leaveType}
        >
          <option value={LeaveType.WORK}>Work</option>
          <option value={LeaveType.FULL}>Full</option>
          <option value={LeaveType.HALF}>Half</option>
        </select>
      </td>
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
      <td>00:00</td>
      <td>00:00</td>
    </tr>
  );

}
