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
  console.log(`DailyLog() <<< `, props);

  const date = new Date(props.log.date);
  const weekday = date.getDay();
  const disabled = weekday === SATURDAY || weekday === SUNDAY;
  const readOnly = props.log.leaveType === LeaveType.FULL;

  function handleChange(partial: PartialLog) {
    const source = {
      ...props.log,
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
          value={props.log.leaveType}
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
          value={props.log.startedAt || ''}
          onChange={e => handleChange({ startedAt: e.target.value || undefined })}
        />
      </td>
      <td>
        <input
          disabled={disabled}
          readOnly={disabled ? false : (readOnly || props.log.startedAt === '')}
          type="time"
          value={props.log.finishedAt || ''}
          onChange={e => handleChange({ finishedAt: e.target.value || undefined })}
        />
      </td>
      <td>{props.log.working || '--:--'}</td>
      <td>{props.log.balance}</td>
    </tr>
  );

}
