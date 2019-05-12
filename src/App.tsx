import React, { useState } from 'react';

import './App.css';
import { Article } from './Article';
import { Header } from './Header';
import { Log, LeaveType } from './log/types';
import { LocalLogsSet } from './storage/local';
import { LogsSet } from './storage/types';

const YEAR_MONTH = '2019-05';

const EMPTY_LOG: Log = {
  leaveType: LeaveType.WORK,
  startedAt: undefined,
  finishedAt: undefined,
}

function date(i: number) {
  return i - 1;
}
const LOGS: Log[] = Array(31).fill(EMPTY_LOG);
LOGS[date(2)] = { leaveType: LeaveType.WORK, startedAt: '09:57', finishedAt: '19:24' };
LOGS[date(3)] = { leaveType: LeaveType.WORK, startedAt: '09:57' };

const logsSet: LogsSet = new LocalLogsSet();

const App: React.FC = () => {
  const [yearMonth, setYearMonth] = useState(YEAR_MONTH);
  const [logs, setLogs] = useState(logsSet.getLogs(yearMonth));

  return (
    <div className="App">
      <Header
        yearMonth={YEAR_MONTH}
      />
      <Article
        logs={logs}
        />
    </div>
  );
}

export default App;
