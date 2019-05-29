import React, { ReactElement, useEffect, useState } from 'react';

import './MonthlyLog.scss';

import { Nullable, zerofill } from '../../lib';
import { LeaveType, Log } from '../../log/types';

import { BalanceHolder, CaculatedLog, toSource } from './CaculatedLog';
import MonthlyLogEditor from './MonthlyLogEditor';
import MonthlyLogTable from './MonthlyLogTable';

const NOW = new Date();
const TODAY = `${NOW.getFullYear()}-${zerofill(NOW.getMonth() + 1)}-${zerofill(NOW.getDate())}`;

const BALANCE_HOLDER: BalanceHolder = {
  overall: '00:00',
  target: '00:00',
  balance: '00:00',
};

function convertLogSourcesToLogs(yearMonth: string, logs: Nullable<Log>[], holidays: string[], activeDate: string): CaculatedLog[] {
  let balanceHolder: BalanceHolder = BALANCE_HOLDER;
  const calculatedLogs = Array(logs.length);
  logs.forEach((log, i) => {
    const refined = log ? log : {
      date: `${yearMonth}-${zerofill(i + 1)}`,
      leaveType: LeaveType.WORK,
    };

    const isHoliday = holidays.indexOf(refined.date) >= 0;

    const isActive = activeDate === refined.date;

    const calculatedLog = new CaculatedLog(refined, balanceHolder, isHoliday, isActive);
    calculatedLogs[i] = calculatedLog;
    balanceHolder = calculatedLog;
  })
  return calculatedLogs;
}

export interface MonthlyLogProps {
  yearMonth: string;
  holidays: string[];
  logs: Nullable<Log>[];
  onLogsChange: (logs: Nullable<Log>[]) => void,
}

export default function MonthlyLog(props: MonthlyLogProps): ReactElement {

  const [activeLog, setActiveLog] = useState<CaculatedLog>(
    new CaculatedLog({ date: TODAY, leaveType: LeaveType.WORK }, BALANCE_HOLDER, false, true)
  );

  const [calculatedLogs, setCalculatedLogs] = useState<CaculatedLog[]>([]);
  useEffect(() => {
    setCalculatedLogs(convertLogSourcesToLogs(
      props.yearMonth,
      props.logs,
      props.holidays,
      activeLog.date,
    ));
    calculatedLogs.forEach(log => {
      if (log.isActive) {
        handleActivate(log.date);
      }
    })
  }, []);

  function handleLogChange(log: Log) {
    const date = parseInt(log.date.substring(8), 10);
    const logs = props.logs
      .map((log, i) =>
        log === null
          ? (i + 1 === date ? log : log)
          : (log.date === log.date ? log : log)
      )
      .map(toSource)
      ;
    props.onLogsChange(logs);

    const newLogs = convertLogSourcesToLogs(props.yearMonth, logs, props.holidays, log.date);
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
