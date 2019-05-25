import React, { PropsWithChildren, ReactElement } from 'react';

import './Header.scss';

export interface HeaderProps {
  yearMonth: string;
}

export default function Header(props: PropsWithChildren<HeaderProps>): ReactElement {
  return (
    <header>Working Hours of {props.yearMonth}</header>
  );
};
