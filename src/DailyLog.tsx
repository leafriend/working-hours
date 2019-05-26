import React, { ReactElement } from 'react';

import { Log, LeaveType, LogSource } from './log/types';
import { zerofill } from './lib';

export interface DailyLogProps {
  holidays: string[];
  log: Log;
  onLogChange: (source: LogSource) => void,
}

type LeaveTypeLog = Pick<Log, 'leaveType'>;
type StartedAtLog = Pick<Log, 'startedAt'>;
type FinishedAtLog = Pick<Log, 'finishedAt'>;
type PartialLog = LeaveTypeLog | StartedAtLog | FinishedAtLog;

export default function DailyLog(props: DailyLogProps): ReactElement {
  const log = props.log

  const disabled = log.isHoliday || log.isSunday || log.isSaturday;
  const readOnly = log.leaveType === LeaveType.FULL;

  function handleChange(partial: PartialLog) {
    const source = {
      ...log,
      ...partial,
    };

    props.onLogChange(source);
  }

  return (
    <tr className={[
      log.isHoliday ? 'holiday' : (
        log.isSunday ? 'sunday' : (
          log.isSaturday ? 'saturday' : ''
        )
      ),
      log.isActive ? 'active' : '',
    ].join(' ').replace(/ +/g, ' ').trim()}>
      <td className="date">{new Date(log.date).getDate()}</td>
      <td>
        <select
          disabled={disabled}
          value={log.leaveType}
          onChange={e => handleChange({ leaveType: e.target.value as LeaveType })}
        >
          <option value={LeaveType.WORK}>Work</option>
          <option value={LeaveType.HALF}>Half</option>
          <option value={LeaveType.FULL}>Full</option>
        </select>
      </td>
      <td className="time">
        <input
          disabled={disabled}
          readOnly={disabled ? false : readOnly}
          type="time"
          value={log.startedAt || ''}
          onChange={e => handleChange({ startedAt: e.target.value || undefined })}
        />
      </td>
      <td className="time">
        <input
          disabled={disabled}
          readOnly={disabled ? false : (readOnly || log.startedAt === '')}
          type="time"
          value={log.finishedAt || ''}
          onChange={e => handleChange({ finishedAt: e.target.value || undefined })}
        />
      </td>
      <td className="time">{log.working || '--:--'}</td>
      <td className="time">{log.balance}</td>
      <td className="time">{log.overall}</td>
    </tr>
  );

}
