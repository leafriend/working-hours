import React from 'react';

import { Log, LeaveType } from './log/types';
import { convertMinutesToTime, convertTimeToMinutes } from './lib';

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

  const weekday = props.date.getDay();
  const disabled = weekday === SATURDAY || weekday === SUNDAY;
  const readOnly = props.log.leaveType === LeaveType.FULL;

  function handleChange(partial: PartialLog) {
    const log = {
      ...props.log,
      ...partial,
    };

    const working = (() => {
      if (log.startedAt && log.finishedAt) {
        const startedAt = convertTimeToMinutes(log.startedAt);
        const finishedAt = convertTimeToMinutes(log.finishedAt);
        const total = finishedAt - startedAt;

        const working
          = (total >= (8 + 1 + 4 + 0.5) * 60)
            ? (total - 90)
            : total - 60
          ;
        return convertMinutesToTime(working);
      } else {
        return undefined;
      }
    })();

    props.onLogChange({ ...log, working });
  }

  return (
    <tr>
      <td>{props.date.getDate()}</td>
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
