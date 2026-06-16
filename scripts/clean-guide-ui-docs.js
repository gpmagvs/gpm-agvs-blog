const fs = require('fs');
const path = require('path');

const TARGET_DIRS = [
  path.join(__dirname, '..', 'docs', 'guide'),
  path.join(__dirname, '..', 'docs', 'vehicle-guide'),
];

const VEHICLE_REPLACEMENTS = [
  [/驗證成功後依後端回傳的角色開放許可權/g, '驗證成功後依登入角色開放許可權'],
  [/系統依後端回傳的 `Role` 設定許可權/g, '系統依登入角色設定許可權'],
  [/後端回傳的錯誤訊息/g, '系統回傳的錯誤訊息'],
  [/重新向後端查詢目前條件下的資料/g, '重新載入目前條件下的資料'],
  [/等待設定寫入後端/g, '等待設定儲存'],
  [/後端引數載入失敗/g, '系統引數載入失敗'],
  [/VCS 後端連線中斷/g, '車載系統連線中斷'],
  [/與 VCS 後端連線狀態/g, '車載系統連線狀態'],
  [/重啟 VCS 後端/g, '重啟車載系統'],
  [/與車載控制後端（Rosbridge／VCS）通訊狀態/g, '車控系統連線狀態'],
  [/車載後端與 IO 仍連線/g, '車控系統與 IO 仍連線'],
  [/後端伺服器錯誤/g, '伺服器連線錯誤'],
  [/後端錯誤提示/g, '連線錯誤提示'],
  [/後端連線中斷/g, '車載系統連線中斷'],
  [/後端斷線/g, '車載系統連線中斷'],
  [/（`backend_server_error`）/g, ''],
  [/（路由 `\/`）/g, ''],
  [/路由 `\/alarm` 亦指向同一元件。\n\n/g, ''],
  [/含 `AGVHeader` 的車載頁面/g, '含頂部狀態列的車載頁面'],
  [/（CarName）/g, ''],
  [/；雙擊可觸發除錯功能/g, ''],
  [/\n- AGV 編號區塊 \*\*雙擊\*\* 觸發除錯 API，僅供開發人員使用\n/g, '\n'],
  [/帳號與 API 端點不一定通用/g, '帳號不一定通用'],
  [
    /登入資訊會寫入瀏覽器 `localStorage`，過載頁面後可能仍保留登入狀態/g,
    '重新整理頁面後可能仍保留登入狀態',
  ],
  [/系統呼叫 `clear_alarm_with_code` 清除該異常碼的即時警報/g, '清除該異常碼的即時警報'],
  [
    /\n- `BackendExceptionMessageDisplay`、`SystemErrorNotify` 以獨立對話方塊顯示，不屬於 `#vcs-alarms` 警示列\n/g,
    '\n',
  ],
  [/或 `SystemErrorNotify` 全螢幕警告/g, '或全螢幕系統錯誤警告'],
  [/每筆警報以 `el-alert` 卡片呈現/g, '每筆警報以警示卡片呈現'],
  [
    /\| Warning \| 黃色（warning） \| `ELevel == 0` \|\n\| Alarm \| 紅色（error） \| `ELevel != 0` \|/g,
    '| Warning | 黃色 |\n| Alarm | 紅色 |',
  ],
  [/（`OriginalZomm`）/g, ''],
  [/（`GoToAGVLoc`）/g, ''],
  [/（`CurrentRobotSpeedCommand`）/g, ''],
  [/（`QuicklyActions`）/g, ''],
  [/Version2 主畫面底部改為 `HomeviewFooter`/g, 'Version2 主畫面底部改為新版底部列'],
  [/若系統引數 `IsQuicklyActionFooterDisplay` 設為 false，此列可能隱藏。\n\n/g, ''],
  [
    /未登入時此開關是否顯示，依系統引數 `CstReaderSwitchDisplayWhenNotLogin` 決定；已登入使用者一律可見。/g,
    '已登入使用者可見並操作此開關。',
  ],
  [/修改開關需 \*\*Developer（Role ≥ 2）\*\* 以上許可權/g, '修改開關需 **Developer** 以上許可權'],
  [/（Role 3）/g, ''],
  [/（Role ≥ 2）/g, ''],
  [/Role 3 不受/g, 'God 角色不受'],
  [/Role ≥ 2/g, 'Developer 以上'],
  [/Agv_Type = 2/g, 'Inspection 車型'],
  [/（`IsSystemIniting`）/g, ''],
  [
    /God 使用者於 SideMenuDrawer 另有進階維護選單（需 God Mode），不在本側邊欄範圍內/g,
    'God 使用者另有進階維護選單，不在本側邊欄範圍內',
  ],
  [/以 OpenLayers 呈現/g, '以地圖介面呈現'],
  [/OpenLayers 呈現/g, '地圖介面呈現'],
  [
    /畫面可能另以 `EQHandshakingNotify` 浮層提示交握進度或失敗原因/g,
    '畫面可能另以交握提示浮層顯示進度或失敗原因',
  ],
  [/系統引數 `EQHSTimeouts` 中的逾時秒數/g, '系統設定的逾時秒數'],
  [/,`EQHandshakingNotify` 可能顯示/g, '，交握提示浮層可能顯示'],
  [/或 `AGVLocalization` 進行定位輔助/g, '或 **定位** 功能進行定位輔助'],
  [
    /地圖編輯（新增／移除站點、點位設定）為 \*\*edit_mode\*\* 功能，一般現場操作頁 `task_allocatable=true` 時以派任務為主/g,
    '地圖編輯（新增／移除站點、點位設定）為進階維護功能，一般現場操作以派發任務為主',
  ],
  [/在 \*\*Task Delivery\*\* 確認對話方塊中確認/g, '在 **任務確認** 對話方塊中確認'],
  [/切換離開 \*\*移動控制\*\* 子頁籤時，系統會自動 \*\*force_stop\*\* 停止鍵盤移動。/g, '切換離開 **移動控制** 子頁籤時，系統會自動停止鍵盤移動。'],
  [/切換離開 \*\*移動控制\*\* 時系統自動 \*\*force_stop\*\*/g, '切換離開 **移動控制** 時系統會自動停止鍵盤移動'],
  [/對應子頁籤：\*\*移動控制\*\*（`AgvcControl`、`AgvcControlPanel`、`TaskDelivery`）/g, '**移動控制** 子頁籤'],
  [/對應子頁籤：\*\*牙叉控制\*\*（`ZAxisControl`；僅 Fork 車型 `agv_type == 0`）/g, '**牙叉控制** 子頁籤（僅 Fork 車型）'],
  [/對應子頁籤：\*\*Input\*\*（`IOTable`，`digital_type="input"`）/g, '**Input** 子頁籤'],
  [/對應子頁籤：\*\*Output\*\*（`IOTable`，`isOutput="true"`）/g, '**Output** 子頁籤'],
  [
    /\| `SelectedFeatureMovable` \| 移動 \|\n\| `SelectedFeatureLDULDable` \| 放貨、取貨、層數 \|\n\| `SelectedFeatureChargable` \| 充電 \|\n\| `SelectedFeatureBatExchangable` \| 交換電池（優先於充電） \|\n\| `SelectedFeatureIsVirtualPt` \| 虛擬點不可為終點，\*\*移動\*\* 停用 \|/g,
    '| 站點可移動 | 移動 |\n| 站點可取放貨 | 放貨、取貨、層數 |\n| 站點可充電 | 充電 |\n| 站點可換電 | 交換電池（優先於充電） |\n| 虛擬點 | 不可為終點，**移動** 停用 |',
  ],
  [/本列與 \[側邊操作區\][^\n]+Version2 介面將模式開關移至底部 `HomeviewFooter`/g, (match) =>
    match.replace(' `HomeviewFooter`', ' 新版底部列'),
  ],
];

function cleanContent(content, isVehicle) {
  content = content.replace(/^對應前端模組：[^\n]+\n\n/gm, '');
  content = content.replace(/^對應後端：[^\n]+\n\n/gm, '');
  content = content.replace(/^對應前端模組：[^\n]+\n/gm, '');
  content = content.replace(/^對應後端：[^\n]+\n/gm, '');

  content = content.replace(/\{\/\* TODO: 插入 \w+ 截圖 \*\/\}/g, '{/* TODO: 插入截圖 */}');

  if (isVehicle) {
    for (const item of VEHICLE_REPLACEMENTS) {
      if (typeof item[1] === 'function') {
        content = content.replace(item[0], item[1]);
      } else {
        content = content.replace(item[0], item[1]);
      }
    }
  }

  return content;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (entry.name.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

let updated = 0;

for (const dir of TARGET_DIRS) {
  const isVehicle = dir.includes('vehicle-guide');
  for (const filePath of walk(dir)) {
    const original = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanContent(original, isVehicle);
    if (cleaned !== original) {
      fs.writeFileSync(filePath, cleaned, 'utf8');
      updated += 1;
      console.log(`Updated ${path.relative(path.join(__dirname, '..'), filePath)}`);
    }
  }
}

console.log(`Done. Updated ${updated} files.`);
