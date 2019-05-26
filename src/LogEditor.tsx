import React, { ReactElement } from 'react';

import { Log, LeaveType, LogSource } from './log/types';

export interface LogEditorProps {
  log: Log;
  onLogChange: (source: LogSource) => void,
}

type LeaveTypeLog = Pick<Log, 'leaveType'>;
type StartedAtLog = Pick<Log, 'startedAt'>;
type FinishedAtLog = Pick<Log, 'finishedAt'>;
type PartialLog = LeaveTypeLog | StartedAtLog | FinishedAtLog;

export default function LogEditor(props: LogEditorProps): ReactElement {
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
    <React.Fragment>
      <div>
        {log.date}
        <select
          disabled={disabled}
          value={log.leaveType}
          onChange={e => handleChange({ leaveType: e.target.value as LeaveType })}
        >
          <option value={LeaveType.WORK}>Work</option>
          <option value={LeaveType.HALF}>Half</option>
          <option value={LeaveType.FULL}>Full</option>
        </select>
      </div>
      <div>
        started:
        <input
          disabled={disabled}
          readOnly={disabled ? false : readOnly}
          type="time"
          value={log.startedAt || ''}
          onChange={e => handleChange({ startedAt: e.target.value || undefined })}
        />
        finished:
        <input
          disabled={disabled}
          readOnly={disabled ? false : (readOnly || log.startedAt === '')}
          type="time"
          value={log.finishedAt || ''}
          onChange={e => handleChange({ finishedAt: e.target.value || undefined })}
        />
      </div>
      <div>
        working: {log.working || '--:--'}{', '}
        balance: {log.balance}{', '}
        overall: {log.overall}
      </div>
    </React.Fragment>
  );

}
