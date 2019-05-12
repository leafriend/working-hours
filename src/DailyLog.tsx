import React from 'react';

import { Log, LeaveType } from './log/types';

export interface DailyLogProps {
  date: Date;
  log: Log;
}

export const DailyLog: React.FC<DailyLogProps> = props => {
  const log = props.log;

  const leaveType = log.leaveType;
  const startedAt = log.startedAt || '';
  const finishedAt = log.finishedAt || '';

  return (
    <tr>
      <td>{props.date.getDate()}</td>
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
