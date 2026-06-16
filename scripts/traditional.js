const OpenCC = require('opencc-js');

const converter = OpenCC.Converter({from: 'cn', to: 'twp'});

const POST_REPLACEMENTS = [
  [/實時/g, '即時'],
  [/默認/g, '預設'],
  [/服務器/g, '伺服器'],
  [/整合檔案/g, '整合文件'],
  [/技術檔案/g, '技術文件'],
  [/檔案首頁/g, '文件首頁'],
  [/派車系統檔案/g, '派車系統文件'],
  [/開始閱讀檔案/g, '開始閱讀文件'],
  [/詳細檔案/g, '詳細文件'],
  [/API 檔案/g, 'API 文件'],
  [/相關檔案/g, '相關文件'],
  [/同步至檔案目錄/g, '同步至文件目錄'],
  [/檔案未規定/g, '文件未規定'],
  [/SOP 標準作業程式/g, 'SOP 標準作業程序'],
  [/AGV 現場標準作業程式 PDF/g, 'AGV 現場標準作業程序 PDF'],
];

function toTraditional(text) {
  if (text == null || text === '') {
    return text ?? '';
  }

  let result = converter(String(text));
  for (const [pattern, replacement] of POST_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

module.exports = {toTraditional};
