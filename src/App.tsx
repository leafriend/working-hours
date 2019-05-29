import React, { ReactElement, useState } from 'react';

import './App.scss';
import MonthlyLog from './MonthlyLog';
import Header from './Header';
import JsonView from './JsonView';
import Footer from './Footer';
import { Nullable } from './lib';
import { LogSource } from './log/types';
import { LocalLogsSet } from './storage/local';
import { LogsSet } from './storage/types';

const YEAR_MONTH = '2019-05';
const HOLIDAYS = [
  '2019-05-01',
  '2019-05-06',
];

const TABLE = MonthlyLog.name;
const TEXT = JsonView.name;

const logsSet: LogsSet = new LocalLogsSet();

export default function App(): ReactElement {
  const [logs, setLogs] = useState(logsSet.getLogSources(YEAR_MONTH));
  const [viewMode, setViewMode] = useState(TABLE);

  function handleLogsChange(sources: Nullable<LogSource>[]) {
    setLogs(sources);
    logsSet.setLogSources(YEAR_MONTH, sources);
  }

  return (
    <div className="App">
      <Header
        yearMonth={YEAR_MONTH}
      />
      <article>
        {(() => {
          switch (viewMode) {
            case TABLE:
              return (
                <MonthlyLog
                  yearMonth={YEAR_MONTH}
                  holidays={HOLIDAYS}
                  logs={logs}
                  onLogsChange={handleLogsChange}
                />
              );
            case TEXT:
              return (
                <JsonView
                  logs={logs}
                  onLogsChange={handleLogsChange}
                />
              );
            default:
              return null;
          }

        })()}
      </article>
      <Footer
        viewMode={viewMode}
        handleViewModeChange={viewMode => setViewMode(viewMode)}
      />
    </div>
  );
}
