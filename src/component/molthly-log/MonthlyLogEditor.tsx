import React, { ReactElement } from 'react';

import './MonthlyLogEditor.scss';

import { LeaveType, Log } from '../../log/types';

import { CaculatedLog } from './CaculatedLog';

export interface MonthlyLogEditorProps {
  calculatedLog: CaculatedLog;
  onLogChange: (log: Log) => void,
}

type LeaveTypeLog = Pick<CaculatedLog, 'leaveType'>;
type StartedAtLog = Pick<CaculatedLog, 'startedAt'>;
type FinishedAtLog = Pick<CaculatedLog, 'finishedAt'>;
type PartialLog = LeaveTypeLog | StartedAtLog | FinishedAtLog;

export default function MonthlyLogEditor(props: MonthlyLogEditorProps): ReactElement {
  const log = props.calculatedLog

  const disabled = log.isHoliday || log.isSunday || log.isSaturday;
  const readOnly = log.leaveType === LeaveType.FULL;

  function handleChange(partial: PartialLog) {
    const log = {
      ...props.calculatedLog,
      ...partial,
    };

    props.onLogChange(log);
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
