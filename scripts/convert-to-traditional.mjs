import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import OpenCC from 'opencc-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const converter = OpenCC.Converter({from: 'cn', to: 'twp'});

const EXTRA_REPLACEMENTS = [
  [/實時/g, '即時'],
  [/默認/g, '預設'],
  [/服務器/g, '伺服器'],
  [/zh-Hans/g, 'zh-Hant'],
];

const TARGET_DIRS = ['docs', 'src', 'blog', 'scripts'];
const ROOT_FILES = ['README.md', 'docusaurus.config.js', 'sidebars.js'];

const SKIP_FILES = new Set(['package-lock.json']);

const TEXT_EXTENSIONS = new Set(['.mdx', '.md', '.js', '.json', '.yml', '.yaml', '.css']);

function applyExtraReplacements(text) {
  let result = text;
  for (const [pattern, replacement] of EXTRA_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function convertText(text) {
  return applyExtraReplacements(converter(text));
}

function convertMarkdownLike(content) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part) => (part.startsWith('```') ? part : convertText(part)))
    .join('');
}

function shouldProcess(filePath) {
  const base = path.basename(filePath);
  if (SKIP_FILES.has(base)) {
    return false;
  }
  return TEXT_EXTENSIONS.has(path.extname(filePath));
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    if (entry.name === 'node_modules' || entry.name === 'build' || entry.name === '.git') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (shouldProcess(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function convertFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath);
  const converted =
    ext === '.mdx' || ext === '.md'
      ? convertMarkdownLike(original)
      : convertText(original);

  if (converted !== original) {
    fs.writeFileSync(filePath, converted, 'utf8');
    console.log(`Converted ${path.relative(ROOT, filePath)}`);
    return true;
  }

  return false;
}

let count = 0;

for (const dir of TARGET_DIRS) {
  for (const filePath of walk(path.join(ROOT, dir))) {
    if (convertFile(filePath)) {
      count += 1;
    }
  }
}

for (const fileName of ROOT_FILES) {
  const filePath = path.join(ROOT, fileName);
  if (fs.existsSync(filePath) && convertFile(filePath)) {
    count += 1;
  }
}

console.log(`Done. Converted ${count} files.`);
