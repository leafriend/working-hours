import React, { ReactElement } from 'react';

import { CaculatedLog, formatu } from './CaculatedLog';

export interface MonthlyLogRecordProps {
  log: Readonly<CaculatedLog>;
  onActivate: (activeDate: string) => void,
}

export default function MonthlyLogRecord(props: MonthlyLogRecordProps): ReactElement {
  return (
    <tr
      className={[
        props.log.isHoliday ? 'holiday' : (
          props.log.isSunday ? 'sunday' : (
            props.log.isSaturday ? 'saturday' : ''
          )
        ),
        props.log.isActive ? 'active' : '',
      ].join(' ').replace(/ +/g, ' ').trim()}
      onClick={() => props.onActivate(props.log.date)}
    >
      <td className="date">{new Date(props.log.date).getDate()}</td>
      <td>{props.log.leaveType}</td>
      <td className="time">{formatu(props.log.startedAt) || ''}</td>
      <td className="time">{formatu(props.log.finishedAt) || ''}</td>
      <td className="time">{formatu(props.log.working) || ''}</td>
      <td className="time">{formatu(props.log.overall)}</td>
      <td className="time">{formatu(props.log.target)}</td>
      <td className="time">{formatu(props.log.balance)}</td>
    </tr>
  );
}
