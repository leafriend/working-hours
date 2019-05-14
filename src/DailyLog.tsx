import React from 'react';

import { Log, LeaveType, LogSource } from './log/types';

export interface DailyLogProps {
  log: Log;
  onLogChange: (source: LogSource) => void,
}

type LeaveTypeLog = Pick<Log, 'leaveType'>;
type StartedAtLog = Pick<Log, 'startedAt'>;
type FinishedAtLog = Pick<Log, 'finishedAt'>;
type PartialLog = LeaveTypeLog | StartedAtLog | FinishedAtLog;

const SATURDAY = 6;
const SUNDAY = 0;

export const DailyLog: React.FC<DailyLogProps> = props => {
  const log = props.log

  const date = new Date(log.date);
  const weekday = date.getDay();
  const disabled = weekday === SATURDAY || weekday === SUNDAY;
  const readOnly = log.leaveType === LeaveType.FULL;

  function handleChange(partial: PartialLog) {
    const source = {
      ...log,
      ...partial,
    };

    props.onLogChange(source);
  }

  return (
    <tr>
      <td>{date.getDate()}</td>
      <td>
        <select
          disabled={disabled}
          value={log.leaveType}
          onChange={e => handleChange({ leaveType: e.target.value as LeaveType })}
        >
          <option value={LeaveType.WORK}>Work</option>
          <option value={LeaveType.FULL}>Full</option>
          <option value={LeaveType.HALF}>Half</option>
        </select>
      </td>
      <td>
        <input
          disabled={disabled}
          readOnly={disabled ? false : readOnly}
          type="time"
          value={log.startedAt || ''}
          onChange={e => handleChange({ startedAt: e.target.value || undefined })}
        />
      </td>
      <td>
        <input
          disabled={disabled}
          readOnly={disabled ? false : (readOnly || log.startedAt === '')}
          type="time"
          value={log.finishedAt || ''}
          onChange={e => handleChange({ finishedAt: e.target.value || undefined })}
        />
      </td>
      <td>{log.working || '--:--'}</td>
      <td>{log.balance}</td>
    </tr>
  );

}
