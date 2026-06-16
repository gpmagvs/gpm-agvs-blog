const fs = require('fs');
const path = require('path');

const SOP_DIR = path.join(__dirname, '..', 'static', 'sop');
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'sop-manifest.json');
const DOCS_SOP_DIR = path.join(__dirname, '..', 'docs', 'sop');

const CATEGORY_MAP = {
  '000': {label: '故障排除', order: 1, dir: 'troubleshooting'},
  '010': {label: '基本操作', order: 2, dir: 'basics'},
  '100': {label: '充電作業', order: 3, dir: 'charging'},
};

const FALLBACK_CATEGORY = {label: '其他', order: 99, dir: 'other'};

function parsePdfFilename(filename) {
  const base = filename.replace(/\.pdf$/i, '');
  const dateMatch = base.match(/_(\d{4})_(\d{4})$/);
  let date = null;
  let namePart = base;

  if (dateMatch) {
    const [, year, monthDay] = dateMatch;
    date = `${year}-${monthDay.slice(0, 2)}-${monthDay.slice(2)}`;
    namePart = base.slice(0, dateMatch.index);
  }

  const codeMatch = namePart.match(/^(SOP_(\d+))/);
  const code = codeMatch ? codeMatch[1] : 'SOP_999';
  const series = codeMatch ? codeMatch[2] : '999';
  const category = CATEGORY_MAP[series] ?? FALLBACK_CATEGORY;
  const title = (namePart.replace(/^SOP_\d+_?/, '').replace(/^AGV_/, 'AGV ').trim()) || base;
  const id = encodeURIComponent(filename);

  return {
    id,
    filename,
    code,
    title,
    date,
    category: category.label,
    categoryOrder: category.order,
    categoryDir: category.dir,
  };
}

function toDocSlug(item) {
  const titleSlug = item.title
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .toLowerCase();

  return `${item.code.toLowerCase()}-${titleSlug}`.replace(/-+/g, '-');
}

function cleanGeneratedDocs() {
  if (!fs.existsSync(DOCS_SOP_DIR)) {
    return;
  }

  for (const entry of fs.readdirSync(DOCS_SOP_DIR, {withFileTypes: true})) {
    if (!entry.isDirectory()) {
      continue;
    }

    const categoryDir = path.join(DOCS_SOP_DIR, entry.name);
    for (const file of fs.readdirSync(categoryDir)) {
      if (file.endsWith('.mdx')) {
        fs.unlinkSync(path.join(categoryDir, file));
      }
    }
  }
}

function writeCategoryMeta(categoryDir, label, position) {
  fs.mkdirSync(categoryDir, {recursive: true});
  fs.writeFileSync(
    path.join(categoryDir, '_category_.json'),
    `${JSON.stringify({label, position}, null, 2)}\n`,
    'utf8',
  );
}

function generateDocPages(items) {
  cleanGeneratedDocs();

  const categoriesWritten = new Set();

  for (const item of items) {
    const docSlug = toDocSlug(item);
    item.docSlug = docSlug;
    item.docId = `sop/${item.categoryDir}/${docSlug}`;

    const categoryDir = path.join(DOCS_SOP_DIR, item.categoryDir);
    if (!categoriesWritten.has(item.categoryDir)) {
      writeCategoryMeta(categoryDir, item.category, item.categoryOrder);
      categoriesWritten.add(item.categoryDir);
    }

    const mdx = `---
title: ${item.title}
sidebar_label: ${item.title}
---

import SopPdfViewer from '@site/src/components/Sop/SopPdfViewer';

<SopPdfViewer filename=${JSON.stringify(item.filename)} />
`;

    fs.writeFileSync(path.join(categoryDir, `${docSlug}.mdx`), mdx, 'utf8');
  }
}

function generateManifest() {
  if (!fs.existsSync(SOP_DIR)) {
    fs.mkdirSync(SOP_DIR, {recursive: true});
  }

  const files = fs
    .readdirSync(SOP_DIR)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .sort((a, b) => a.localeCompare(b, 'zh-Hant'));

  const items = files.map(parsePdfFilename);
  generateDocPages(items);

  fs.mkdirSync(path.dirname(OUTPUT), {recursive: true});
  fs.writeFileSync(
    OUTPUT,
    `${JSON.stringify({generatedAt: new Date().toISOString(), items}, null, 2)}\n`,
    'utf8',
  );

  console.log(`Generated ${items.length} SOP entries -> ${OUTPUT}`);
  console.log(`Generated ${items.length} SOP doc pages -> ${DOCS_SOP_DIR}`);
}

generateManifest();
