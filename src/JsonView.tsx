import React from 'react';

import './JsonView.scss';
import { Log, LogSource, toSource } from './log/types';
import { Nullable } from './lib';

export interface JsonViewProps {
  logs: Log[];
  onLogsChange: (sources: Nullable<LogSource>[]) => void,
}

export const JsonView: React.FC<JsonViewProps> = props => {
  const sources = props.logs.map(toSource);
  return (
    <textarea
      className="json-view"
      value={JSON.stringify(sources)}
      onChange={e => props.onLogsChange(JSON.parse(e.target.value))}
    />
  );
};

JsonView.toString = () => 'JsonView';
