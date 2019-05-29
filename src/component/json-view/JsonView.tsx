import React, { ReactElement } from 'react';
import format from 'json-format';

import './JsonView.scss';

import { Log } from '../../log/types';
import { Nullable } from '../../lib';

export interface JsonViewProps {
  logs: Nullable<Log>[];
  onLogsChange: (logs: Nullable<Log>[]) => void,
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
