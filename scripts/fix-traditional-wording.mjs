import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REPLACEMENTS = [
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
  [/label: '檔案'/g, "label: '文件'"],
  [/title: '檔案'/g, "title: '文件'"],
  [/ \| 檔案 \|/g, ' | 文件 |'],
  [/或 \*\*定位\*\* 或 \*\*定位\*\* 功能/g, '或 **定位** 功能'],
];

const TARGET_DIRS = ['docs', 'src', 'blog'];
const ROOT_FILES = ['docusaurus.config.js'];

function applyReplacements(text) {
  let result = text;
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.name === 'node_modules' || entry.name === 'build') {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(mdx|md|js)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

let count = 0;

for (const dir of TARGET_DIRS) {
  for (const filePath of walk(path.join(ROOT, dir))) {
    const original = fs.readFileSync(filePath, 'utf8');
    const fixed = applyReplacements(original);
    if (fixed !== original) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      count += 1;
      console.log(`Fixed ${path.relative(ROOT, filePath)}`);
    }
  }
}

for (const fileName of ROOT_FILES) {
  const filePath = path.join(ROOT, fileName);
  const original = fs.readFileSync(filePath, 'utf8');
  const fixed = applyReplacements(original);
  if (fixed !== original) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    count += 1;
    console.log(`Fixed ${fileName}`);
  }
}

console.log(`Done. Fixed ${count} files.`);
