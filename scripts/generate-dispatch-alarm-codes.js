const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'docs', 'alarm-code', 'dispatch-alarm-code.mdx');

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
  throw new Error(
    `找不到 AlarmCodeTable.cs，已嘗試：\n${ALARM_SOURCE_CANDIDATES.join('\n')}`,
  );
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

function escapeMdCell(text) {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function parseVersion(tableSource) {
  const match = tableSource.match(/public const string VERSION = "([^"]+)"/);
  return match ? match[1] : 'unknown';
}

function buildMdx(version, entries) {
  const rows = entries
    .map(
      (entry) =>
        `| ${entry.code} | ${escapeMdCell(entry.descriptionZh)} | ${escapeMdCell(entry.descriptionEn)} |`,
    )
    .join('\n');

  return `---
sidebar_position: 1
title: 派車系統 Alarm Code
---

# 派車系統 Alarm Code

對應後端模組：\`AGVSystemCommonNet6.Alarm.AlarmCodeTable\`（AGVS／VMS）

## 功能概述

派車系統 Alarm Code 定義於 \`AlarmCodeTable.cs\`，供 VMS／AGVS 在任務派工、交管、設備交握與充電站等流程中產生 **Alarm** 或 **Warning**。現場可於 [實時警報](/docs/guide/realtime-alarm/overview) 或 [警報歷史查詢](/docs/guide/data-query/alarm-history-query) 對照 **異常碼** 欄位。

## 資料版本

| 項目 | 值 |
|------|-----|
| AlarmCodeTable.VERSION | **${version}** |
| 異常碼筆數 | **${entries.length}** |

:::info 自動產生
本頁異常碼表格由 \`scripts/generate-dispatch-alarm-codes.js\` 自 \`AGVSystemCommonNet6/Alarm/AlarmCodeTable.cs\` 產生，並依列舉數值 **由小至大** 排序。修改原始碼後請執行 \`npm run generate:alarm-codes\`。
:::

## 異常碼一覽

| 異常碼 | 中文描述 | 英文 Description |
|--------|----------|------------------|
${rows}

## 注意事項

- 表格僅包含 \`AlarmCodeTable.Table\` 已定義的異常碼；\`ALARMS\` 列舉中其他未列入表格的項目不在此頁
- 排除方法欄位（TroubleShooting）於原始碼多為空字串，現場請依 SOP 或聯繫 GPM 技術支援
- 與 [車載系統 Alarm Code](/docs/alarm-code/vehicle-alarm-code) 為不同命名空間，請勿混用
`;
}

function main() {
  const alarmDir = resolveAlarmDir();
  const tableSource = fs.readFileSync(path.join(alarmDir, 'AlarmCodeTable.cs'), 'utf8');
  const enumSource = fs.readFileSync(path.join(alarmDir, 'AlarmEnums.cs'), 'utf8');

  const version = parseVersion(tableSource);
  const enumValues = parseEnumValues(enumSource);
  const entries = parseAlarmTable(tableSource, enumValues);

  fs.writeFileSync(OUTPUT, buildMdx(version, entries), 'utf8');
  console.log(
    `Generated ${entries.length} dispatch alarm codes (v${version}) -> ${OUTPUT}`,
  );
}

main();
