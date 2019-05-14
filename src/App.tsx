import React, { useState } from 'react';

import './App.css';
import { Article } from './Article';
import { Header } from './Header';
import { Nullable, zerofill } from './lib';
import { Log, LogSource, toSource, BalanceHolder, LeaveType } from './log/types';
import { LocalLogsSet } from './storage/local';
import { LogsSet } from './storage/types';

const YEAR_MONTH = '2019-05';

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
  const [logs, setLogs] = useState(convertLogSourcesToLogs(YEAR_MONTH, logsSet.getLogSources(YEAR_MONTH)));

  function handleLogsChange(i: number, source: LogSource) {
    const sources = logs.map(toSource);
    sources[i] = source;
    const newLogs = convertLogSourcesToLogs(YEAR_MONTH, sources);
    setLogs(newLogs);
    logsSet.setLogSources(YEAR_MONTH, newLogs);
  }

  return (
    <div className="App">
      <Header
        yearMonth={YEAR_MONTH}
      />
      <Article
        yearMonth={YEAR_MONTH}
        logs={logs}
        onLogsChange={handleLogsChange}
      />
    </div>
  );
}

export default App;
