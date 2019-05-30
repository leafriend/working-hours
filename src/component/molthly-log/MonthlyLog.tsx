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
  overall: 0,
  target: 0,
  balance: 0,
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

  const [activeLog, setActiveLog] = useState<CaculatedLog | null>(null);

  const [calculatedLogs, setCalculatedLogs] = useState<CaculatedLog[]>([]);
  useEffect(() => {
    setCalculatedLogs(convertLogsToCaculatedLogs(
      props.logs,
      activeLog ? activeLog.date : '',
    ));
  }, [props.logs]);

  useEffect(() => {
    if (calculatedLogs.length > 0) {
      const container = document.getElementById(`content-container`);
      const els =  document.getElementsByClassName('active');
      if (container) {
        if (els.length > 0) {
          container.scrollTo({ top: (els.item(0)! as HTMLElement).offsetTop });
        } else {
          container.scrollTo({ top: 0 });
        }
      }
    }
  }, [calculatedLogs]);

  function handleLogChange(log: Log) {
    calculatedLogs.forEach(calculatedLog => {
      if (calculatedLog.date === log.date) {
        calculatedLog.log = log;
      }
    });
    setCalculatedLogs(calculatedLogs);

    const logs = calculatedLogs.map(calculatedLog => calculatedLog.log);
    props.onLogsChange(logs);
  }

  function handleActivate(activeDate: string): void {
    calculatedLogs.forEach(calculatedLog => {
      calculatedLog.isActive = calculatedLog.date === activeDate;
      if (calculatedLog.date === activeDate) {
        setActiveLog(calculatedLog);
      }
    });
    setCalculatedLogs(calculatedLogs);
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
