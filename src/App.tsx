import React, { useState } from 'react';

import './App.css';
import { Article } from './Article';
import { Header } from './Header';
import { Log, LogSource, toSource, BalanceHolder } from './log/types';
import { LocalLogsSet } from './storage/local';
import { LogsSet } from './storage/types';

const YEAR_MONTH = '2019-05';

const logsSet: LogsSet = new LocalLogsSet();

function convertLogSourcesToLogs(sources: LogSource[]): Log[] {
  let balanceHolder: BalanceHolder = {
    balance: '00:00',
  };
  const logs = Array(sources.length);
  sources.forEach((source, i) => {
    const log = new Log(source, balanceHolder);
    logs[i] = log;
    balanceHolder = log;
  })
  return logs;
}

const App: React.FC = () => {
  const [logs, setLogs] = useState(convertLogSourcesToLogs(logsSet.getLogs(YEAR_MONTH)));

  function handleLogsChange(i: number, source: LogSource) {
    const sources = logs.map(toSource);
    sources[i] = source;
    const newLogs = convertLogSourcesToLogs(sources);
    setLogs(newLogs);
    logsSet.setLogs(YEAR_MONTH, newLogs);
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
