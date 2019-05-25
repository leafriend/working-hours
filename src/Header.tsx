import React, { ReactElement } from 'react';

import './Header.scss';

export interface HeaderProps {
  yearMonth: string;
}

export default function Header(props: HeaderProps): ReactElement {
  return (
    <header>Working Hours of {props.yearMonth}</header>
  );
};
