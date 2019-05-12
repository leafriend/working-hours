import React, { useState } from 'react';

import './App.css';
import { Article } from './Article';
import { Header } from './Header';
import { Log } from './log/types';
import { LocalLogsSet } from './storage/local';
import { LogsSet } from './storage/types';

const YEAR_MONTH = '2019-05';

const logsSet: LogsSet = new LocalLogsSet();

const App: React.FC = () => {
  const [yearMonth, setYearMonth] = useState(YEAR_MONTH);
  const [logs, setLogs] = useState(logsSet.getLogs(yearMonth));

  function handleLogsChange(logs: Log[]) {
    setLogs(logs);
    logsSet.setLogs(yearMonth, logs);
  }

  return (
    <div className="App">
      <Header
        yearMonth={YEAR_MONTH}
      />
      <Article
        yearMonth={yearMonth}
        logs={logs}
        onLogsChange={handleLogsChange}
      />
    </div>
  );
}

export default App;
