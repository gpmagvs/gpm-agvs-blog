const fs = require('fs');
const path = require('path');

const OUTPUT = path.join(__dirname, '..', 'docs', 'alarm-code', 'vehicle-alarm-code.mdx');

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

function escapeMdCell(text) {
  return String(text ?? '')
    .replace(/\|/g, '\\|')
    .replace(/\n/g, ' ');
}

function buildMdx(sourcePath, entries) {
  const rows = entries
    .map(
      (entry) =>
        `| ${entry.Code} | ${escapeMdCell(entry.CN)} | ${escapeMdCell(entry.Description)} |`,
    )
    .join('\n');

  const relativeSource = 'GPMVehicleControlSystem/GPMVehicleControlSystem/src/AlarmList.json';

  return `---
sidebar_position: 2
title: 車載系統 Alarm Code
---

# 車載系統 Alarm Code

對應後端模組：\`GPMVehicleControlSystem\` 車載 Alarm Table（\`AlarmList.json\`）

## 功能概述

車載系統 Alarm Code 定義於 \`AlarmList.json\`，供 VCS 在 EMS、安全模組、I/O、導航、牙叉與 AGVS 交握等流程中產生警報。現場可於 [即時警報顯示](/docs/vehicle-guide/realtime-alarm-display) 或 [異常紀錄](/docs/vehicle-guide/alarm-records) 對照 **異常碼** 欄位。

## 資料版本

| 項目 | 值 |
|------|-----|
| 資料來源 | \`${relativeSource}\` |
| 異常碼筆數 | **${entries.length}** |

:::info 自動產生
本頁異常碼表格由 \`scripts/generate-vehicle-alarm-codes.js\` 自 \`${relativeSource}\` 產生，並依 **Code** 數值 **由小至大** 排序。修改原始檔後請執行 \`npm run generate:alarm-codes\`。
:::

## 異常碼一覽

| 異常碼 | 中文（CN） | 英文 Description |
|--------|------------|------------------|
${rows}

## 注意事項

- 表格欄位對應 \`AlarmList.json\` 的 \`Code\`、\`CN\`、\`Description\`
- 現場可透過 \`param/AlarmList.json\` 覆寫預設表；本頁反映專案內建 \`src/AlarmList.json\`
- 與 [派車系統 Alarm Code](/docs/alarm-code/dispatch-alarm-code) 為不同命名空間，請勿混用
`;
}

function main() {
  const sourcePath = resolveAlarmListPath();
  const raw = fs.readFileSync(sourcePath, 'utf8');
  const entries = JSON.parse(raw);

  if (!Array.isArray(entries)) {
    throw new Error('AlarmList.json 格式錯誤：預期為 JSON 陣列');
  }

  entries.sort((a, b) => a.Code - b.Code);

  fs.writeFileSync(OUTPUT, buildMdx(sourcePath, entries), 'utf8');
  console.log(
    `Generated ${entries.length} vehicle alarm codes -> ${OUTPUT}`,
  );
}

main();
