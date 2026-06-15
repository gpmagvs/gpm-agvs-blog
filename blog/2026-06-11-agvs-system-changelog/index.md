---
slug: agvs-system-changelog
title: AGVSystem 更新履歷
authors: [dev-team]
tags: [changelog, agvs-system]
date: 2026-06-11
---

AGVS 核心服務（**AGVSystem**）近期更新紀錄，依 git commit 時間排序（最新在前）。專案檔：`AGVSystem.csproj`。

{/* truncate */}

## 2026-06-11

### v1.8.46 — 新增 Carrier 手動移除回報 API

- 專案版本更新至 **1.8.46**
- `CIMController` 新增 **CarrierManualRemovedReport** API，支援載具手動移除情境回報，改善任務管理

### 重構 MCS 失敗描述

- `MCSService` 失敗描述改使用 `AlarmModel.DescriptionWithAlarmCode`，提升 Alarm 訊息可讀性

## 2026-06-10

### HOST 命令衝突任務儲格置換

- HOST 命令處理時，若來源儲格已有任務異常，且衝突任務未執行、為 HOST 命令、衝突儲格非轉換架或設備時，自動進行**衝突任務目標儲格置換**

### 優化 EquipmentsCollectBackgroundService

- 改善設備資料收集背景服務效能與穩定性

### 更新前端資源

- 同步更新 Web 前端靜態資源（2 次提交）

## 2026-06-09

### 批次修改任務 API

- 新增 API，支援**一次修改多筆任務**（資料庫操作）

## 2026-06-05

### v1.8.42 — 地圖版本管理

- 專案版本更新至 **1.8.42**
- 新增 `SysStatusDBTableDataHostService`
- `MapController` 整合目前地圖版本管理

## 2026-06-04

### v1.8.41 — 設備資料清理

- 專案版本更新至 **1.8.41**
- `EquipmentsCollectBackgroundService` 實作**垃圾資料清理**

### 更新前端資源

- 同步更新 Web 前端靜態資源
