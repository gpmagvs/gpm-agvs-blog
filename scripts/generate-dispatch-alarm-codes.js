const fs = require('fs');
const path = require('path');
const {toTraditional} = require('./traditional');
const OUTPUT = path.join(__dirname, '..', 'docs', 'alarm-code', 'dispatch-alarm-code.mdx');
const JSON_OUTPUT = path.join(__dirname, '..', 'src', 'data', 'dispatch-alarm-codes.json');

const ALARM_SOURCE_CANDIDATES = [
  path.join(__dirname, '..', '..', '..', 'Programming', 'AGV', 'AGVSystemCommonNet6', 'Alarm'),
  path.join(__dirname, '..', '..', 'AGVSystemCommonNet6', 'Alarm'),
  'D:\\Programming\\AGV\\AGVSystemCommonNet6\\Alarm',
];

function resolveAlarmDir() {
  for (const candidate of ALARM_SOURCE_CANDIDATES) {
    const tablePath = path.join(candidate, 'AlarmCodeTable.cs');
    if (fs.existsSync(tablePath)) {
      return candidate;
    }
  }
  return null;
}

function outputsExist() {
  return fs.existsSync(OUTPUT) && fs.existsSync(JSON_OUTPUT);
}

function parseEnumValues(enumSource) {
  const values = new Map();
  const lineRe = /^\s*(\w+)\s*=\s*(\d+)\s*,?/;
  for (const line of enumSource.split('\n')) {
    const match = line.match(lineRe);
    if (match) {
      values.set(match[1], Number(match[2]));
    }
  }
  return values;
}

function parseAlarmTable(tableSource, enumValues) {
  const entryRe =
    /new clsAlarmCode\(ALARMS\.(\w+)\s*,\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"/g;
  const entries = [];
  let match;

  while ((match = entryRe.exec(tableSource)) !== null) {
    const [, enumName, descriptionZh, descriptionEn] = match;
    const code = enumValues.get(enumName);
    if (code === undefined) {
      console.warn(`警告：AlarmCodeTable 中的 ${enumName} 未在 ALARMS 列舉找到`);
      continue;
    }
    entries.push({
      code,
      enumName,
      descriptionZh,
      descriptionEn,
    });
  }

  return entries.sort((a, b) => a.code - b.code || a.enumName.localeCompare(b.enumName));
}

function buildMdx() {
  return `---
sidebar_position: 1
title: 派車系統 Alarm Code
---

import DispatchAlarmCodeTable from '@site/src/components/AlarmCode/DispatchAlarmCodeTable';

# 派車系統 Alarm Code

<DispatchAlarmCodeTable />
`;
}

function buildJson(entries) {
  return {
    entries: entries.map((entry) => ({
      code: entry.code,
      descriptionZh: toTraditional(entry.descriptionZh),
      descriptionEn: entry.descriptionEn,
    })),
  };
}

function main() {
  const alarmDir = resolveAlarmDir();
  if (!alarmDir) {
    if (outputsExist()) {
      console.warn(
        '警告：找不到 AlarmCodeTable.cs，已跳過派車系統 Alarm Code 生成，沿用現有輸出。\n' +
          `已嘗試：\n${ALARM_SOURCE_CANDIDATES.join('\n')}`,
      );
      return;
    }
    throw new Error(
      `找不到 AlarmCodeTable.cs，且缺少現有輸出檔，已嘗試：\n${ALARM_SOURCE_CANDIDATES.join('\n')}`,
    );
  }

  const tableSource = fs.readFileSync(path.join(alarmDir, 'AlarmCodeTable.cs'), 'utf8');
  const enumSource = fs.readFileSync(path.join(alarmDir, 'AlarmEnums.cs'), 'utf8');

  const versionMatch = tableSource.match(/public const string VERSION = "([^"]+)"/);
  const version = versionMatch ? versionMatch[1] : 'unknown';
  const enumValues = parseEnumValues(enumSource);
  const entries = parseAlarmTable(tableSource, enumValues);

  fs.writeFileSync(OUTPUT, buildMdx(), 'utf8');
  fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(buildJson(entries), null, 2)}\n`, 'utf8');
  console.log(
    `Generated ${entries.length} dispatch alarm codes (v${version}) -> ${OUTPUT}, ${JSON_OUTPUT}`,
  );
}

main();
