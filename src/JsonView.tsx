import React, { ReactElement } from 'react';
import format from 'json-format';

import './JsonView.scss';
import { Log, LogSource, toSource } from './log/types';
import { Nullable } from './lib';

export interface JsonViewProps {
  logs: Log[];
  onLogsChange: (sources: Nullable<LogSource>[]) => void,
}

export default function JsonView(props: JsonViewProps): ReactElement {
  const sources = props.logs.map(toSource);
  return (
    <textarea
      className="json-view"
      value={format(sources).replace(/\t/g, '  ')}
      onChange={e => props.onLogsChange(JSON.parse(e.target.value))}
    />
  );
};
