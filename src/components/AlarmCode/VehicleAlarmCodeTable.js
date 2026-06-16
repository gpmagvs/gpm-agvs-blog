import React from 'react';
import alarmCodes from '@site/src/data/vehicle-alarm-codes.json';
import AlarmCodeTable from './AlarmCodeTable';

export default function VehicleAlarmCodeTable() {
  return (
    <AlarmCodeTable
      entries={alarmCodes.entries}
      zhColumnLabel="中文描述"
      enColumnLabel="英文描述"
    />
  );
}
