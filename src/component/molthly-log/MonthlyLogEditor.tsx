import React, { ReactElement, Fragment } from 'react';

import './MonthlyLogEditor.scss';

import { LeaveType, Log } from '../../log/types';

import { CaculatedLog, formatu } from './CaculatedLog';
import { TODAY } from './MonthlyLog';

export interface MonthlyLogEditorProps {
  calculatedLog: CaculatedLog | null;
  onLogChange: (log: Log) => void,
  onActivate: (activeDate: string) => void,
}

type LeaveTypeLog = Pick<Log, 'leaveType'>;
type StartedAtLog = Pick<Log, 'startedAt'>;
type FinishedAtLog = Pick<Log, 'finishedAt'>;
type PartialLog = LeaveTypeLog | StartedAtLog | FinishedAtLog;

export default function MonthlyLogEditor(props: MonthlyLogEditorProps): ReactElement {
  const log = props.calculatedLog

  const disabled = log === null || log.isHoliday || log.isSunday || log.isSaturday;
  const readOnly = log !== null && (log.leaveType === LeaveType.FULL);

  function handleChange(partial: PartialLog) {
    if (props.calculatedLog === null) {
      return;
    }

    const log = {
      date: props.calculatedLog.date,
      isHoliday: props.calculatedLog.isHoliday,
      leaveType: props.calculatedLog.leaveType,
      startedAt: formatu(props.calculatedLog.startedAt),
      finishedAt: formatu(props.calculatedLog.finishedAt),
      ...partial,
    };

    props.onLogChange(log);
  }

  const date = log ? log.date : 'Select a date';
  const leaveType = log ? log.leaveType : LeaveType.WORK;
  const startedAt = log ? formatu(log.startedAt) || '' : '';
  const finishedAt = log ? formatu(log.finishedAt) || '' : '';

  return (
    <div className="LogEditor">
      <div className="heading">
        <h2>{date}</h2>
        {log !== null && log.date === TODAY ? null : (
        <a
          href={`#log-${TODAY}`}
          onClick={e => {
            e.preventDefault();
            props.onActivate(TODAY);
          }}
        >Today</a>
        )}
      </div>
      <div className="form-group">
        <label>
          Leave Type:
          <select
            disabled={disabled}
            value={leaveType}
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
            value={startedAt}
            onChange={e => handleChange({ startedAt: e.target.value || undefined })}
          />
        </label>
        <label>
          Finished:
          <input
            disabled={disabled}
            readOnly={disabled ? false : (readOnly || (log ? log.startedAt === undefined : true))}
            type="time"
            value={finishedAt}
            onChange={e => handleChange({ finishedAt: e.target.value || undefined })}
          />
        </label>
      </div>
    </div>
  );

}
