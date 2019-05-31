import React, { ReactElement, useState } from 'react';

import './App.scss';

import { Log } from '../log/types';
import { LocalLogsSet } from '../storage/local';
import { LogsSet } from '../storage/types';

import JsonView from './json-view/JsonView';
import Footer from './layout/Footer';
import Header from './layout/Header';
import MonthlyLog from './molthly-log/MonthlyLog';
import { zerofill } from '../lib';

const NOW = new Date();
const LOCAL_NOW = new Date(NOW.getTime() - NOW.getTimezoneOffset() * 1000 * 60);

const YEAR_MONTH = LOCAL_NOW.toISOString().substring(0, 7);

const YEAR_MONTHS = (() => {
  const array: string[] = [];
  const from = '2019-05';
  const to = YEAR_MONTH;
  for (let current = from; current <= to;) {
    array.push(current);

    let year = parseInt(current.substring(0, 4));
    let month = parseInt(current.substring(5, 7)) + 1;
    if (month > 12) {
      year++;
      month = 1;
    }
    current = `${year}-${zerofill(month)}`;
  }
  return array;
})();

const TABLE = 'Table';
const TEXT = 'Json';

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
                  onYearMonthChange={handleYearMonthChange}
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
