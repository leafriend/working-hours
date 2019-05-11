import React from 'react';

export interface HeaderProps {
  month: string;
}

export const Header: React.FC<HeaderProps> = props => {
  return (
    <header>HCWH: {props.month}</header>
  );
};
