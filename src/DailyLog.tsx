import React, { ReactElement } from 'react';

import { Log } from './log/types';

export interface DailyLogProps {
  log: Log;
  onActivate: (activeDate: string) => void,
}

export default function DailyLog(props: DailyLogProps): ReactElement {
  return (
    <tr
      id={`log-${props.log.date}`}
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
      <td className="time">{props.log.startedAt || ''}</td>
      <td className="time">{props.log.finishedAt || ''}</td>
      <td className="time">{props.log.working || ''}</td>
      <td className="time">{props.log.overall}</td>
      <td className="time">{props.log.target}</td>
      <td className="time">{props.log.balance}</td>
    </tr>
  );
}
