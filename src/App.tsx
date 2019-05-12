import React from 'react';

import './App.css';
import { Header } from './Header';
import { Article } from './Article';
import { Log, LeaveType } from './log/types';

const MONTH = '2019-05';

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

const App: React.FC = () => {
  return (
    <div className="App">
      <Header
        month={MONTH}
      />
      <Article
        logs={LOGS}
      />
    </div>
  );
}

export default App;
