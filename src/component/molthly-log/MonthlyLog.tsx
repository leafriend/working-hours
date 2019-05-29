import React, { ReactElement, useEffect, useState } from 'react';

import './MonthlyLog.scss';

import { zerofill } from '../../lib';
import { LeaveType, Log } from '../../log/types';

import { Accumulation, CaculatedLog } from './CaculatedLog';
import MonthlyLogEditor from './MonthlyLogEditor';
import MonthlyLogTable from './MonthlyLogTable';

const NOW = new Date();
const TODAY = `${NOW.getFullYear()}-${zerofill(NOW.getMonth() + 1)}-${zerofill(NOW.getDate())}`;

const ACCUMULATION: Accumulation = {
  overall: '00:00',
  target: '00:00',
  balance: '00:00',
};

function convertLogsToCaculatedLogs(logs: Log[], activeDate: string): CaculatedLog[] {
  let accumulation: Accumulation = ACCUMULATION;
  const calculatedLogs = Array(logs.length);
  logs.forEach((log, i) => {

    const isActive = activeDate === log.date;

    const calculatedLog = new CaculatedLog(log, accumulation, isActive);
    calculatedLogs[i] = calculatedLog;
    accumulation = calculatedLog;
  })
  return calculatedLogs;
}

export interface MonthlyLogProps {
  logs: Log[];
  onLogsChange: (logs: Log[]) => void,
}

export default function MonthlyLog(props: MonthlyLogProps): ReactElement {

  const [activeLog, setActiveLog] = useState<CaculatedLog>(
    new CaculatedLog({ date: TODAY, isHoliday: false, leaveType: LeaveType.WORK }, ACCUMULATION, true)
  );

  const [calculatedLogs, setCalculatedLogs] = useState<CaculatedLog[]>([]);
  useEffect(() => {
    setCalculatedLogs(convertLogsToCaculatedLogs(
      props.logs,
      activeLog.date,
    ));
    calculatedLogs.forEach(log => {
      if (log.isActive) {
        handleActivate(log.date);
      }
    })
  }, []);

  function handleLogChange(log: Log) {
    const logs = props.logs
      .map(oldLog => log.date === oldLog.date ? log : oldLog)
      ;
    props.onLogsChange(logs);

    const newLogs = convertLogsToCaculatedLogs(logs, log.date);
    setCalculatedLogs(newLogs);
    const activeLogs = newLogs.filter(log => log.isActive);
    if (activeLogs.length > 0) {
      setActiveLog(activeLogs[0]);
    }
  }

  const [initialized, setInitialized] = useState(false);
  function handleActivate(activeDate: string): void {
    calculatedLogs.forEach(log => log.isActive = log.date === activeDate);
    setCalculatedLogs(calculatedLogs);

    if (!initialized) {
      const container = document.getElementById(`content-container`);
      const el = document.getElementById(`log-${activeDate}`);
      if (container && el) {
        setInitialized(true);
        container.scrollTo({ top: el.offsetTop });
      }
    }

    const activeLog = calculatedLogs.find(log => log.isActive);
    activeLog && setActiveLog(activeLog);
  }

  return (
    <React.Fragment>
      <div id="content-container">
        <MonthlyLogTable
          logs={calculatedLogs}
          onActivate={handleActivate}
        />
      </div>
      <div>
        <MonthlyLogEditor
          calculatedLog={activeLog}
          onLogChange={handleLogChange}
        />
      </div>
    </React.Fragment>
  );
};
