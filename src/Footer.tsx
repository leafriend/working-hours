import React, { useState } from 'react';

import './Footer.scss';
import { MonthlyLog } from './MonthlyLog';

const TABLE = MonthlyLog.toString();

export interface FooterProps {
  viewMode: string;
  handleViewModeChange: (viewMode: string) => void
}

export const Footer: React.FC<FooterProps> = props => {
  return (
    <footer>
      <select
        value={props.viewMode}
        onChange={e => props.handleViewModeChange(e.target.value)}
      >
        <option value={TABLE}>Table</option>
      </select>
      |
      <a
        href="https://github.com/leafriend/working-hours/"
        target="_blank"
      >Github</a>
    </footer>
  );
};
