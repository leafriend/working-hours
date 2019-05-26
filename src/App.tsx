import React, { ReactElement, useState, useEffect } from 'react';

import './App.scss';
import MonthlyLog from './MonthlyLog';
import Header from './Header';
import JsonView from './JsonView';
import Footer from './Footer';
import LogEditor from './LogEditor';
import { Nullable, zerofill } from './lib';
import { Log, LogSource, toSource, BalanceHolder, LeaveType } from './log/types';
import { LocalLogsSet } from './storage/local';
import { LogsSet } from './storage/types';

const YEAR_MONTH = '2019-05';
const HOLIDAYS = [
  '2019-05-01',
  '2019-05-06',
];

const NOW = new Date();
const TODAY = `${NOW.getFullYear()}-${zerofill(NOW.getMonth() + 1)}-${zerofill(NOW.getDate())}`;

const BALANCE_HOLDER: BalanceHolder = {
  overall: '00:00',
  target: '00:00',
  balance: '00:00',
};

const TABLE = MonthlyLog.name;
const TEXT = JsonView.name;

const logsSet: LogsSet = new LocalLogsSet();

function convertLogSourcesToLogs(yearMonth: string, sources: Nullable<LogSource>[], holidays: string[], activeDate: string): Log[] {
  let balanceHolder: BalanceHolder = BALANCE_HOLDER;
  const logs = Array(sources.length);
  sources.forEach((source, i) => {
    const refined = source ? source : {
      date: `${yearMonth}-${zerofill(i + 1)}`,
      leaveType: LeaveType.WORK,
    };

    const isHoliday = holidays.indexOf(refined.date) >= 0;

    const isActive = activeDate === refined.date;

    const log = new Log(refined, balanceHolder, isHoliday, isActive);
    logs[i] = log;
    balanceHolder = log;
  })
  return logs;
}
function loadLogs(yearMonth: string, holidays: string[], activeDate: string): Log[] {
  const sources = logsSet.getLogSources(yearMonth);
  const defaultLogs = convertLogSourcesToLogs(yearMonth, sources, holidays, activeDate);
  return defaultLogs;
}

export default function App(): ReactElement {
  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(() => {
    setLogs(loadLogs(YEAR_MONTH, HOLIDAYS, TODAY));
  }, []);

  const [activeLog, setActiveLog] = useState<Log>(
    new Log({ date: TODAY, leaveType: LeaveType.WORK }, BALANCE_HOLDER, false, true)
  );

  const [viewMode, setViewMode] = useState(TABLE);

  const [initialized, setInitialized] = useState(false);
  function handleActivate(activeDate: string): void {
    logs.forEach(log => log.isActive = log.date === activeDate);
    setLogs(logs);

    if (!initialized) {
      const container = document.getElementById(`content-container`);
      const el = document.getElementById(`log-${activeDate}`);
      if (container && el) {
        setInitialized(true);
        container.scrollTo({ top: el.offsetTop });
      }
    }

    const activeLog = logs.find(log => log.isActive);
    activeLog && setActiveLog(activeLog);
  }

  function handleLogsChange(sources: Nullable<LogSource>[]) {
    const newLogs = convertLogSourcesToLogs(YEAR_MONTH, sources, HOLIDAYS, activeLog.date);
    setLogs(newLogs);
    const activeLogs = logs.filter(log => log.isActive);
    if (activeLogs.length > 0) {
      setActiveLog(activeLogs[0]);
    }
    logsSet.setLogSources(YEAR_MONTH, newLogs);
  }

  function handleLogChange(source: LogSource) {
    const date = parseInt(source.date.substring(8), 10);
    const sources = logs.map(toSource)
      .map((log, i) =>
        log === null
          ? (i + 1 === date ? source : log)
          : (log.date === source.date ? source : log)
      );
    const newLogs = convertLogSourcesToLogs(YEAR_MONTH, sources, HOLIDAYS, source.date);
    setLogs(newLogs);
    const activeLogs = newLogs.filter(log => log.isActive);
    if (activeLogs.length > 0) {
      setActiveLog(activeLogs[0]);
    }
    logsSet.setLogSources(YEAR_MONTH, newLogs);
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
                <React.Fragment>
                  <div id="content-container">
                    <MonthlyLog
                      logs={logs}
                      onActivate={handleActivate}
                    />
                  </div>
                  <div>
                    <LogEditor
                      log={activeLog}
                      onLogChange={handleLogChange}
                    />
                  </div>
                </React.Fragment>
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
