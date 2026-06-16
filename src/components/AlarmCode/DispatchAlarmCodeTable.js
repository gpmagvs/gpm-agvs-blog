import React from 'react';
import alarmCodes from '@site/src/data/dispatch-alarm-codes.json';
import AlarmCodeTable from './AlarmCodeTable';

export default function DispatchAlarmCodeTable() {
  return <AlarmCodeTable entries={alarmCodes.entries} />;
}
