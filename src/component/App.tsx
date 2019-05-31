import React, { ReactElement, useState } from 'react';

import './App.scss';

import { Log } from '../log/types';
import { LocalLogsSet } from '../storage/local';
import { LogsSet } from '../storage/types';

import JsonView from './json-view/JsonView';
import Footer from './layout/Footer';
import Header from './layout/Header';
import MonthlyLog from './molthly-log/MonthlyLog';

const YEAR_MONTH = '2019-05';
const YEAR_MONTHS = [
  '2019-05',
  '2019-06',
];

const TABLE = MonthlyLog.name;
const TEXT = JsonView.name;

const logsSet: LogsSet = new LocalLogsSet();

export default function App(): ReactElement {
  const [yearMonth, setYearMonth] = useState(YEAR_MONTH);
  const [logs, setLogs] = useState(logsSet.getLogs(yearMonth));
  const [viewMode, setViewMode] = useState(TABLE);

  function handleYearMonthChange(yearMonth: string) {
    setYearMonth(yearMonth);
    setLogs(logsSet.getLogs(yearMonth));
  }

  function handleLogsChange(logs: Log[]) {
    setLogs(logs);
    logsSet.setLogs(YEAR_MONTH, logs);
  }

  return (
    <div className="App">
      <Header
        yearMonth={yearMonth}
        yearMonths={YEAR_MONTHS}
        onYearMonthChange={handleYearMonthChange}
      />
      <article>
        {(() => {
          switch (viewMode) {
            case TABLE:
              return (
                <MonthlyLog
                  yearMonthLog={{
                    yearMonth,
                    logs,
                  }}
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
        viewModes={[TABLE, TEXT]}
        handleViewModeChange={viewMode => setViewMode(viewMode)}
      />
    </div>
  );
}
