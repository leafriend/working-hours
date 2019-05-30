import React, { ReactElement } from 'react';

import './Header.scss';

export interface HeaderProps {
  yearMonth: string;
  yearMonths: string[];
  onYearMonthChange: (yearMonth: string) => void;
}

export default function Header(props: HeaderProps): ReactElement {
  return (
    <header>
      Working Hours of
      {' '}
      <select
        value={props.yearMonth}
        onChange={e => props.onYearMonthChange(e.target.value)}
      >
        {props.yearMonths.map(ym => (
          <option key={ym} value={ym}>{ym}</option>
        ))}
      </select>
    </header>
  );
};
