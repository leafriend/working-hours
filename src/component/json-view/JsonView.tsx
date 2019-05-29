import React, { ReactElement } from 'react';
import format from 'json-format';

import './JsonView.scss';

import { Log } from '../../log/types';

export interface JsonViewProps {
  logs: Log[];
  onLogsChange: (logs: Log[]) => void,
}

export default function JsonView(props: JsonViewProps): ReactElement {
  return (
    <textarea
      className="json-view"
      value={format(props.logs).replace(/\t/g, '  ')}
      onChange={e => props.onLogsChange(JSON.parse(e.target.value))}
    />
  );
};
