import React, { ReactElement, useEffect, useState } from 'react';

import './MonthlyLog.scss';
import MonthlyLogEditor from './MonthlyLogEditor';
import MonthlyLogTable from './MonthlyLogTable';
import { Log, LeaveType, BalanceHolder, LogSource, toSource } from './log/types';
import { zerofill, Nullable } from './lib';

const NOW = new Date();
const TODAY = `${NOW.getFullYear()}-${zerofill(NOW.getMonth() + 1)}-${zerofill(NOW.getDate())}`;

const BALANCE_HOLDER: BalanceHolder = {
  overall: '00:00',
  target: '00:00',
  balance: '00:00',
};

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

export interface MonthlyLogProps {
  yearMonth: string;
  holidays: string[];
  logs: Nullable<LogSource>[];
  onLogsChange: (sources: Nullable<LogSource>[]) => void,
}

export default function MonthlyLog(props: MonthlyLogProps): ReactElement {

  const [activeLog, setActiveLog] = useState<Log>(
    new Log({ date: TODAY, leaveType: LeaveType.WORK }, BALANCE_HOLDER, false, true)
  );

  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(() => {
    setLogs(convertLogSourcesToLogs(
      props.yearMonth,
      props.logs,
      props.holidays,
      activeLog.date,
    ));
    logs.forEach(log => {
      if (log.isActive) {
        handleActivate(log.date);
      }
    })
  }, []);

  function handleLogChange(source: LogSource) {
    const date = parseInt(source.date.substring(8), 10);
    const sources = props.logs
      .map((log, i) =>
        log === null
          ? (i + 1 === date ? source : log)
          : (log.date === source.date ? source : log)
      )
      .map(toSource)
      ;
    props.onLogsChange(sources);

    const newLogs = convertLogSourcesToLogs(props.yearMonth, sources, props.holidays, source.date);
    setLogs(newLogs);
    const activeLogs = newLogs.filter(log => log.isActive);
    if (activeLogs.length > 0) {
      setActiveLog(activeLogs[0]);
    }
  }

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

  return (
    <React.Fragment>
      <div id="content-container">
        <MonthlyLogTable
          logs={logs}
          onActivate={handleActivate}
        />
      </div>
      <div>
        <MonthlyLogEditor
          log={activeLog}
          onLogChange={handleLogChange}
        />
      </div>
    </React.Fragment>
  );
};
