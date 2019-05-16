import React, { useState } from 'react';

import './App.scss';
import { MonthlyLog } from './MonthlyLog';
import { Header } from './Header';
import { Footer } from './Footer';
import { Nullable, zerofill } from './lib';
import { Log, LogSource, toSource, BalanceHolder, LeaveType } from './log/types';
import { LocalLogsSet } from './storage/local';
import { LogsSet } from './storage/types';

const YEAR_MONTH = '2019-05';
const HOLIDAYS = [
  '2019-05-01',
  '2019-05-06',
];

const logsSet: LogsSet = new LocalLogsSet();

function convertLogSourcesToLogs(yearMonth: string, sources: Nullable<LogSource>[]): Log[] {
  let balanceHolder: BalanceHolder = {
    balance: '00:00',
  };
  const logs = Array(sources.length);
  sources.forEach((source, i) => {
    const refined = source ? source : {
      date: `${yearMonth}-${zerofill(i + 1)}`,
      leaveType: LeaveType.WORK,
    };
    const log = new Log(refined, balanceHolder);
    logs[i] = log;
    balanceHolder = log;
  })
  return logs;
}

const App: React.FC = () => {
  const sources = logsSet.getLogSources(YEAR_MONTH);
  const defaultLogs = convertLogSourcesToLogs(YEAR_MONTH, sources);
  const [logs, setLogs] = useState(defaultLogs);

  function handleLogsChange(source: LogSource) {
    const date = parseInt(source.date.substring(8), 10);
    const sources = logs.map(toSource)
      .map((log, i) =>
        log === null
          ? (i + 1 === date ? source : log)
          : (log.date === source.date ? source : log)
      );
    const newLogs = convertLogSourcesToLogs(YEAR_MONTH, sources);
    setLogs(newLogs);
    logsSet.setLogSources(YEAR_MONTH, newLogs);
  }

  return (
    <div className="App">
      <Header
        yearMonth={YEAR_MONTH}
      />
      <article>
        <MonthlyLog
          yearMonth={YEAR_MONTH}
          holidays={HOLIDAYS}
          logs={logs}
          onLogsChange={handleLogsChange}
        />
      </article>
      <Footer />
    </div>
  );
}

export default App;
