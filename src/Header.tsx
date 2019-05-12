import React from 'react';

export interface HeaderProps {
  yearMonth: string;
}

export const Header: React.FC<HeaderProps> = props => {
  return (
    <header>HCWH: {props.yearMonth}</header>
  );
};
