import React, { ReactElement } from 'react';

import './Footer.scss';

import JsonView from '../json-view/JsonView';
import MonthlyLog from '../molthly-log/MonthlyLog';

const TABLE = MonthlyLog.name;
const TEXT = JsonView.name;

export interface FooterProps {
  viewMode: string;
  handleViewModeChange: (viewMode: string) => void
}

export default function Footer(props: FooterProps): ReactElement {
  return (
    <footer>
      <select
        value={props.viewMode}
        onChange={e => props.handleViewModeChange(e.target.value)}
      >
        <option value={TABLE}>Table</option>
        <option value={TEXT}>Text</option>
      </select>
      <a
        href="https://github.com/leafriend/working-hours/"
        target="_blank"
        rel="noopener noreferrer"
      >Github</a>
    </footer>
  );
};
