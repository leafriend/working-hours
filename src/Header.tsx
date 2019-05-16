import React from 'react';

import './Header.scss';

export interface HeaderProps {
  yearMonth: string;
}

export const Header: React.FC<HeaderProps> = props => {
  return (
    <header>Working Hours of {props.yearMonth}</header>
  );
};
