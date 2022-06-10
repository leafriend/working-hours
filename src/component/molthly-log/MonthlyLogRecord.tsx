import React, { ReactElement } from 'react';

import { CaculatedLog, formatu } from './CaculatedLog';
import { TODAY } from './MonthlyLog';

export interface MonthlyLogRecordProps {
  log: Readonly<CaculatedLog>;
  onActivate: (activeDate: string) => void,
}

export default function MonthlyLogRecord(props: MonthlyLogRecordProps): ReactElement {
  return (
    <tr
      id={`log-${props.log.date}`}
      className={[
        props.log.isHoliday ? 'holiday' : (
          props.log.isSunday ? 'sunday' : (
            props.log.isSaturday ? 'saturday' : 'weekday'
          )
        ),
        props.log.date < TODAY ? 'past' : '',
        props.log.date > TODAY ? 'future' : '',
        props.log.date === TODAY ? 'today' : '',
        props.log.isActive ? 'active' : '',
      ].join(' ').replace(/ +/g, ' ').trim()}
      onClick={() => props.onActivate(props.log.date)}
    >
      <td className="date">{new Date(props.log.date).getDate()}</td>
      <td className="leave">{props.log.leaveType.toString().substring(0, 1)}</td>
      <td className="startedAt time">{formatu(props.log.startedAt) || ''}</td>
      <td className="finishedAt time">{formatu(props.log.finishedAt) || ''}</td>
      <td className="working time">{formatu(props.log.working) || ''}</td>
      <td className="overall time">{formatu(props.log.overall)}</td>
      <td className="target time">{formatu(props.log.target)}</td>
      <td className="balance time">{formatu(props.log.balance)}</td>
    </tr>
  );
}
