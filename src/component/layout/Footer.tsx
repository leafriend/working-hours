import React, { ReactElement } from 'react';

import './Footer.scss';

export interface FooterProps {
  viewMode: string;
  viewModes: string[];
  handleViewModeChange: (viewMode: string) => void
}

export default function Footer(props: FooterProps): ReactElement {
  return (
    <footer>
      <select
        value={props.viewMode}
        onChange={e => props.handleViewModeChange(e.target.value)}
      >
        {props.viewModes.map(mode => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </select>
      <a
        href="https://github.com/leafriend/working-hours/"
        target="_blank"
        rel="noopener noreferrer"
      >Github</a>
    </footer>
  );
};
