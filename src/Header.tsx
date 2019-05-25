import React, { PropsWithChildren, ReactElement } from 'react';

import './Header.scss';

export interface HeaderProps {
  yearMonth: string;
}

export function Header(props: PropsWithChildren<HeaderProps>): ReactElement {
  return (
    <header>Working Hours of {props.yearMonth}</header>
  );
};
