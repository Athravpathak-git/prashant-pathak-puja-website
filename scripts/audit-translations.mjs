import fs from 'fs';
import path from 'path';

const languages = ['mr', 'en', 'hi', 'te', 'kn', 'ta', 'ml'];
const locales = languages.map((lang) => ({
  lang,
  data: JSON.parse(fs.readFileSync(path.join('src/lib/locales', `${lang}.json`), 'utf8')),
}));

function getVal(obj, p) {
  return p.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj);
}

function scanDir(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) files = files.concat(scanDir(full));
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) files.push(full);
  }
  return files;
}

const allKeys = new Set();
const files = scanDir('src');
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Match t('key') or t("key") where t is not part of a word like get or set
  const matches = content.matchAll(/(?:^|[^a-zA-Z0-9_])t\(\s*['"]([a-zA-Z0-9_.]+)['"]/g);
  for (const m of matches) {
    allKeys.add(m[1]);
  }
  if (content.includes('booking_flow.step')) {
    for (let i = 1; i <= 4; i++) {
      allKeys.add(`booking_flow.step${i}_title`);
      allKeys.add(`booking_flow.step${i}_desc`);
    }
  }
}

console.log('Total unique keys requested in code:', allKeys.size);

const missing = [];
for (const key of Array.from(allKeys).sort()) {
  for (const { lang, data } of locales) {
    const val = getVal(data, key);
    if (typeof val !== 'string' || val.trim() === '') {
      missing.push({ lang, key });
    }
  }
}

console.log('Missing translations count:', missing.length);
if (missing.length > 0) {
  const byKey = {};
  for (const { lang, key } of missing) {
    if (!byKey[key]) byKey[key] = [];
    byKey[key].push(lang);
  }
  console.log('Missing keys and their affected languages:');
  console.log(JSON.stringify(byKey, null, 2));
} else {
  console.log('✓ ALL KEYS PRESENT ACROSS ALL 7 LANGUAGES!');
}
