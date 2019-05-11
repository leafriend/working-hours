import React from 'react';

import './App.css';
import { Header } from './Header';
import { Articla } from './Article';
import { Log } from './log/types';

const MONTH = '2019-05';

function date(i: number) {
  return i - 1;
}
const LOGS: Log[] = Array(31).fill(undefined);
LOGS[date(2)] = { startedAt: '09:57', finishedAt: '19:24' };
LOGS[date(3)] = { startedAt: '09:57' };

const App: React.FC = () => {
  return (
    <div className="App">
      <Header
        month={MONTH}
      />
      <Articla
        logs={LOGS}
      />
    </div>
  );
}

export default App;
