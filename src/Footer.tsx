import React from 'react';

import './Footer.scss';

export interface FooterProps {
}

export const Footer: React.FC<FooterProps> = _ => {
  return (
    <footer>
      <a
        href="https://github.com/leafriend/working-hours/"
        target="_blank"
      >Github</a>
    </footer>
  );
};
