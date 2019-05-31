import React, { ReactElement, useEffect, useState } from 'react';

import './MonthlyLog.scss';

import { zerofill } from '../../lib';
import { Log, YearMonthLog } from '../../log/types';

import { Accumulation, CaculatedLog } from './CaculatedLog';
import MonthlyLogEditor from './MonthlyLogEditor';
import MonthlyLogTable from './MonthlyLogTable';

const NOW = new Date();
export const TODAY = `${NOW.getFullYear()}-${zerofill(NOW.getMonth() + 1)}-${zerofill(NOW.getDate())}`;
// export const TODAY = '2019-05-28';

const ACCUMULATION: Accumulation = {
  overall: 0,
  target: 0,
  balance: 0,
};

function convertLogsToCaculatedLogs(logs: Log[]): CaculatedLog[] {
  let accumulation: Accumulation = ACCUMULATION;
  const calculatedLogs = Array(logs.length);
  logs.forEach((log, i) => {
    const calculatedLog = new CaculatedLog(log, accumulation, false);
    calculatedLogs[i] = calculatedLog;
    accumulation = calculatedLog;
  })
  return calculatedLogs;
}

interface ActiveDateSet {
  readonly [yearMonth: string]: string | undefined;
}
interface ScrollTopSet {
  readonly [yearMonth: string]: number | undefined;
}

export interface MonthlyLogProps {
  yearMonthLog: YearMonthLog;
  onLogsChange: (logs: Log[]) => void,
  onYearMonthChange: (yearMonth: string) => void;
}

export default function MonthlyLog(props: MonthlyLogProps): ReactElement {
  const yearMonth = props.yearMonthLog.yearMonth;

  const [activeDateSet, setActiveDateSet] = useState<ActiveDateSet>(
    TODAY.startsWith(yearMonth)
    ? { [yearMonth]: TODAY }
    : {}
  );
  const [scrollTopSet, setScrollTopSet] = useState<ScrollTopSet>({});

  const [calculatedLogs, setCalculatedLogs] = useState(convertLogsToCaculatedLogs(props.yearMonthLog.logs));
  useEffect(() => {
    const activeDate = activeDateSet[yearMonth];

    const calculatedLogs = convertLogsToCaculatedLogs(props.yearMonthLog.logs);
    calculatedLogs.forEach(log => log.isActive = log.date === activeDate);
    setCalculatedLogs(calculatedLogs);
  }, [yearMonth, props.yearMonthLog, activeDateSet]);

  useEffect(() => {
    const container = document.getElementById(`content-container`);
    if (container) {
      if (scrollTopSet[yearMonth] === undefined ) {
        const els = document.getElementsByClassName('active');
        if (els.length > 0) {
          container.scrollTo({ top: (els.item(0)! as HTMLElement).offsetTop });
        } else {
          container.scrollTo({ top: 0 });
        }
      } else {
        container.scrollTo({ top: scrollTopSet[yearMonth] });
      }
    }
  }, [yearMonth, calculatedLogs]);

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

  function updateActiveDate(activeDate: string) {
    const ym = activeDate.substring(0, 7);
    setActiveDateSet({
      ...activeDateSet,
      [ym]: activeDate,
    });
    if (!activeDate.startsWith(yearMonth)) {
      props.onYearMonthChange(ym);
    }
  }

  function updateScrollTop(scrollTop: number) {
    setScrollTopSet({
      ...scrollTopSet,
      [yearMonth]: scrollTop,
    });
  }

  return (
    <React.Fragment>
      <div
        id="content-container"
        onScroll={e => updateScrollTop((e.target as Element).scrollTop)}
      >
        <MonthlyLogTable
          logs={calculatedLogs}
          onActivate={updateActiveDate}
        />
      </div>
      <div>
        <MonthlyLogEditor
          calculatedLog={calculatedLogs.find(log => log.isActive) || null}
          onLogChange={handleLogChange}
          onActivate={updateActiveDate}
        />
      </div>
    </React.Fragment>
  );
};
