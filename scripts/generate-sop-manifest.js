const fs = require('fs');
const path = require('path');

const SOP_DIR = path.join(__dirname, '..', 'static', 'sop');
const OUTPUT = path.join(__dirname, '..', 'src', 'data', 'sop-manifest.json');

const CATEGORY_MAP = {
  '000': {label: '故障排除', order: 1},
  '010': {label: '基本操作', order: 2},
  '100': {label: '充電作業', order: 3},
};

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
  const category = CATEGORY_MAP[series] ?? {label: '其他', order: 99};
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
  };
}

function generateManifest() {
  if (!fs.existsSync(SOP_DIR)) {
    fs.mkdirSync(SOP_DIR, {recursive: true});
  }

  const files = fs
    .readdirSync(SOP_DIR)
    .filter((file) => file.toLowerCase().endsWith('.pdf'))
    .sort((a, b) => a.localeCompare(b, 'zh-Hans'));

  const items = files.map(parsePdfFilename);

  fs.mkdirSync(path.dirname(OUTPUT), {recursive: true});
  fs.writeFileSync(
    OUTPUT,
    `${JSON.stringify({generatedAt: new Date().toISOString(), items}, null, 2)}\n`,
    'utf8',
  );

  console.log(`Generated ${items.length} SOP entries -> ${OUTPUT}`);
}

generateManifest();
