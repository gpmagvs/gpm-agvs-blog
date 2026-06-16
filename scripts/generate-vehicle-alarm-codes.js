const fs = require('fs');
const path = require('path');
const {toTraditional} = require('./traditional');
const OUTPUT = path.join(__dirname, '..', 'docs', 'alarm-code', 'vehicle-alarm-code.mdx');
const JSON_OUTPUT = path.join(__dirname, '..', 'src', 'data', 'vehicle-alarm-codes.json');

const ALARM_LIST_CANDIDATES = [
  path.join(
    __dirname,
    '..',
    '..',
    '..',
    'Programming',
    'AGV',
    'GPMVehicleControlSystem',
    'GPMVehicleControlSystem',
    'src',
    'AlarmList.json',
  ),
  path.join(
    __dirname,
    '..',
    '..',
    'GPMVehicleControlSystem',
    'GPMVehicleControlSystem',
    'src',
    'AlarmList.json',
  ),
  'D:\\Programming\\AGV\\GPMVehicleControlSystem\\GPMVehicleControlSystem\\src\\AlarmList.json',
];

function resolveAlarmListPath() {
  for (const candidate of ALARM_LIST_CANDIDATES) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `找不到 AlarmList.json，已嘗試：\n${ALARM_LIST_CANDIDATES.join('\n')}`,
  );
}

function buildMdx() {
  return `---
sidebar_position: 2
title: 車載系統 Alarm Code
---

import VehicleAlarmCodeTable from '@site/src/components/AlarmCode/VehicleAlarmCodeTable';

# 車載系統 Alarm Code

<VehicleAlarmCodeTable />
`;
}

function buildJson(entries) {
  return {
    entries: entries.map((entry) => ({
      code: entry.Code,
      descriptionZh: toTraditional(entry.CN ?? ''),
      descriptionEn: entry.Description ?? '',
    })),
  };
}

function main() {
  const sourcePath = resolveAlarmListPath();
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const entries = JSON.parse(raw);

  if (!Array.isArray(entries)) {
    throw new Error('AlarmList.json 格式錯誤：預期為 JSON 陣列');
  }

  entries.sort((a, b) => a.Code - b.Code);

  fs.writeFileSync(OUTPUT, buildMdx(), 'utf8');
  fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(buildJson(entries), null, 2)}\n`, 'utf8');
  console.log(
    `Generated ${entries.length} vehicle alarm codes -> ${OUTPUT}, ${JSON_OUTPUT}`,
  );
}

main();
