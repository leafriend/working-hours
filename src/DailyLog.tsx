import React from 'react';

import { Log, LeaveType } from './log/types';

export interface DailyLogProps {
  date: Date;
  log: Log;
  onLogChange: (log: Log) => void,
}

type LeaveTypeLog = Pick<Log, 'leaveType'>;
type StartedAtLog = Pick<Log, 'startedAt'>;
type FinishedAtLog = Pick<Log, 'finishedAt'>;
type PartialLog = LeaveTypeLog | StartedAtLog | FinishedAtLog;

const SATURDAY = 6;
const SUNDAY = 0;

export const DailyLog: React.FC<DailyLogProps> = props => {
  const log = props.log;

  const leaveType = log.leaveType;
  const startedAt = log.startedAt || '';
  const finishedAt = log.finishedAt || '';

  const weekday = props.date.getDay();
  const disabled = weekday === SATURDAY || weekday === SUNDAY;
  const readOnly = leaveType === LeaveType.FULL;

  function handleChange(partial: PartialLog) {
    props.onLogChange({
      ...log,
      ...partial,
    });
  }

  return (
    <tr>
      <td>{props.date.getDate()}</td>
      <td>
        <select
          disabled={disabled}
          value={leaveType}
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
          value={startedAt}
          onChange={e => handleChange({ startedAt: e.target.value || undefined })}
        />
      </td>
      <td>
        <input
          disabled={disabled}
          readOnly={disabled ? false : (readOnly || startedAt === '')}
          type="time"
          value={finishedAt}
          onChange={e => handleChange({ finishedAt: e.target.value || undefined })}
        />
      </td>
      <td>00:00</td>
      <td>00:00</td>
    </tr>
  );

}
