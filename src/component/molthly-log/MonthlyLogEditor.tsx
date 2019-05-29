import React, { ReactElement } from 'react';

import './MonthlyLogEditor.scss';

import { LeaveType, Log, LogSource } from '../../log/types';

export interface MonthlyLogEditorProps {
  log: Log;
  onLogChange: (source: LogSource) => void,
}

type LeaveTypeLog = Pick<Log, 'leaveType'>;
type StartedAtLog = Pick<Log, 'startedAt'>;
type FinishedAtLog = Pick<Log, 'finishedAt'>;
type PartialLog = LeaveTypeLog | StartedAtLog | FinishedAtLog;

export default function MonthlyLogEditor(props: MonthlyLogEditorProps): ReactElement {
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
    <div className="LogEditor">
      <h2>{log.date}</h2>
      <div className="form-group">
        <label>
          Leave Type:
          <select
            disabled={disabled}
            value={log.leaveType}
            onChange={e => handleChange({ leaveType: e.target.value as LeaveType })}
          >
            <option value={LeaveType.WORK}>Work</option>
            <option value={LeaveType.HALF}>Half</option>
            <option value={LeaveType.FULL}>Full</option>
          </select>
        </label>
        <label>
          Started:
          <input
            disabled={disabled}
            readOnly={disabled ? false : readOnly}
            type="time"
            value={log.startedAt || ''}
            onChange={e => handleChange({ startedAt: e.target.value || undefined })}
          />
        </label>
        <label>
          Finished:
          <input
            disabled={disabled}
            readOnly={disabled ? false : (readOnly || log.startedAt === '')}
            type="time"
            value={log.finishedAt || ''}
            onChange={e => handleChange({ finishedAt: e.target.value || undefined })}
          />
        </label>
      </div>
    </div>
  );

}
