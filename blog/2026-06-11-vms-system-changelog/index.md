---
slug: vms-system-changelog
title: VMSystem 更新履歷
authors: [dev-team]
tags: [changelog, vms-system]
date: 2026-06-11
---

車輛管理系統（**VMSystem**）近期更新紀錄，依 git commit 時間排序（最新在前）。專案檔：`VMSystem.csproj`。

{/* truncate */}

## 2026-06-11

### v2.9.48 — 派車點位註冊與失敗原因格式

- Assembly / File Version 更新至 **2.9.48**
- 改善 AGV 派車邏輯中的**點位註冊**處理
- `OrderHandlerBase` 優化任務失敗原因（`failure reason`）格式化

## 2026-06-10

### v2.9.47 — 深度充電與任務優先序

- Assembly / File Version 更新至 **2.9.47**
- 派車邏輯強化**深度充電**與**任務優先序**處理
- `VehicleBatteryController`、`VehicleChargeDataViewModel` 改善車輛電池資料處理

## 2026-06-04

### v2.9.46 — 狀態收集與資料清理

- Assembly / File Version 更新至 **2.9.46**
- `AGVStatsuCollectBackgroundService` 新增垃圾資料清理與車輛狀態取得

### 里程計同步至資料庫

- AGV 里程計數值同步寫入資料庫

## 2026-06-03

### AGV 模擬器貨物類型上報

- 模擬器上報的貨物類型改依**任務指定類型**回報

### 換車服務與充電指派修正

- 優化換車服務模組的車輛過濾邏輯
- 修正 AGV 在**中低電量充電**時仍被指派任務的問題

## 2026-05-26

### 電池狀態可執行任務判斷優化

- `clsAGV.CheckOutOrderExecutableByBatteryStatusAndChargingStatus` 方法邏輯改善

## 2026-05-22

### 程式更新 Helper 與 DB 同步設定

- `AGVProgramUpdateHelper` 將 `VMSHostUrl` 中 `localhost` 替換為 `127.0.0.1`
- `SystemController` 新增 **DatabaseSyncConfigReloadInvoke** 端點，支援重新載入 DB 同步設定

### 派車優化例外處理

- `clsOptimizeAGVDispatcher` 改為記錄例外而非重新拋出，提升穩定性

## 2026-05-21

### v2.9.43 — 派車模組重構

- Assembly / File Version 更新至 **2.9.43**
- `clsAGVTaskDisaptchModule.cs` 重構，提升可讀性
