import React, { ReactElement, useEffect, useState } from 'react';

import './MonthlyLog.scss';

import { Nullable, zerofill } from '../../lib';
import { LeaveType, LogSource } from '../../log/types';

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

function convertLogSourcesToLogs(yearMonth: string, sources: Nullable<LogSource>[], holidays: string[], activeDate: string): CaculatedLog[] {
  let balanceHolder: BalanceHolder = BALANCE_HOLDER;
  const calculatedLogs = Array(sources.length);
  sources.forEach((source, i) => {
    const refined = source ? source : {
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
  logs: Nullable<LogSource>[];
  onLogsChange: (sources: Nullable<LogSource>[]) => void,
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
